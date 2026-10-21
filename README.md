# Workshop Hub

A Next.js workshop platform with public workshop pages, member accounts, paid enrollment, notifications, and an admin panel.

## Local development

Requirements:

- Node.js 20.9 or newer
- Docker Desktop (for the local Postgres database)

```bash
copy .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Fill in `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before running `npm run db:seed`.

Open [http://localhost:3000](http://localhost:3000).

The app uses PostgreSQL in every environment. The old SQLite `prisma/dev.db` is no longer used.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SITE_URL` | Yes | Public app URL used by checkout redirects |
| `SEED_ADMIN_EMAIL` | Seed only | Initial administrator email |
| `SEED_ADMIN_PASSWORD` | Seed only | Initial administrator password |
| `SEED_MEMBER_EMAIL` | No | Optional sample member email |
| `SEED_MEMBER_PASSWORD` | No | Optional sample member password |
| `STRIPE_SECRET_KEY` | No | Enables real Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | No | Verifies Stripe webhook requests |

## Deploying to Vercel

1. Create a PostgreSQL database with Neon, Supabase, or the Vercel Marketplace.
2. In Vercel, open **Project Settings → Environment Variables** and add:
   - `DATABASE_URL`: the direct (non-pooled) PostgreSQL connection string.
   - `SITE_URL`: your production URL, for example `https://your-project.vercel.app`.
   - `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`: the first admin account.
   - Optional: `SEED_MEMBER_EMAIL`, `SEED_MEMBER_PASSWORD`, and Stripe variables.
3. Redeploy the project.

Vercel uses the `vercel-build` script, which applies Prisma migrations, seeds any missing baseline data, and builds the app. Existing users and workshops are not overwritten by later deploys.

For Stripe, set the webhook endpoint to `https://your-domain/api/stripe/webhook` and add the signing secret as `STRIPE_WEBHOOK_SECRET`.

## Scripts

```bash
npm run dev          # Start the development server
npm run build        # Production build
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm test             # Run unit tests
npm run db:migrate   # Create and apply a development migration
npm run db:deploy    # Apply committed migrations
npm run db:seed      # Seed missing baseline users and workshops
npm run db:studio    # Open Prisma Studio
```
