const {
  allowLeadRequest,
  createLead,
  ensureSchema,
  getDeliveryStates,
  getSourceIpHash,
  getSql,
} = require('../server/lead-database.cjs');
const { MAX_BODY_BYTES, isValidIdempotencyKey, validateLead } = require('../server/lead-utils.cjs');
const { deliverJob } = require('../server/lead-delivery.cjs');

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(body);
}

function hasValidOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

module.exports = async function createLeadHandler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }
  if (!hasValidOrigin(request)) {
    return sendJson(response, 403, { error: 'Request origin is not allowed.' });
  }
  const mediaType = String(request.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/json') {
    return sendJson(response, 415, { error: 'Send form details as JSON.' });
  }
  if (Number(request.headers['content-length']) > MAX_BODY_BYTES) {
    return sendJson(response, 413, { error: 'Form submission is too large.' });
  }

  let body = request.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
      return sendJson(response, 413, { error: 'Form submission is too large.' });
    }
    try {
      body = JSON.parse(body);
    } catch {
      return sendJson(response, 400, { error: 'Form submission is not valid JSON.' });
    }
  } else if (Buffer.byteLength(JSON.stringify(body ?? null), 'utf8') > MAX_BODY_BYTES) {
    return sendJson(response, 413, { error: 'Form submission is too large.' });
  }

  const validation = validateLead(body);
  if (!validation.ok) return sendJson(response, 400, { error: 'Check the form fields and consent.', fields: validation.fields });

  const idempotencyKey = request.headers['idempotency-key'];
  if (!isValidIdempotencyKey(idempotencyKey)) {
    return sendJson(response, 400, { error: 'A valid request key is required. Please refresh the page and try again.' });
  }

  let sql;
  let sourceIpHash;
  let saved;
  try {
    sql = getSql();
    sourceIpHash = getSourceIpHash(request);
    await ensureSchema(sql);
    if (!(await allowLeadRequest(sql, sourceIpHash))) {
      response.setHeader('Retry-After', '3600');
      return sendJson(response, 429, { error: 'Too many requests. Please try again later.' });
    }
    saved = await createLead(sql, validation.value, idempotencyKey, sourceIpHash);
  } catch (error) {
    if (error.code === 'IDEMPOTENCY_CONFLICT') {
      return sendJson(response, 409, { error: error.message });
    }
    console.error('Lead could not be saved.', { code: error.code || 'DATABASE_ERROR' });
    return sendJson(response, 503, {
      error: 'We could not save your request right now. Please try again shortly.',
    });
  }

  const results = await Promise.allSettled(
    saved.jobs.map((job) => deliverJob(sql, job, {
      owner_name: saved.lead.owner_name,
      restaurant_name: saved.lead.restaurant_name,
      email: saved.lead.email,
      phone: saved.lead.phone,
    }))
  );
  const failedDeliveryUpdates = results.filter((result) => result.status === 'rejected').length;
  if (failedDeliveryUpdates > 0) {
    console.error('One or more lead delivery updates could not be completed.', {
      leadId: saved.lead.id,
      count: failedDeliveryUpdates,
    });
  }

  let deliveryStatus = null;
  try {
    deliveryStatus = await getDeliveryStates(sql, saved.lead.id);
  } catch (error) {
    console.error('Lead delivery status could not be read.', {
      leadId: saved.lead.id,
      code: error.code || 'DATABASE_ERROR',
    });
  }

  return sendJson(response, saved.isNew ? 201 : 200, {
    saved: true,
    duplicate: !saved.isNew,
    deliveryStatus,
    message: deliveryStatus
      ? 'Your request has been saved.'
      : 'Your request has been saved, but notification status is temporarily unavailable.',
  });
};

module.exports.config = {
  api: {
    bodyParser: { sizeLimit: '8kb' },
  },
};
