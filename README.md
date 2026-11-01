# Cake Shop — Crumble & Co.

A full-stack bakery storefront: cakes, pastries, breads and custom celebration cakes,
ordered online and paid **cash or UPI on delivery**. No payment gateway, no advance.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4 and zustand,
backed by **PGlite** — a real Postgres compiled to WASM that runs embedded in the app,
so there is no Docker, no database server and no API keys to configure.

## Features

**Storefront**
- Home, shop with category filters, product detail with variants (500 g / 1 kg), cart.
- About, contact, FAQ, privacy, terms, custom-cake brief form.
- Material Symbols icons, editorial design tokens, responsive down to mobile.

**Ordering**
- Guest or signed-in checkout — delivery or pickup, date and slot selection.
- Server recomputes every price, stock check and total; the client never decides money.
- Order confirmation and public tracking by order number + phone.
- Guests get the freshly placed order from `sessionStorage`, so tracking works instantly.

**Accounts**
- Register, sign in, password reset (single-use token, printed to the server console).
- Profile summary, order history with status badges, reorder-friendly links.

**Admin console (`/admin`)**
- Overview: revenue booked, orders awaiting confirmation, today's dispatches.
- Orders: filter, search, change status with a note, full status history.
- Cake requests: review briefs and move them through new → reviewing → quoted → accepted.
- Messages: contact-form inbox with reply links.
- Settings: delivery fee, free-delivery threshold, phone, email, address, hours.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

The database is created and seeded automatically on the first request into `.data/pg`
(gitignored).

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build (stop `next dev` first — PGlite locks .data)
npm run typecheck    # tsc --noEmit
npm run test:flow    # end-to-end API flow, needs the dev server running
npm run db:smoke     # migration + create_order on a throwaway in-memory database
npm run db:reset     # delete .data, reseeded on the next request
npm run db:admin -- you@example.com   # promote an account (dev server stopped)
```

## First administrator

Sign up through the site, stop the dev server, then:

```bash
npm run db:admin -- you@example.com
```

The role lives in `public.profiles`; the signup trigger always creates customers.
Run it without an email to list every account and its role.

## Notes

- **Payments:** cash on delivery or UPI on handover only. Nothing is charged online.
- **Database:** `supabase/migrations/` holds the real Postgres schema, so the project can be
  pointed at hosted Supabase later without a rewrite; `supabase/local/00-shims.sql` provides
  the `auth`/`storage` pieces PGlite lacks.
- **Design reference:** the original Stitch export (HTML + screenshots) lives in
  `design/stitch/`; the app itself is rebuilt on its own design tokens, not the export markup.
- **Builds:** never run `npm run build` while `next dev` is running — both open `.data/pg`.
