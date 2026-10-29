const { ensureSchema, getSql } = require('../server/lead-database.cjs');
const { claimDueJobs, completeClaimedJob } = require('../server/lead-delivery.cjs');
const crypto = require('node:crypto');

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(body);
}

function matchesSecret(header, secret) {
  if (typeof header !== 'string' || !secret) return false;
  const expected = `Bearer ${secret}`;
  const left = Buffer.from(header);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = async function leadRetriesHandler(request, response) {
  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }
  if (!matchesSecret(request.headers.authorization, process.env.CRON_SECRET)) {
    return sendJson(response, 401, { error: 'Unauthorized.' });
  }

  try {
    const sql = getSql();
    await ensureSchema(sql);
    await sql`
      DELETE FROM scanzaa_lead_rate_limits
      WHERE window_started_at < NOW() - INTERVAL '1 day'
    `;
    await sql`
      DELETE FROM scanzaa_webhook_events
      WHERE received_at < NOW() - INTERVAL '90 days'
    `;

    const jobs = await claimDueJobs(sql, 10);
    const outcomes = await Promise.allSettled(
      jobs.map((job) => completeClaimedJob(sql, job, {
        owner_name: job.owner_name,
        restaurant_name: job.restaurant_name,
        email: job.email,
        phone: job.phone,
      }))
    );
    const failed = outcomes.filter((result) => result.status === 'rejected').length;
    if (failed > 0) {
      console.error('Some lead retry jobs could not be updated.', { count: failed });
    }
    return sendJson(response, 200, {
      claimed: jobs.length,
      completed: outcomes.length - failed,
      failed,
    });
  } catch (error) {
    console.error('Lead retry job could not be completed.', {
      code: error.code || 'RETRY_PROCESSING_ERROR',
    });
    return sendJson(response, 503, { error: 'Lead retries are temporarily unavailable.' });
  }
};
