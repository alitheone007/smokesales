# smokesales

This is a smoke wholesale app web based and app building new for a client.

## Storefront concept (v2)

A single-page wholesale storefront for smoke shops, vape shops and C-stores,
built on the "Borosilicate" brand direction (glass, smoke, dichroic accents)
— palette choice 03 from the brand-direction deck.

Pricing model matches how mysmokewholesale.com (the reference competitor)
actually works: prices are visible to everyone with no login, a free account
is enough to check out, and a separate resale-certificate registration flow
unlocks tax-exempt case pricing and net terms for licensed retailers. The
category set was broadened to match that site's real breadth — hookahs,
grinders/scales, hemp-derived edibles, novelty/apparel and C-store snacks —
alongside the original papers/cones/glass/hardware lines.

- `index.html` — the page (nav, hero quick-order panel, trust strip, 12
  categories, hot-this-week products with live prices, how-it-works, the
  two get-started forms, FAQ, footer)
- `css/style.css` — styles, with full light/dark theming via CSS custom
  properties (honors both a manual toggle and the OS `prefers-color-scheme`)
- `js/main.js` — theme toggle, mobile nav, add-to-cart toast, and the two
  form handlers (free account signup, wholesale/resale-certificate registration)

### Running it locally

No build step — open `index.html` directly in a browser, or serve the folder:

```
npx serve .
```

### Notes for the client

Product names, catalogue counts, prices, and contact details (WhatsApp
number, email) are placeholders for layout purposes and need real values
before launch. The hemp-derived edibles category in particular needs a real
state-availability/age-gate mechanism at checkout, not just the on-page
disclaimer text. Account flows, resale-certificate verification, and any
non-account enquiry route should be reviewed by counsel before build-out.

## `/web` — production-stack demo (v3)

The pitch-ready version: the same storefront rebuilt on Vite + React 19 +
TypeScript + Tailwind CSS v4 + Framer Motion, with the "Borosilicate"
palette as real design tokens and full light/dark theming. Meant to be run
live in front of the client as the "here's what we'd actually build" demo,
not just looked at as a picture.

Highlights over the static v2:
- Scroll-triggered reveals, an orchestrated hero entrance, a mouse-reactive
  dichroic parallax blob, and an animated theme toggle, accordion and cart
  toast — all Framer Motion, all respecting `prefers-reduced-motion`.
- An original generative "dichroic glass" art system (`GlassSwatch`) stands
  in for product photography instead of scraped or stock images — nothing
  in this repo was pulled from mysmokewholesale.com or any other site.
- A real component architecture (`src/components`, `src/sections`,
  `src/lib`) that a further build extends directly rather than replaces.

See [`web/README.md`](web/README.md) for the full architecture, how to run
and build it, how to show it to the client, and an honest list of what's
demo-only versus what a production build still needs (real cart/checkout,
account/verification backend, catalogue data source, compliance logic).
