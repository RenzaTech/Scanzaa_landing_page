# Restaurant lead capture and Docker deployment

The landing-page form posts to `/api/leads`. The Docker runtime in `server/app.cjs` serves the built frontend and mounts the existing API handlers in `api/`. Postgres stores the lead and independent delivery records for the owner email, owner WhatsApp, and team email. The API confirms success only after it reads the saved lead and delivery records back from Postgres.

For a live site that remains available when your computer and local Docker are off, deploy the Docker image to an always-on cloud container service. `render.yaml` configures a Render Docker web service on its paid Starter plan; the service uses Neon as its external persistent database. Local Docker is only for local development and stops serving traffic when Docker stops. The Render service is independent of your local computer.

The retry worker runs inside the hosted web service every minute. Delivery jobs and lead data remain in Neon, so a service restart does not erase pending work. Provider webhooks continue to update delivery states independently.

The Vercel configuration also supports deploying the frontend and API functions. Its retry cron runs daily so the schedule is valid on Vercel Hobby as well as paid plans; queued delivery retries can therefore take up to a day to run. Use the Render worker when minute-level retry processing is required.

## Deploy to Render

1. Push this repository to GitHub and create a Render Blueprint from that repository. Render reads `render.yaml` and builds the Docker image.
2. Create a Neon Postgres database and provide its pooled connection string as `DATABASE_URL`. The database role must be allowed to create the `scanzaa_*` tables on first startup.
3. Enter the required database values requested by the Blueprint. The service will not start without `DATABASE_URL` and `RATE_LIMIT_SECRET`.
4. Configure and verify the WhatsApp sender first using the steps below. Then configure Resend and the Scanzaa team email destination.
5. Wait for Render's `/health` check to pass, then use the Render `onrender.com` URL or connect Scanzaa's domain. Set provider webhook callbacks to that public domain.
6. Configure a verified production privacy-policy URL in the frontend deployment if Scanzaa publishes one; never put server secrets in `VITE_*` variables.

The Render Starter plan is a paid, always-on hosted service. No cloud service can be provisioned from this repository alone; an authorized Render account, repository access, production environment values, and any billing approval are required. Do not deploy the Blueprint with blank provider or database credentials.

## Run with Docker locally

1. Optionally copy `.env.example` to `.env` and add Meta's WhatsApp settings locally. Do not commit `.env` or share its secrets. Compose uses its local database and development-only rate-limit secret by default.
2. Start the app and its isolated Postgres database with `docker compose up --build -d`.
3. Open `http://localhost:3001`. The container serves both the frontend and API from the same origin.
4. Check status and logs with `docker compose ps` and `docker compose logs -f scanzaa`.
5. Stop the local services with `docker compose down`. The named `scanzaa-db-data` volume keeps local leads when the containers stop; do not remove that volume if you need the local data.

The local database and application run only while Docker is running. WhatsApp messages are sent for real only after valid Meta credentials and an approved template are configured in `.env`; without them, the lead is still saved locally and its WhatsApp delivery status remains blocked. Render and Neon are a separate hosted setup for later.

## Required production configuration

Set these values as server-side environment variables in the hosted container service:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. |
| `RATE_LIMIT_SECRET` | Random secret used when hashing request IPs for the database-backed rate limit. |
| `WHATSAPP_ACCESS_TOKEN` | Meta WhatsApp Cloud API access token. |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta's phone-number ID for Scanzaa's owned WhatsApp sender `+91 8925789321`. This is an ID from Meta, not the phone number. |
| `WHATSAPP_CLOUD_API_VERSION` | Supported Graph API version, in `vNN.N` format. |
| `WHATSAPP_TEMPLATE_NAME` | Approved WhatsApp template name. Its body must accept owner name as `{{1}}` and restaurant name as `{{2}}`. |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Approved template language code (for example, `en`). |
| `WHATSAPP_APP_SECRET` | Meta app secret used to verify webhook signatures. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Secret string configured when registering the WhatsApp webhook. |
| `CRON_SECRET` | Random secret used to authorize the scheduled retry endpoint. |
| `PRIVACY_POLICY_VERSION` | Version recorded with the visitor's consent; defaults to `v1`. |

`VITE_PRIVACY_POLICY_URL` is optional and public. Set it only to Scanzaa's published privacy policy; no policy page was present in this repository when the form was implemented. Do not put any provider or database secret in a `VITE_*` variable.

The Render Blueprint intentionally configures the WhatsApp channel first. Email environment variables are listed in `.env.example` for the later Resend setup and should be added to Render only after WhatsApp is verified.

Use `.env.example` as a variable-name checklist, not as a place to store live credentials. Create strong random values for `RATE_LIMIT_SECRET`, `CRON_SECRET`, and the WhatsApp webhook verify token. Do not commit `.env` files.

## Provider setup

### WhatsApp setup — do this first

Scanzaa's business sender number is **+91 8925789321**. The restaurant owner's submitted number is the recipient; this Scanzaa number is the sender. The current API already sends the owner's confirmation to the submitted phone using Meta's WhatsApp Cloud API.

1. In the [Meta for Developers app dashboard](https://developers.facebook.com/apps/), create or open a business app with the WhatsApp use case and connect Scanzaa's WhatsApp Business Account.
2. In WhatsApp Manager, add **+91 8925789321** as the business phone number and complete Meta's ownership verification. Register it for Cloud API following Meta's [business phone number registration](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/registration) instructions. Do not share verification codes or two-step PINs in chat.
3. In the app's WhatsApp API Setup, get the **Phone Number ID** associated with **+91 8925789321** and a production access token with the required WhatsApp messaging permissions. A temporary quick-start token is not suitable for a production service.
4. Create and submit a WhatsApp message template for approval. Its body must have exactly two text variables in this order: `{{1}}` for the owner's name and `{{2}}` for the restaurant name. Set the approved template's exact name and language in `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANGUAGE`.
5. Add `WHATSAPP_ACCESS_TOKEN`, the matching `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_CLOUD_API_VERSION`, `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE` as server-side secrets/settings in Render. Never use `VITE_*` for these values.
6. Once Scanzaa has a public HTTPS deployment URL, set the WhatsApp webhook callback to `https://<production-domain>/api/lead-webhooks`. Set a strong `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in Render and enter the same value in Meta's webhook setup; subscribe the app to WhatsApp message status/message events and set `WHATSAPP_APP_SECRET` to the Meta app secret. Complete Meta's webhook verification.
7. Submit a test lead using a phone number whose owner has consented to be contacted. Confirm WhatsApp provider acceptance and then delivery in the form status and provider webhook updates. Do not claim WhatsApp is live until a real end-to-end test succeeds.

Meta must accept and register the business number, and approve the message template. Supplying the number alone is not enough to send messages: the Meta phone-number ID, production access token, approved template, app secret, and webhook setup are also required. If Meta reports the number is already connected to the WhatsApp consumer/business app, follow Meta's supported migration or coexistence options rather than attempting to bypass them.

### Email setup — after WhatsApp

1. Verify Scanzaa's sender domain in Resend, then set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and the team's `TEAM_NOTIFICATION_EMAIL` in Render.
2. In Resend, register `https://<production-domain>/api/lead-webhooks` for email sent, delivery, delay, bounce, failure, and complaint events. Copy its signing secret into `RESEND_WEBHOOK_SECRET`.

### Shared database setup

1. Create a Neon database and set `DATABASE_URL`. At service startup, the runtime creates the four `scanzaa_*` tables and delivery index using `CREATE TABLE IF NOT EXISTS`; the database role must have permission to create these objects.
2. Set a random `RATE_LIMIT_SECRET` in Render. Set `CRON_SECRET` for the separately callable retry endpoint.

## Delivery and retry behavior

The form reports the lead saved only after Postgres confirms it. Provider acceptance and final delivery are separate states; Resend and WhatsApp callbacks update delivery state independently. Signed webhook events are deduplicated, and stored events are reconciled if a provider callback arrives before its message ID has been saved.

Email sends use a stable Resend idempotency key for each delivery job. Temporary provider failures retry with exponential backoff (up to five attempts); permanent provider failures are marked failed. A WhatsApp timeout or ambiguous server error is marked unknown and is not automatically resent because the Cloud API does not provide an idempotency key for message creation. This avoids sending a duplicate confirmation when the first message may already have been accepted.

Missing provider configuration leaves the lead saved and its notification job blocked, not falsely reported as sent. Once configuration is fixed, the hosted retry worker checks eligible blocked jobs every minute. Webhook event IDs are retained for 90 days, and expired rate-limit records are periodically removed.

## Local development and verification

The regular Vite dev server serves only the frontend; use `docker compose up --build` to run the API and frontend together. Do not submit real customer data during development. Production database writes and provider delivery cannot be verified until Meta approves and registers the sender and template, the required credentials and webhook subscriptions are configured, and the service is deployed.

Provider and deployment references:

- [Resend send email API](https://resend.com/docs/api-reference/emails/send-email) and [webhook signatures](https://resend.com/docs/dashboard/webhooks/introduction)
- [WhatsApp Cloud API messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) and [webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Render Docker deployments](https://render.com/docs/docker)
- [Render Blueprint specification](https://render.com/docs/blueprint-spec)
