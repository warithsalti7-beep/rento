# Rento

Norwegian car rental platform (rentobil.no). Designed to launch as a managed-fleet MVP and evolve into a peer-to-peer rental marketplace.

## Stack

- **Next.js 16** (App Router) + **React 19.2** + **TypeScript**
- **Tailwind CSS 4**
- **Prisma 5** + **Neon Postgres** (serverless)
- **NextAuth v5** (magic-link email + optional Google)
- **Stripe Checkout** (NOK) + webhooks
- **Zod** for input validation

All user-facing text is in Norwegian (bokmål). Code, routes, and identifiers are English.

## Scripts

```bash
pnpm install          # installs deps + generates Prisma client
pnpm dev              # http://localhost:3000
pnpm build            # runs prisma generate + next build
pnpm start            # production server
pnpm lint             # eslint

pnpm db:push          # push schema to DB (no migration file)
pnpm db:migrate       # create & apply migration (dev)
pnpm db:deploy        # apply migrations (production / CI)
pnpm db:seed          # seed cars, locations, pricing, admin user
pnpm db:studio        # Prisma Studio
```

## Project structure

```
prisma/
  schema.prisma       # Car, Location, Booking, User, Review, PricingTier, ContactMessage
  seed.ts             # idempotent seed (runs via `pnpm db:seed`)
src/
  app/
    page.tsx          # Landing
    cars/             # /cars, /cars/[slug]
    booking/          # 6-step flow: Lokasjon → Biler → Velg → Bekreft → Betaling → Bekreftelse
    pricing/          # /pricing
    account/          # /account (auth required)
    auth/             # sign-in, verify-request
    admin/            # cars, bookings, locations, pricing, messages (role: ADMIN)
    api/
      cars, locations, pricing, bookings, contact
      checkout        # Stripe Checkout session
      stripe/webhook  # Payment webhook
      auth/[...nextauth]
    how-it-works, about, contact
  components/         # Header, Footer, CarCard, Button, SearchBar, Logo
  server/             # DB accessors (cars, locations, pricing, bookings)
  lib/                # prisma, auth, stripe, types, format, cn
  middleware.ts       # protects /admin and /account
```

No hardcoded product data. Everything renders from Postgres; admins manage it at `/admin`.

## Local setup

1. **Install deps**

   ```bash
   pnpm install
   ```

2. **Create `.env.local`** from `.env.example`. Minimum for local dev you need `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`.

3. **Create the DB schema**

   ```bash
   pnpm db:push         # or: pnpm db:migrate --name init
   pnpm db:seed
   ```

4. **Run**

   ```bash
   pnpm dev
   ```

5. To use admin at `/admin`, log in with `admin@rentobil.no` (seeded as ADMIN). The magic-link email arrives via your SMTP provider — in local dev without SMTP, `next-auth` logs the URL to the terminal.

## Deployment — Vercel + Neon (isolated from your other project)

These steps assume you already use Neon + Vercel for another project. Rento lives in **its own Neon project** and its own **Vercel project**, so it cannot touch the other one.

### 1. Database — new Neon project

1. Log in to [console.neon.tech](https://console.neon.tech).
2. Click **New project** → name it `rento` (region: `eu-west-1 / Frankfurt` is closest to Norway).
3. Create a database named `rento` inside it.
4. Under **Connection Details**, copy:
   - **Pooled connection** → `DATABASE_URL` (used at runtime). Must include `?sslmode=require&pgbouncer=true&connect_timeout=10`.
   - **Direct connection** → `DIRECT_URL` (used by `prisma migrate`).
5. This project is entirely separate from your other Neon project — different credentials, different roles, different data.

### 2. Repo — push to GitHub

```bash
git add .
git commit -m "feat: rento platform with DB, admin, auth, stripe"
git push -u origin main
```

### 3. Vercel — new project

1. Go to [vercel.com/new](https://vercel.com/new) → import the `rento` repo.
2. **Framework preset**: Next.js (auto-detected).
3. **Build command**: leave default (`next build`; the `prisma generate` runs via `postinstall`).
4. **Environment Variables** — add from `.env.example`:
   - `DATABASE_URL`, `DIRECT_URL` (from Neon above)
   - `AUTH_SECRET` (`openssl rand -base64 32`)
   - `AUTH_TRUST_HOST=true`
   - `NEXT_PUBLIC_APP_URL=https://rentobil.no` (or your Vercel preview URL)
   - `EMAIL_SERVER`, `EMAIL_FROM` (any SMTP — Resend / Postmark)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (optional)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Deploy.

### 4. Run migrations + seed against production

Once the first deploy is done:

```bash
# Locally, pointing at the prod Neon DB:
DATABASE_URL="..." DIRECT_URL="..." pnpm db:deploy
DATABASE_URL="..." DIRECT_URL="..." pnpm db:seed
```

Or add a one-off Vercel build step; the cleanest pattern is to run these manually from your laptop.

### 5. Stripe webhook

1. In the Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://<your-domain>/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Copy the signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.

### 6. Custom domain

Add `rentobil.no` in Vercel → Domains. Update DNS per Vercel's instructions. Set `NEXT_PUBLIC_APP_URL=https://rentobil.no` and redeploy.

## Keeping Rento isolated from your other project

- **Neon**: separate *project*, separate *database*, separate connection strings. Never reuse the other project's `DATABASE_URL`.
- **Vercel**: separate *Vercel project* with its own env vars. Each repo deploys independently.
- **Auth**: separate `AUTH_SECRET`. Do not copy it from the other project.
- **Stripe**: different account or at least different webhook endpoint + Restricted API key scoped to this project.
- **Schema migrations**: only ever run against Rento's `DATABASE_URL` / `DIRECT_URL`. Double-check the URL before any `prisma migrate` command.

## Roadmap

- **Phase 1 — Managed fleet** (current). Rento drifts flåten selv.
- **Phase 2 — Privat utleie.** Enable `CarOwnerType = PRIVATE` on cars; owner onboarding flow, payouts via Stripe Connect.
- **Phase 3 — Flere kategorier.** Generalize `Car` into `Listing` (verktøy, utstyr, båt).

Schema is already future-ready: `User.role`, `Car.ownerType`, `Review`, availability blocks, pricing tiers decoupled from cars.
