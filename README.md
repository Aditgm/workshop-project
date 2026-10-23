# Hunt n Farm

Phase 1 website for Hunt n Farm: commercial education, company advisory, and community.

The public site covers First Quota, Placement, For Companies, Resources, Revenue Lab, Rinassa AI, About, Contact, Apply, and the legal pages. Applications, contact enquiries, and Revenue Lab registrations are stored in PostgreSQL and managed from the admin area.

## Local development

Requirements:

- Node.js 20.9 or newer
- Docker Desktop for the local PostgreSQL database

```bash
copy .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Fill in `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before running `npm run db:seed`.

Open [http://localhost:3000](http://localhost:3000). Admin sign-in is at `/login` and opens `/admin`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SITE_URL` | Yes in production | Canonical public URL used by metadata, sitemap, and redirects |
| `SEED_ADMIN_EMAIL` | Seed only | Initial administrator email |
| `SEED_ADMIN_PASSWORD` | Seed only | Initial administrator password |

The seed is idempotent. It creates the administrator if missing and promotes that user to `ADMIN` if needed, but it does not overwrite an existing password. Change a production password through a controlled database/admin process, not by editing the seed.

There is no Stripe, payment, email, CRM, analytics, or LMS integration in Phase 1. Do not add integration credentials until those scopes are agreed.

## The public site

Primary navigation: **Programs | For Companies | Resources | Apply Now**

Utility navigation: **Rinassa AI | About Us | Contact Us | Login**

Pages:

- `/` — homepage and brand ecosystem
- `/programs` — First Quota programme and curriculum
- `/placement` — placement support and its boundaries
- `/for-companies` — company advisory
- `/resources` — starting points and links
- `/revenue-lab` — free weekly community and registration
- `/rinassa-ai` — Phase 1 product presence
- `/about`
- `/contact`
- `/apply`
- `/legal/*` — privacy, terms, refund, placement terms

### Form destinations

- Applications → `Application`
- Contact enquiries → `ContactEnquiry`
- Revenue Lab → `RevenueLabRegistration`

Each submission is visible in the admin area. Follow-up is manual; no automatic confirmation or notification email is sent. The forms use server-side validation, database-backed rate limiting, and a honeypot field. Revenue Lab registration is upserted by email so a returning registrant updates the existing record.

### Editable content

`/admin/content` edits the homepage introduction, First Quota details and curriculum, Revenue Lab summary, contact details, and About introduction. Content is stored in `SiteSetting` under `marketing-content`, with code defaults in `src/lib/site-content.ts`.

The remaining page copy and legal pages are static. Review them before launch. The legal pages are conservative Phase 1 drafts and should be checked by the site owner or a qualified adviser. Contact details are intentionally blank until supplied.

### Admin

`/admin` shows an overview of applications, enquiries, and Revenue Lab registrations. Administrators can filter and update submission statuses. Access is restricted to `ADMIN` users. There is no student or member portal in Phase 1.

## Deployment to Vercel

1. Create a PostgreSQL database with Neon, Supabase, or the Vercel Marketplace.
2. In **Project Settings → Environment Variables**, add:
   - `DATABASE_URL`: the direct/non-pooled PostgreSQL URL, so Prisma migrations can run during the build.
   - `SITE_URL`: the production URL.
   - `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`: the first admin account.
3. Redeploy the latest commit.

Vercel runs `vercel-build`, which applies committed Prisma migrations, runs the idempotent seed, and builds the app. Do not use the SQLite URL or a local database URL in Vercel.

The current project site is `https://workshop-project-inky.vercel.app`; update `SITE_URL`, the GitHub repository homepage, and the Vercel domain when a permanent Hunt n Farm domain is connected.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # Unit tests
npm run db:migrate   # Create and apply a development migration
npm run db:deploy    # Apply committed migrations
npm run db:seed      # Create the administrator if missing
npm run db:studio    # Prisma Studio
```

## Phase 1 boundaries

- No employment, interview, placement, or offer guarantees. Placement support is bounded and reviewed with the application.
- No student LMS, member registration, dashboard, or course delivery platform.
- No payments or checkout.
- No automatic email, CRM, booking, or analytics integration.
- Rinassa AI is a simple Phase 1 presence; the full product experience is future scope.
- Final First Quota pricing, cohort dates, contact details, imagery, and legal copy still require owner approval.

Legacy Workshop Hub workshop, member, payment, and notification models and routes have been removed. Unit tests cover the public form schemas, content fallback behaviour, submission status guards, and database-backed rate limiting.
