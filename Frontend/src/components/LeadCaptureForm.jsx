import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const inputClassName =
  'mt-2 w-full rounded-xl border border-[#183b34]/15 bg-[#fbfaf7] px-4 py-3 text-sm text-[#183b34] outline-none transition placeholder:text-[#9ba39b] focus:border-[#d59a0b] focus:ring-2 focus:ring-[#FCC133]/30';

export default function LeadCaptureForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const idempotencyKey = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting || saved) return;

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.get('consent') === 'on';
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    setIsSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          idempotencyKey.current = null;
        }
        setFieldErrors(result?.fields || {});
        throw new Error(result?.error || 'Your request could not be saved. Please try again.');
      }
      if (result?.saved !== true) throw new Error('We could not confirm that your request was saved. Please try again.');
      setSaved(result);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your request could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const channelLabels = {
    customer_email: 'Your email confirmation',
    customer_whatsapp: 'Your WhatsApp confirmation',
    team_email: 'Scanzaa team notification',
  };
  const channelStatus = {
    accepted: 'Accepted by the provider; delivery is being confirmed.',
    delivered: 'Delivered.',
    pending: 'Queued for delivery.',
    retrying: 'A delivery retry is scheduled.',
    sending: 'Sending.',
    blocked: 'Saved; delivery is waiting for provider configuration.',
    failed: 'Could not be delivered. Your request is still saved.',
    unknown: 'Delivery could not be confirmed. Your request is still saved.',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#354d42]">
          Your full name
          <input
            className={inputClassName}
            name="ownerName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            placeholder="e.g. Asha Patel"
            aria-invalid={Boolean(fieldErrors.ownerName)}
            aria-describedby={fieldErrors.ownerName ? 'owner-name-error' : undefined}
            disabled={Boolean(saved)}
            required
          />
          {fieldErrors.ownerName && <span id="owner-name-error" className="mt-1 block text-xs font-normal text-red-700">{fieldErrors.ownerName}</span>}
        </label>
        <label className="block text-sm font-semibold text-[#354d42]">
          Restaurant name
          <input
            className={inputClassName}
            name="restaurantName"
            type="text"
            autoComplete="organization"
            minLength={2}
            maxLength={160}
            placeholder="e.g. The Corner Table"
            aria-invalid={Boolean(fieldErrors.restaurantName)}
            aria-describedby={fieldErrors.restaurantName ? 'restaurant-name-error' : undefined}
            disabled={Boolean(saved)}
            required
          />
          {fieldErrors.restaurantName && <span id="restaurant-name-error" className="mt-1 block text-xs font-normal text-red-700">{fieldErrors.restaurantName}</span>}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#354d42]">
          Email address
          <input
            className={inputClassName}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@restaurant.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            disabled={Boolean(saved)}
            required
          />
          {fieldErrors.email && <span id="email-error" className="mt-1 block text-xs font-normal text-red-700">{fieldErrors.email}</span>}
        </label>
        <label className="block text-sm font-semibold text-[#354d42]">
          WhatsApp / contact number
          <input
            className={inputClassName}
            name="phone"
            type="tel"
            autoComplete="tel"
            minLength={8}
            maxLength={24}
            placeholder="+91 98765 43210"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            disabled={Boolean(saved)}
            required
          />
          {fieldErrors.phone && <span id="phone-error" className="mt-1 block text-xs font-normal text-red-700">{fieldErrors.phone}</span>}
        </label>
      </div>
      <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-[#64736a]">
        <input
          className="mt-1 h-4 w-4 shrink-0 accent-[#d59a0b]"
          name="consent"
          type="checkbox"
          disabled={Boolean(saved)}
          aria-invalid={Boolean(fieldErrors.consent)}
          aria-describedby={fieldErrors.consent ? 'consent-error' : undefined}
          required
        />
        <span>
          I agree that Scanzaa may contact me about my inquiry using the details above.
          {import.meta.env.VITE_PRIVACY_POLICY_URL && (
            <>
              {' '}Read our{' '}
              <a
                className="font-semibold text-[#76550d] underline underline-offset-2"
                href={import.meta.env.VITE_PRIVACY_POLICY_URL}
                target="_blank"
                rel="noreferrer"
              >
                privacy policy
              </a>
              .
            </>
          )}
        </span>
      </label>
      {fieldErrors.consent && <p id="consent-error" className="text-xs text-red-700">{fieldErrors.consent}</p>}
      {error && (
        <p className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm leading-6 text-[#8b342a]" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <div className="space-y-2 rounded-xl bg-[#eaf5ef] px-4 py-3 text-sm leading-6 text-[#183b34]" role="status" aria-live="polite">
          <p className="font-semibold">{saved.message}</p>
          {saved.deliveryStatus
            ? Object.entries(channelLabels).map(([channel, label]) => (
              <p key={channel}>
                <span className="font-semibold">{label}:</span>{' '}
                {channelStatus[saved.deliveryStatus[channel]] || 'Status unavailable.'}
              </p>
            ))
            : <p>Notification status is temporarily unavailable. We will process delivery separately.</p>}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || Boolean(saved)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FCC133] px-6 text-sm font-bold text-[#183b34] transition hover:bg-[#ffd45e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving your request…' : saved ? 'Request saved' : 'Request a conversation'}
        {!isSubmitting && !saved && <ArrowRight size={16} />}
      </button>
      <p className="text-center text-xs text-[#7a847b]">
        We’ll use your details to respond to this inquiry.
      </p>
    </form>
  );
}
