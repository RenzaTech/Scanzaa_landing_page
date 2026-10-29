const {
  MAX_DELIVERY_ATTEMPTS,
  escapeHtml,
  retryDelaySeconds,
} = require('./lead-utils.cjs');
const { applyStoredDeliveryEvents } = require('./lead-database.cjs');

const REQUEST_TIMEOUT_MS = 4500;

function missingConfiguration(channel) {
  if (channel === 'customer_email' || channel === 'team_email') {
    const required = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'];
    if (channel === 'team_email') required.push('TEAM_NOTIFICATION_EMAIL');
    return required.filter((key) => !process.env[key]);
  }

  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_TEMPLATE_NAME',
    'WHATSAPP_TEMPLATE_LANGUAGE',
    'WHATSAPP_CLOUD_API_VERSION',
  ];
  return required.filter((key) => !process.env[key]);
}

function getEmailMessage(job, lead) {
  const isTeam = job.channel === 'team_email';
  const owner = escapeHtml(lead.owner_name);
  const restaurant = escapeHtml(lead.restaurant_name);
  const email = escapeHtml(lead.email);
  const phone = escapeHtml(lead.phone);
  const detailHtml = isTeam
    ? `<p><strong>Restaurant:</strong> ${restaurant}</p><p><strong>Owner:</strong> ${owner}</p><p><strong>Email:</strong> ${email}</p><p><strong>WhatsApp:</strong> ${phone}</p>`
    : `<p>Thanks for contacting Scanzaa, ${owner}. We have received your request for ${restaurant} and our team will follow up.</p>`;
  const detailText = isTeam
    ? `Restaurant: ${lead.restaurant_name}\nOwner: ${lead.owner_name}\nEmail: ${lead.email}\nWhatsApp: ${lead.phone}`
    : `Thanks for contacting Scanzaa, ${lead.owner_name}. We have received your request for ${lead.restaurant_name} and our team will follow up.`;

  return {
    to: isTeam ? process.env.TEAM_NOTIFICATION_EMAIL : lead.email,
    subject: isTeam ? `New Scanzaa restaurant inquiry: ${lead.restaurant_name}` : 'We received your Scanzaa inquiry',
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#183b34"><h2>${isTeam ? 'New restaurant inquiry' : 'Thanks for reaching out to Scanzaa'}</h2>${detailHtml}</div>`,
    text: detailText,
  };
}

function getWhatsAppMessage(lead) {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: lead.phone.slice(1),
    type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE },
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: lead.owner_name },
          { type: 'text', text: lead.restaurant_name },
        ],
      }],
    },
  };
}

async function providerRequest(url, options, { whatsapp = false } = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const failure = new Error(
      error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'Provider request timed out.'
        : 'Provider request could not be completed.'
    );
    if (whatsapp) failure.code = 'DELIVERY_UNKNOWN';
    throw failure;
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.message || body?.error?.message || `Provider returned HTTP ${response.status}.`;
    const failure = new Error(String(message).slice(0, 500));
    if (response.status < 500 && response.status !== 408 && response.status !== 429) {
      failure.code = 'PERMANENT_DELIVERY_FAILURE';
    } else if (whatsapp && response.status >= 500) {
      failure.code = 'DELIVERY_UNKNOWN';
    }
    throw failure;
  }
  return body;
}

async function sendToProvider(job, lead) {
  if (job.channel === 'customer_email' || job.channel === 'team_email') {
    const message = getEmailMessage(job, lead);
    const result = await providerRequest('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `scanzaa-${job.id}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });
    if (!result?.id) throw new Error('Email provider did not return a message ID.');
    return { messageId: result.id, providerStatus: 'accepted' };
  }

  const version = process.env.WHATSAPP_CLOUD_API_VERSION;
  if (!/^v\d+\.\d+$/.test(version)) {
    const error = new Error('WHATSAPP_CLOUD_API_VERSION is invalid.');
    error.code = 'PERMANENT_DELIVERY_FAILURE';
    throw error;
  }
  const result = await providerRequest(
    `https://graph.facebook.com/${version}/${encodeURIComponent(process.env.WHATSAPP_PHONE_NUMBER_ID)}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getWhatsAppMessage(lead)),
    },
    { whatsapp: true }
  );
  const messageId = result?.messages?.[0]?.id;
  if (!messageId) {
    const error = new Error('WhatsApp provider did not return a message ID.');
    error.code = 'DELIVERY_UNKNOWN';
    throw error;
  }
  return { messageId, providerStatus: 'accepted' };
}

async function setBlocked(sql, jobId, missing) {
  await sql`
    UPDATE scanzaa_delivery_jobs
    SET
      status = 'blocked',
      last_error = ${`Missing configuration: ${missing.join(', ')}`},
      next_attempt_at = NOW() + INTERVAL '1 hour',
      updated_at = NOW()
    WHERE id = ${jobId}
      AND status IN ('pending', 'retrying', 'blocked')
  `;
  return 'blocked';
}

async function claimJob(sql, jobId) {
  const [job] = await sql`
    UPDATE scanzaa_delivery_jobs
    SET status = 'sending', attempt_count = attempt_count + 1, updated_at = NOW()
    WHERE id = ${jobId}
      AND attempt_count < ${MAX_DELIVERY_ATTEMPTS}
      AND (
        status = 'pending'
        OR (status IN ('retrying', 'blocked') AND next_attempt_at <= NOW())
      )
    RETURNING id, lead_id, channel, attempt_count
  `;
  return job;
}

async function completeClaimedJob(sql, job, lead) {
  let result;
  try {
    result = await sendToProvider(job, lead);
  } catch (error) {
    const unknown = error.code === 'DELIVERY_UNKNOWN';
    const exhausted = job.attempt_count >= MAX_DELIVERY_ATTEMPTS;
    const nextStatus = unknown ? 'unknown' : error.code === 'PERMANENT_DELIVERY_FAILURE' || exhausted ? 'failed' : 'retrying';
    const delay = retryDelaySeconds(job.attempt_count);
    await sql`
      UPDATE scanzaa_delivery_jobs
      SET
        status = ${nextStatus},
        provider_status = ${nextStatus},
        last_error = ${String(error.message || 'Delivery failed').slice(0, 500)},
        next_attempt_at = NOW() + ${delay} * INTERVAL '1 second',
        updated_at = NOW()
      WHERE id = ${job.id} AND status = 'sending'
    `;
    return nextStatus;
  }

  await sql`
    UPDATE scanzaa_delivery_jobs
    SET
      status = 'accepted',
      provider_status = ${result.providerStatus},
      provider_message_id = ${result.messageId},
      last_error = NULL,
      updated_at = NOW()
    WHERE id = ${job.id} AND status = 'sending'
  `;
  await applyStoredDeliveryEvents(sql, {
    channel: job.channel,
    jobId: job.id,
    messageId: result.messageId,
  });
  return 'accepted';
}

async function deliverJob(sql, job, lead) {
  const missing = missingConfiguration(job.channel);
  if (missing.length > 0) return setBlocked(sql, job.id, missing);
  const claimed = await claimJob(sql, job.id);
  if (!claimed) return job.status;
  return completeClaimedJob(sql, claimed, lead);
}

async function claimDueJobs(sql, limit = 10) {
  const ready = {
    customerEmail: missingConfiguration('customer_email').length === 0,
    customerWhatsApp: missingConfiguration('customer_whatsapp').length === 0,
    teamEmail: missingConfiguration('team_email').length === 0,
  };
  if (!Object.values(ready).some(Boolean)) return [];

  await sql`
    UPDATE scanzaa_delivery_jobs
    SET status = 'unknown', provider_status = 'unknown',
      last_error = 'Previous WhatsApp send ended before its outcome was confirmed.',
      updated_at = NOW()
    WHERE channel = 'customer_whatsapp'
      AND status = 'sending'
      AND updated_at < NOW() - INTERVAL '10 minutes'
  `;

  return sql`
    WITH due_jobs AS (
      SELECT id
      FROM scanzaa_delivery_jobs
      WHERE (
        (channel = 'customer_email' AND ${ready.customerEmail})
        OR (channel = 'customer_whatsapp' AND ${ready.customerWhatsApp})
        OR (channel = 'team_email' AND ${ready.teamEmail})
      )
        AND attempt_count < ${MAX_DELIVERY_ATTEMPTS}
        AND (
          (status IN ('pending', 'retrying', 'blocked') AND next_attempt_at <= NOW())
          OR (status = 'sending' AND channel <> 'customer_whatsapp' AND updated_at < NOW() - INTERVAL '10 minutes')
        )
      ORDER BY next_attempt_at
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    UPDATE scanzaa_delivery_jobs AS job
    SET status = 'sending', attempt_count = job.attempt_count + 1, updated_at = NOW()
    FROM due_jobs, scanzaa_leads AS lead
    WHERE job.id = due_jobs.id AND lead.id = job.lead_id
    RETURNING
      job.id, job.lead_id, job.channel, job.attempt_count,
      lead.owner_name, lead.restaurant_name, lead.email, lead.phone
  `;
}

module.exports = {
  claimDueJobs,
  completeClaimedJob,
  deliverJob,
};
