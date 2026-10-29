const test = require('node:test');
const assert = require('node:assert/strict');
const leadHandler = require('../api/leads.js');

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

function validRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': '2a02b651-b018-4a84-8a59-606f80956e5a',
      host: 'scanzaa.test',
      origin: 'https://scanzaa.test',
    },
    body: {
      ownerName: 'Asha Patel',
      restaurantName: 'Corner Table',
      email: 'owner@example.com',
      phone: '+91 98765 43210',
      consent: true,
    },
    ...overrides,
  };
}

test('rejects invalid lead data before accessing the database', async () => {
  const request = validRequest({ body: { ownerName: 'A', consent: false } });
  const response = responseRecorder();

  await leadHandler(request, response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.fields.ownerName, 'Enter your full name.');
  assert.equal(response.body.fields.consent, 'Consent is required to contact you about this request.');
});

test('rejects cross-origin form requests', async () => {
  const request = validRequest();
  request.headers.origin = 'https://attacker.example';
  const response = responseRecorder();

  await leadHandler(request, response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.saved, undefined);
});

test('rejects oversized submissions and missing idempotency keys', async () => {
  const oversized = validRequest();
  oversized.headers['content-length'] = '9000';
  const oversizedResponse = responseRecorder();
  await leadHandler(oversized, oversizedResponse);
  assert.equal(oversizedResponse.statusCode, 413);

  const withoutKey = validRequest();
  delete withoutKey.headers['idempotency-key'];
  const keyResponse = responseRecorder();
  await leadHandler(withoutKey, keyResponse);
  assert.equal(keyResponse.statusCode, 400);
  assert.match(keyResponse.body.error, /request key/i);
});

test('never reports a saved lead when the database is not configured', async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const response = responseRecorder();
  try {
    await leadHandler(validRequest(), response);
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }

  assert.equal(response.statusCode, 503);
  assert.equal(response.body.saved, undefined);
});
