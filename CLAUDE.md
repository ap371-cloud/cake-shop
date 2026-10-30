# Crumble & Co. — working agreement

## Language
Always answer in English, even when the user writes in another language. Never reply in Chinese.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · Supabase (Postgres + Auth + Storage).

Commands: `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run seed`.

## Architecture rules — do not break these
- **Supabase is the only persistence layer.** Never store passwords, orders, or customer data in `localStorage`. The browser may cache the cart only.
- **Orders are created through the `create_order(items jsonb, customer jsonb)` Postgres function.** Prices, delivery fee and totals are computed inside the database; the client sends `product_id` / `variant_id` / `quantity` only. Never insert into `orders` directly.
- **Every mutation runs on the server**: server actions or route handlers, validated with `zod` before touching the database.
- **Row Level Security is on for every table.** Do not disable a policy to make a feature work — fix the policy or use a server-only client (`src/lib/supabase/admin.ts`).
- **Service-role key stays server-side.** Never import `admin.ts` into a client component.
- Admin checks use `public.is_admin()` / `requireAdmin()`; never trust a role sent from the browser.

## Design system
Tokens live in `src/app/globals.css` under `@theme` (Tailwind 4 — there is no `tailwind.config.ts`).
Palette: `background #FFF9F1`, `primary-container #6F3827`, `secondary-container #FED399`, `gold #C6A06A`, `sage #3D7954`.
Fonts: `font-display` (Playfair Display) for headings, `font-body` (Inter) for text.
Shared primitives are in `src/components/ui/*` — reuse them instead of new one-off components.

## Conventions
- Comments explain *why*, not what. No section-banner comments.
- No fake data in API responses and no decorative buttons that do nothing.
- Respect `prefers-reduced-motion`; keep animations CSS-based unless there is a clear reason.
- Business details (phone, address, hours) are placeholders — keep them clearly marked, do not invent them.

## Files owned by the foundation
`supabase/migrations/*`, `src/app/globals.css`, `src/lib/supabase/*`, `src/lib/auth.ts`, `src/store/cart.ts`, `src/components/ui/*`.
Read them before changing; do not rewrite them wholesale.
