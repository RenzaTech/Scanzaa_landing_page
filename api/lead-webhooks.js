const crypto = require('node:crypto');
const {
  ensureSchema,
  getSql,
  recordDeliveryEvent,
} = require('../server/lead-database.cjs');
const { hashValue } = require('../server/lead-utils.cjs');

const MAX_WEBHOOK_BYTES = 1024 * 1024;

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(body);
}

async function readRawBody(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > MAX_WEBHOOK_BYTES) {
      const error = new Error('Webhook request is too large.');
      error.code = 'BODY_TOO_LARGE';
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, length);
}

function safelyEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function verifyWhatsAppSignature(rawBody, signature) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || typeof signature !== 'string' || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safelyEqual(signature.slice(7).toLowerCase(), digest);
}

function verifyResendSignature(rawBody, headers) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const id = headers['svix-id'];
  const timestamp = headers['svix-timestamp'];
  const signatures = headers['svix-signature'];
  if (!secret || !id || !timestamp || !signatures || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  let key;
  try {
    key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  } catch {
    return false;
  }
  const signedContent = `${id}.${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto.createHmac('sha256', key).update(signedContent).digest();
  return signatures.split(' ').some((signature) => {
    const candidate = signature.split(',')[1];
    if (!candidate) return false;
    try {
      const actual = Buffer.from(candidate, 'base64');
      return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  });
}

function getWhatsAppUpdates(payload) {
  const updates = [];
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      for (const status of change.value?.statuses || []) {
        const mapped = status.status === 'delivered' || status.status === 'read' ? 'delivered'
          : status.status === 'failed' ? 'failed'
            : status.status === 'sent' ? 'accepted'
              : null;
        if (!mapped || typeof status.id !== 'string') continue;
        const event = JSON.stringify(status);
        const errorMessage = status.errors?.map((item) => item.title || item.message).filter(Boolean).join('; ');
        updates.push({
          provider: 'whatsapp',
          eventId: hashValue(event),
          messageId: status.id,
          status: mapped,
          errorMessage,
        });
      }
    }
  }
  return updates;
}

function getResendUpdate(payload, eventId) {
  const data = payload.data || {};
  const messageId = data.email_id || data.id;
  if (typeof messageId !== 'string') return null;
  const status = payload.type === 'email.delivered' ? 'delivered'
    : ['email.bounced', 'email.failed', 'email.complained'].includes(payload.type) ? 'failed'
      : ['email.sent', 'email.delivery_delayed'].includes(payload.type) ? 'accepted'
        : null;
  if (!status) return null;
  return {
    provider: 'resend',
    eventId,
    messageId,
    status,
    errorMessage: data.bounce?.message || data.failed?.reason || payload.type,
  };
}

module.exports = async function leadWebhooksHandler(request, response) {
  if (request.method === 'GET') {
    const mode = request.query?.['hub.mode'];
    const token = request.query?.['hub.verify_token'];
    const challenge = request.query?.['hub.challenge'];
    if (!process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return sendJson(response, 503, { error: 'Webhook verification is not configured.' });
    }
    if (mode === 'subscribe' && typeof token === 'string' && safelyEqual(token, process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN)) {
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return response.status(200).send(String(challenge || ''));
    }
    return sendJson(response, 403, { error: 'Webhook verification failed.' });
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const provider = request.headers['x-hub-signature-256'] ? 'whatsapp'
    : request.headers['svix-id'] ? 'resend'
      : null;
  if (!provider) return sendJson(response, 401, { error: 'Webhook signature is missing.' });

  let rawBody;
  try {
    rawBody = await readRawBody(request);
  } catch (error) {
    return sendJson(response, error.code === 'BODY_TOO_LARGE' ? 413 : 400, { error: 'Webhook request could not be read.' });
  }
  const signatureIsValid = provider === 'whatsapp'
    ? verifyWhatsAppSignature(rawBody, request.headers['x-hub-signature-256'])
    : verifyResendSignature(rawBody, request.headers);
  if (!signatureIsValid) return sendJson(response, 401, { error: 'Webhook signature is invalid.' });

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return sendJson(response, 400, { error: 'Webhook body is not valid JSON.' });
  }

  let sql;
  try {
    sql = getSql();
    await ensureSchema(sql);
    const updates = provider === 'whatsapp'
      ? getWhatsAppUpdates(payload)
      : [getResendUpdate(payload, request.headers['svix-id'])].filter(Boolean);
    for (const update of updates) await recordDeliveryEvent(sql, update);
    return sendJson(response, 200, { received: true, processed: updates.length });
  } catch (error) {
    console.error('Lead delivery webhook could not be processed.', {
      provider,
      code: error.code || 'WEBHOOK_PROCESSING_ERROR',
    });
    return sendJson(response, 503, { error: 'Webhook processing is temporarily unavailable.' });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
