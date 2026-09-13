# Smoke Wholesale — client demo (production-stack build)

A polished, motion-rich single-page storefront demo built on a real
production frontend stack, meant to be shown live to the client as a
"this is what we'd build" pitch — not a throwaway mockup.

This lives alongside `../index.html` (the earlier static HTML/CSS/JS
concept) as the more ambitious, framework-based version.

## Stack

| Layer      | Choice                                   | Why |
|------------|-------------------------------------------|-----|
| Build tool | Vite 8                                    | Instant HMR for live client walkthroughs, fast production builds |
| Framework  | React 19 + TypeScript                     | Component architecture that a real build will extend directly — nothing here gets thrown away |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`)      | Design tokens live as real CSS custom properties, so light/dark theming is free and consistent |
| Motion     | Framer Motion                             | Scroll reveals, hover micro-interactions, mouse-reactive hero parallax, animated accordion/toast |
| Icons      | lucide-react                              | MIT-licensed, tree-shakeable, no icon-font weight |

No scraped or stock product photography is used anywhere. Every category
and product "image" is `GlassSwatch` — an original, parametric dichroic-glass
composition (CSS gradients + an SVG grain filter) generated per item from a
`hue` value. It's a deliberate art-direction choice that fits the
"Borosilicate" palette identity and ships with zero licensing risk; real
product photography can replace it slot-for-slot once you have rights to it.

## Architecture

```
web/
├─ index.html                 Vite entry HTML (fonts, meta, title)
├─ src/
│  ├─ main.tsx                App bootstrap — wraps App in Theme/Toast providers
│  ├─ App.tsx                 Section composition root
│  ├─ index.css               Design tokens (@theme) + component-layer classes
│  ├─ lib/
│  │  ├─ data.ts               Content: categories, products, steps, FAQ (typed)
│  │  ├─ theme.tsx             Light/dark theme context, persisted + OS-aware
│  │  └─ toast.tsx             Cart-toast notification context
│  ├─ components/
│  │  ├─ GlassSwatch.tsx        Generative product/category art
│  │  ├─ Badge.tsx              AgeBadge, Tag
│  │  ├─ Accordion.tsx          Animated FAQ accordion
│  │  ├─ ThemeToggle.tsx        Animated light/dark switch
│  │  └─ CartToast.tsx          Animated toast (AnimatePresence)
│  └─ sections/
│     ├─ Header.tsx             Sticky nav, scroll-aware blur, mobile menu
│     ├─ Hero.tsx               Orchestrated intro + mouse-parallax quick-order panel
│     ├─ TrustStrip.tsx
│     ├─ Categories.tsx         12-category grid, stagger reveal
│     ├─ ProductGrid.tsx        "Hot this week", live prices, add-to-cart
│     ├─ HowItWorks.tsx
│     ├─ GetStarted.tsx         Two forms: free account + wholesale registration
│     ├─ FAQ.tsx
│     └─ Footer.tsx
└─ public/favicon.svg          Original geometric mark (not the Vite default)
```

Content (copy, prices, category counts) lives entirely in `src/lib/data.ts`,
typed and separated from presentation — swapping in a real product feed or
CMS later is a data-layer change, not a rewrite of the UI.

## Backend: Supabase

Accounts, wholesale-registration applications, resale-certificate uploads,
and newsletter signups are wired to a real Supabase project (Postgres +
Auth + Storage), not mocked.

**This is its own dedicated Supabase project** (`smokesales`, project ref
`jtktjxmntfwbmonvzsle`, org "alitheone007's Org-Bilion") — not shared with
any other app, so its `auth.users` table and usage quota belong to this
project alone. This was a deliberate correction after an earlier version of
this setup pointed at the Supabase project behind a different, unrelated
app; don't repeat that — if this project is ever consolidated elsewhere,
give it its own dedicated project again, not a shared one.

- Every table lives in `public`, prefixed `smoke_wholesale_` (harmless here
  since nothing else uses this project, but kept for consistency).
- Every table has Row Level Security on — see `supabase/migration.sql`.
- The service-role key is never used here. Only the anon/publishable key
  ships to the browser, and everything it can do is scoped by RLS.

**One-time setup:**
1. In the Supabase dashboard for this project, open SQL Editor → New query,
   paste the contents of [`supabase/migration.sql`](supabase/migration.sql),
   and run it. Creates two tables (`smoke_wholesale_applications`,
   `smoke_wholesale_newsletter`) and a private `smoke-wholesale-licenses`
   storage bucket, all idempotent — safe to re-run. (Already applied once
   directly against this project — re-running is just a safety net.)
2. Copy `.env.example` to `.env.local` and fill in the project's URL and
   anon key (already done for local dev in this checkout).

The GitHub Pages deploy workflow bakes the same two values in as plain
build-time env vars (see `.github/workflows/deploy-web.yml`) — safe because
the anon key is designed to be public, it's what RLS is for.

**What the two forms actually do now:**
- *Create a free account* → `supabase.auth.signUp`. If the project has email
  confirmation on (check Authentication → Providers in the dashboard),
  accounts stay unconfirmed until the user clicks the email link.
- *Register for wholesale pricing* → requires a signed-in user, uploads any
  attached files to the private storage bucket under `<user_id>/…`, then
  inserts a row into `smoke_wholesale_applications` with `status: pending`.
  There's no admin review screen yet — approving an application today means
  updating its `status` in the Supabase Table Editor by hand.
- *Newsletter* → inserts into `smoke_wholesale_newsletter`; a duplicate
  email is treated as "already subscribed," not an error.

## Run it

```
npm install
npm run dev       # http://localhost:5173 — live-reloading, for the client walkthrough
npm run build      # type-checks (tsc -b) then produces dist/
npm run preview    # serve the production build locally
```

## Showing it to the client

`npm run build && npm run preview` gives you the real production bundle
(≈120 KB gzipped JS) running locally — closer to what they'd actually get
than a dev server. For a shareable link without screen-sharing, `dist/` is a
static site: drag-and-drop it onto Netlify, or run `npx vercel dist --prod`
/ `npx netlify deploy --prod --dir dist` once you're signed into an account,
and you have a live URL in under a minute.

## What's demo vs. what a real build adds

Being upfront about this in the pitch tends to land better than pretending
it's finished — clients read a stated roadmap as competence, not as a gap.

- **Cart & checkout** — the "Add to cart" and "View cart" actions are visual
  only (a toast, a static subtotal). A real build wires this to an actual
  cart/checkout flow and a payment processor — note that Stripe, PayPal and
  Square all restrict or prohibit vape/hemp-derived THC merchants, so this
  needs a high-risk-friendly processor (PaymentCloud, Durango) or a B2B
  net-terms/ACH provider (Balance), not a mainstream one.
- **Wholesale application review** — accounts, resale-certificate uploads,
  and applications are real (Supabase Auth + Postgres + Storage, see above),
  but there's no admin screen yet. Approving an application means flipping
  its `status` by hand in the Supabase Table Editor; production wants a
  proper review queue or a service like Middesk/Persona for automated
  business verification.
- **Catalogue data** — categories/products are hand-written sample data.
  Production pulls from a real PIM/catalogue (headless commerce platform or
  a custom database) via the same `lib/data.ts`-shaped types.
- **Product imagery** — `GlassSwatch` is the placeholder art system described
  above; real product photography drops in once available.
- **Age/state compliance for hemp-derived items** — the notice banner is
  static text. Production needs real age verification and state-availability
  logic at checkout, reviewed by counsel.
