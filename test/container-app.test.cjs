const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server/app.cjs');

let server;
let baseUrl;

test.before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

test('container runtime exposes a healthy process endpoint', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('container runtime mounts the lead API and rejects invalid lead data', async () => {
  const response = await fetch(`${baseUrl}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /form fields/i);
});

test('container runtime rejects malformed JSON with a JSON error response', async () => {
  const response = await fetch(`${baseUrl}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid',
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid json/i);
});

test('container runtime routes webhook and retry endpoints to protected handlers', async () => {
  const webhookResponse = await fetch(`${baseUrl}/api/lead-webhooks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const retryResponse = await fetch(`${baseUrl}/api/lead-retries`, { method: 'PATCH' });

  assert.equal(webhookResponse.status, 401);
  assert.equal(retryResponse.status, 405);
});
