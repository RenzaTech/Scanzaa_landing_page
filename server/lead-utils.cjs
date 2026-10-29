const crypto = require('node:crypto');

const MAX_BODY_BYTES = 8 * 1024;
const MAX_DELIVERY_ATTEMPTS = 5;

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  const length = [...normalized].length;
  return length >= 2 && length <= maxLength ? normalized : null;
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}

function normalizePhone(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^(?:\+|00)[\d\s().-]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 8 || digits.length > 15 || digits.startsWith('0')) return null;
  return `+${digits}`;
}

function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, fields: { form: 'Submit valid form details.' } };
  }

  const ownerName = normalizeText(input.ownerName, 120);
  const restaurantName = normalizeText(input.restaurantName, 160);
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const fields = {};

  if (!ownerName) fields.ownerName = 'Enter your full name.';
  if (!restaurantName) fields.restaurantName = 'Enter your restaurant name.';
  if (!email) fields.email = 'Enter a valid email address.';
  if (!phone) fields.phone = 'Enter a valid international phone number.';
  if (input.consent !== true) fields.consent = 'Consent is required to contact you about this request.';

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: { ownerName, restaurantName, email, phone } };
}

function isValidIdempotencyKey(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function retryDelaySeconds(attempt) {
  return Math.min(3600, 60 * (2 ** Math.max(0, attempt - 1)));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

module.exports = {
  MAX_BODY_BYTES,
  MAX_DELIVERY_ATTEMPTS,
  escapeHtml,
  hashValue,
  isValidIdempotencyKey,
  normalizeEmail,
  normalizePhone,
  normalizeText,
  retryDelaySeconds,
  validateLead,
};
