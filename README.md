# Rento

Norwegian car rental platform (rentobil.no). Built as an MVP; architected to grow into a peer-to-peer rental marketplace.

## Stack

- Next.js 16 (App Router) + React 19.2
- TypeScript
- Tailwind CSS 4

## Scripts

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build
pnpm start
```

## Language

All UI text is in Norwegian (bokmål). Code, routes, and identifiers are in English.

## Project structure

```
src/
  app/                 # App Router pages
    layout.tsx
    page.tsx           # /
    cars/              # /cars, /cars/[slug]
    booking/           # /booking, /booking/confirmation
    pricing/           # /pricing
    how-it-works/      # /how-it-works
    about/             # /about
    contact/           # /contact
    account/           # /account
  components/          # Header, Footer, CarCard, Button, SearchBar, ...
  data/                # Static seed data (cars, locations)
  lib/                 # Formatting, shared helpers
```

## Roadmap

- Phase 1 (MVP, owned fleet) — current
- Phase 2: user-listed cars (marketplace)
- Phase 3: other asset categories (tools, equipment)
