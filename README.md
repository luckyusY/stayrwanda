# StayRwanda

StayRwanda is a Rwanda-first, multi-tenant hospitality marketplace and CRM built with Next.js 16, MongoDB, Clerk, Cloudinary and Resend.

## Platform areas

- Public marketplace: stays, residences, hotels, destinations, offers and guest booking status
- Hotel profiles: curated Classic, Editorial and Modern templates with draft/publish workflow
- Host CRM: onboarding, hotels, inventory, reservations, calendar, guests, offers, team and audit history
- Platform administration: organizations, hotel moderation, reservations, audit explorer and CSV export
- Booking engine: transaction-backed nightly inventory, idempotent requests, hold expiry and exact inventory restoration

## Local setup

Requirements: Node.js 20+, npm and a transaction-capable MongoDB deployment (Atlas or a replica set).

```bash
npm install
copy .env.example .env.local
npm run migrate:dry
npm run migrate
npm run dev
```

Populate `.env.local` with newly issued credentials. Never reuse credentials that have appeared in chat, source control or logs. Configure the Clerk webhook endpoint as `/api/webhooks/clerk` and the scheduled hold-expiry endpoint as `/api/cron/booking-holds` using `CRON_SECRET`.

The migration is idempotent and creates the required indexes, default organization, seven imported residence profiles, unit types and legacy redirect records. Always run the dry-run command and back up affected collections before production migration.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

`npm run verify` runs lint, TypeScript, unit tests and the production build. GitHub Actions also runs dependency audit and Playwright. Public catalogue routes use ISR; authenticated host, admin and live booking routes remain dynamic.

## Authorization model

Clerk supplies identity. MongoDB remains authoritative for organization membership and application roles: `platform_admin`, `organization_owner`, `organization_manager`, `reservations_agent` and `content_editor`. Tenant APIs derive organization access from verified memberships; client-provided organization IDs are never sufficient authorization.

Set `PLATFORM_ADMIN_EMAILS` to a comma-separated allowlist during initial provisioning. Remove obsolete shared-password variables and sessions from any deployment configuration.

## Deployment notes

- Rotate MongoDB, Cloudinary, Clerk, Resend, Mapbox and cron credentials before deployment.
- Run the migration only after a backup and successful dry run.
- Configure Clerk production keys and signed webhook delivery.
- Configure a scheduler to call the booking-hold cron endpoint.
- Treat missing MongoDB or authentication configuration as a deployment failure; seed catalogue fallback is for local presentation only.
- Smoke-test organization isolation, upload authorization, hotel publication, booking conflicts, cancellation restoration and cache refresh after deployment.

Marriott and Booking.com inform the product's editorial and marketplace interaction quality. Their assets, copy and brand presentation are not copied; StayRwanda's own identity remains the source of truth.
