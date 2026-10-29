const test = require('node:test');
const assert = require('node:assert/strict');
const {
  escapeHtml,
  isValidIdempotencyKey,
  normalizeEmail,
  normalizePhone,
  normalizeText,
  retryDelaySeconds,
  validateLead,
} = require('../server/lead-utils.cjs');

test('normalizes the lead contact fields without assuming a country code', () => {
  assert.equal(normalizeText('  Asha\n Patel  ', 120), 'Asha Patel');
  assert.equal(normalizeEmail('  OWNER@EXAMPLE.COM '), 'owner@example.com');
  assert.equal(normalizePhone('+91 (98765) 43210'), '+919876543210');
  assert.equal(normalizePhone('98765 43210'), null);
});

test('requires all fields and explicit contact consent', () => {
  const invalid = validateLead({
    ownerName: 'A',
    restaurantName: '',
    email: 'not-an-email',
    phone: '+91 98765 43210',
    consent: false,
  });
  assert.equal(invalid.ok, false);
  assert.deepEqual(Object.keys(invalid.fields).sort(), ['consent', 'email', 'ownerName', 'restaurantName']);

  const valid = validateLead({
    ownerName: 'Asha Patel',
    restaurantName: 'Corner Table',
    email: 'OWNER@EXAMPLE.COM',
    phone: '0091 98765 43210',
    consent: true,
  });
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.value, {
    ownerName: 'Asha Patel',
    restaurantName: 'Corner Table',
    email: 'owner@example.com',
    phone: '+919876543210',
  });
});

test('validates idempotency UUIDs, bounds retry delays, and escapes email content', () => {
  assert.equal(isValidIdempotencyKey('2a02b651-b018-4a84-8a59-606f80956e5a'), true);
  assert.equal(isValidIdempotencyKey('not-a-uuid'), false);
  assert.equal(retryDelaySeconds(1), 60);
  assert.equal(retryDelaySeconds(5), 960);
  assert.equal(retryDelaySeconds(20), 3600);
  assert.equal(escapeHtml(`<script a="b">&'`), '&lt;script a=&quot;b&quot;&gt;&amp;&#39;');
});
