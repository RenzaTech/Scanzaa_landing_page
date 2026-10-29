const path = require('node:path');
const express = require('express');
const createLeadHandler = require('../api/leads.js');
const leadWebhooksHandler = require('../api/lead-webhooks.js');
const leadRetriesHandler = require('../api/lead-retries.js');
const { ensureSchema, getSql } = require('./lead-database.cjs');
const { claimDueJobs, completeClaimedJob } = require('./lead-delivery.cjs');

const frontendDirectory = path.join(__dirname, '..', 'Frontend', 'dist');
const retryIntervalMs = 60_000;
let retryTimer;
let retryCycleRunning = false;
let lastCleanupAt = 0;

function runHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response)).catch(next);
  };
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.post(
    '/api/leads',
    express.json({ limit: '8kb', type: 'application/json' }),
    runHandler(createLeadHandler)
  );
  app.all('/api/lead-webhooks', runHandler(leadWebhooksHandler));
  app.all('/api/lead-retries', runHandler(leadRetriesHandler));
  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found.' });
  });

  app.use(express.static(frontendDirectory));
  app.get(/.*/, (request, response, next) => {
    if (!request.accepts('html')) return next();
    return response.sendFile(path.join(frontendDirectory, 'index.html'), (error) => {
      if (error) next(error);
    });
  });

  app.use((error, _request, response, _next) => {
    if (response.headersSent) return;
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status >= 500) {
      console.error('HTTP request could not be completed.', {
        code: error.code || 'HTTP_REQUEST_ERROR',
      });
    }
    response.status(status).json({
      error: status === 413
        ? 'Form submission is too large.'
        : status === 400
          ? 'Form submission is not valid JSON.'
          : 'Request could not be completed.',
    });
  });

  return app;
}

async function runRetryCycle() {
  if (retryCycleRunning) return;
  retryCycleRunning = true;
  try {
    const sql = getSql();
    await ensureSchema(sql);

    if (Date.now() - lastCleanupAt >= 60 * 60 * 1000) {
      await sql`
        DELETE FROM scanzaa_lead_rate_limits
        WHERE window_started_at < NOW() - INTERVAL '1 day'
      `;
      await sql`
        DELETE FROM scanzaa_webhook_events
        WHERE received_at < NOW() - INTERVAL '90 days'
      `;
      lastCleanupAt = Date.now();
    }

    const jobs = await claimDueJobs(sql, 10);
    const outcomes = await Promise.allSettled(
      jobs.map((job) => completeClaimedJob(sql, job, {
        owner_name: job.owner_name,
        restaurant_name: job.restaurant_name,
        email: job.email,
        phone: job.phone,
      }))
    );
    const failures = outcomes.filter((outcome) => outcome.status === 'rejected').length;
    if (failures > 0) {
      console.error('Some lead retry jobs could not be updated.', { count: failures });
    }
  } catch (error) {
    console.error('Lead retry cycle could not be completed.', {
      code: error.code || 'RETRY_PROCESSING_ERROR',
    });
  } finally {
    retryCycleRunning = false;
  }
}

function startRetryWorker() {
  if (retryTimer) return;
  void runRetryCycle();
  retryTimer = setInterval(() => void runRetryCycle(), retryIntervalMs);
  retryTimer.unref();
}

async function startServer() {
  if (!process.env.DATABASE_URL || !process.env.RATE_LIMIT_SECRET) {
    throw new Error('Required database or rate-limit configuration is missing.');
  }

  await ensureSchema(getSql());
  const app = createApp();
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.info(`Scanzaa web service is listening on port ${port}.`);
  });
  startRetryWorker();

  const shutdown = () => {
    if (retryTimer) clearInterval(retryTimer);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Scanzaa web service could not start.', {
      code: error.code || 'STARTUP_CONFIGURATION_ERROR',
    });
    process.exitCode = 1;
  });
}

module.exports = { createApp, runRetryCycle, startRetryWorker, startServer };
