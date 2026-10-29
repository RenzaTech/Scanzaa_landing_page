const { Pool } = require('pg');
const { hashValue } = require('./lead-utils.cjs');

const DELIVERY_CHANNELS = ['customer_email', 'customer_whatsapp', 'team_email'];
let schemaReady;
let pool;

function createSql(pool) {
  function sql(strings, ...values) {
    let text = strings[0];
    for (let index = 0; index < values.length; index += 1) {
      text += `$${index + 1}${strings[index + 1]}`;
    }
    const query = { text, values };
    return {
      query,
      then(onFulfilled, onRejected) {
        return pool.query(query).then(({ rows }) => rows).then(onFulfilled, onRejected);
      },
    };
  }

  sql.transaction = async (queries) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const statement of queries) {
        if (!statement?.query) throw new TypeError('Transaction entries must be SQL queries.');
        const { rows } = await client.query(statement.query);
        results.push(rows);
      }
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  return sql;
}

function getSql() {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not configured.');
    error.code = 'CONFIGURATION_MISSING';
    throw error;
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    pool.on('error', (error) => {
      console.error('Database connection failed.', {
        code: error.code || 'DATABASE_CONNECTION_ERROR',
      });
    });
  }
  return createSql(pool);
}

async function ensureSchema(sql) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS scanzaa_leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_name TEXT NOT NULL,
          restaurant_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          consented_at TIMESTAMPTZ NOT NULL,
          consent_version TEXT NOT NULL,
          idempotency_key UUID NOT NULL UNIQUE,
          source_ip_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS scanzaa_delivery_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          lead_id UUID NOT NULL REFERENCES scanzaa_leads(id) ON DELETE CASCADE,
          channel TEXT NOT NULL CHECK (channel IN ('customer_email', 'customer_whatsapp', 'team_email')),
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'accepted', 'delivered', 'retrying', 'blocked', 'failed', 'unknown')),
          attempt_count INTEGER NOT NULL DEFAULT 0,
          next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          provider_message_id TEXT,
          provider_status TEXT,
          last_error TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (lead_id, channel)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS scanzaa_webhook_events (
          id BIGSERIAL PRIMARY KEY,
          provider TEXT NOT NULL,
          event_id TEXT NOT NULL,
          message_id TEXT NOT NULL,
          status TEXT NOT NULL,
          error_message TEXT,
          received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (provider, event_id)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS scanzaa_lead_rate_limits (
          source_ip_hash TEXT PRIMARY KEY,
          window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          request_count INTEGER NOT NULL DEFAULT 1
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS scanzaa_delivery_due_idx
        ON scanzaa_delivery_jobs (next_attempt_at)
        WHERE status IN ('pending', 'retrying', 'blocked', 'sending')
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS scanzaa_webhook_message_idx
        ON scanzaa_webhook_events (provider, message_id)
      `;
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  await schemaReady;
}

function getSourceIpHash(request) {
  if (!process.env.RATE_LIMIT_SECRET) {
    const error = new Error('RATE_LIMIT_SECRET is not configured.');
    error.code = 'CONFIGURATION_MISSING';
    throw error;
  }
  const ip = request.headers['x-real-ip']
    || request.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || 'unknown';
  return hashValue(`${process.env.RATE_LIMIT_SECRET}:${ip}`);
}

async function allowLeadRequest(sql, sourceIpHash) {
  const [row] = await sql`
    INSERT INTO scanzaa_lead_rate_limits (source_ip_hash)
    VALUES (${sourceIpHash})
    ON CONFLICT (source_ip_hash) DO UPDATE SET
      request_count = CASE
        WHEN scanzaa_lead_rate_limits.window_started_at < NOW() - INTERVAL '1 hour' THEN 1
        ELSE scanzaa_lead_rate_limits.request_count + 1
      END,
      window_started_at = CASE
        WHEN scanzaa_lead_rate_limits.window_started_at < NOW() - INTERVAL '1 hour' THEN NOW()
        ELSE scanzaa_lead_rate_limits.window_started_at
      END
    RETURNING request_count
  `;
  if (!row) throw new Error('Lead request rate limit could not be checked.');
  return row.request_count <= 5;
}

async function createLead(sql, lead, idempotencyKey, sourceIpHash) {
  const [insertedLeads] = await sql.transaction([
    sql`
      INSERT INTO scanzaa_leads (
        owner_name, restaurant_name, email, phone, consented_at,
        consent_version, idempotency_key, source_ip_hash
      )
      VALUES (
        ${lead.ownerName}, ${lead.restaurantName}, ${lead.email}, ${lead.phone}, NOW(),
        ${process.env.PRIVACY_POLICY_VERSION || 'v1'}, ${idempotencyKey}, ${sourceIpHash}
      )
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING id
    `,
    sql`
      INSERT INTO scanzaa_delivery_jobs (lead_id, channel)
      SELECT id, channel
      FROM scanzaa_leads
      CROSS JOIN (VALUES ('customer_email'), ('customer_whatsapp'), ('team_email')) AS channels(channel)
      WHERE idempotency_key = ${idempotencyKey}
      ON CONFLICT (lead_id, channel) DO NOTHING
    `,
  ]);

  const [savedLead] = await sql`
    SELECT id, owner_name, restaurant_name, email, phone, created_at
    FROM scanzaa_leads
    WHERE idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  if (!savedLead) throw new Error('Lead insert was not confirmed.');
  if (
    savedLead.owner_name !== lead.ownerName
    || savedLead.restaurant_name !== lead.restaurantName
    || savedLead.email !== lead.email
    || savedLead.phone !== lead.phone
  ) {
    const error = new Error('This request key has already been used for different form details.');
    error.code = 'IDEMPOTENCY_CONFLICT';
    throw error;
  }

  const jobs = await sql`
    SELECT id, channel, status, attempt_count, next_attempt_at
    FROM scanzaa_delivery_jobs
    WHERE lead_id = ${savedLead.id}
    ORDER BY channel
  `;
  if (jobs.length !== DELIVERY_CHANNELS.length) throw new Error('Lead notification records were not confirmed.');
  return { lead: savedLead, jobs, isNew: insertedLeads.length > 0 };
}

async function getDeliveryStates(sql, leadId) {
  const jobs = await sql`
    SELECT channel, status
    FROM scanzaa_delivery_jobs
    WHERE lead_id = ${leadId}
  `;
  return Object.fromEntries(jobs.map(({ channel, status }) => [channel, status]));
}

async function recordDeliveryEvent(sql, { provider, eventId, messageId, status, errorMessage }) {
  await sql`
    WITH received AS (
      INSERT INTO scanzaa_webhook_events (provider, event_id, message_id, status, error_message)
      VALUES (${provider}, ${eventId}, ${messageId}, ${status}, ${errorMessage ? String(errorMessage).slice(0, 500) : null})
      ON CONFLICT (provider, event_id) DO NOTHING
      RETURNING id
    )
    UPDATE scanzaa_delivery_jobs
    SET
      status = CASE
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'delivered'
        ) THEN 'delivered'
        WHEN status = 'delivered' THEN 'delivered'
        WHEN status = 'failed' THEN 'failed'
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
        ) THEN 'failed'
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'accepted'
        ) THEN 'accepted'
        ELSE status
      END,
      provider_status = (
        SELECT event.status FROM scanzaa_webhook_events event
        WHERE event.provider = ${provider} AND event.message_id = ${messageId}
        ORDER BY event.received_at DESC, event.id DESC LIMIT 1
      ),
      last_error = CASE
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'delivered'
        ) THEN NULL
        WHEN status = 'delivered' THEN NULL
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
        ) THEN (
          SELECT event.error_message FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
          ORDER BY event.received_at DESC, event.id DESC LIMIT 1
        )
        ELSE last_error
      END,
      updated_at = NOW()
    FROM received
    WHERE (
        channel = 'customer_whatsapp' AND ${provider} = 'whatsapp'
        OR channel IN ('customer_email', 'team_email') AND ${provider} = 'resend'
      )
      AND provider_message_id = ${messageId}
  `;
}

async function applyStoredDeliveryEvents(sql, { channel, jobId, messageId }) {
  const provider = channel === 'customer_whatsapp' ? 'whatsapp' : 'resend';
  await sql`
    UPDATE scanzaa_delivery_jobs
    SET
      status = CASE
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'delivered'
        ) THEN 'delivered'
        WHEN status = 'delivered' THEN 'delivered'
        WHEN status = 'failed' THEN 'failed'
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
        ) THEN 'failed'
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'accepted'
        ) THEN 'accepted'
        ELSE status
      END,
      provider_status = (
        SELECT event.status FROM scanzaa_webhook_events event
        WHERE event.provider = ${provider} AND event.message_id = ${messageId}
        ORDER BY event.received_at DESC, event.id DESC LIMIT 1
      ),
      last_error = CASE
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'delivered'
        ) THEN NULL
        WHEN EXISTS (
          SELECT 1 FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
        ) THEN (
          SELECT event.error_message FROM scanzaa_webhook_events event
          WHERE event.provider = ${provider} AND event.message_id = ${messageId} AND event.status = 'failed'
          ORDER BY event.received_at DESC, event.id DESC LIMIT 1
        )
        ELSE last_error
      END,
      updated_at = NOW()
    WHERE id = ${jobId} AND provider_message_id = ${messageId}
  `;
}

module.exports = {
  allowLeadRequest,
  applyStoredDeliveryEvents,
  createLead,
  ensureSchema,
  getDeliveryStates,
  getSourceIpHash,
  getSql,
  recordDeliveryEvent,
};
