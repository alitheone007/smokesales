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
  cart/checkout flow (Shopify, Medusa, a custom API, or similar).
- **Accounts & wholesale verification** — both forms show a success state on
  submit but don't call a backend. Production needs real auth, resale
  certificate storage, and a verification workflow (staff review queue or a
  service like Persona/Middesk for automated business verification).
- **Catalogue data** — categories/products are hand-written sample data.
  Production pulls from a real PIM/catalogue (headless commerce platform or
  a custom database) via the same `lib/data.ts`-shaped types.
- **Product imagery** — `GlassSwatch` is the placeholder art system described
  above; real product photography drops in once available.
- **Age/state compliance for hemp-derived items** — the notice banner is
  static text. Production needs real age verification and state-availability
  logic at checkout, reviewed by counsel.
