export type Category = {
  id: string
  name: string
  count: string
  hue: number
  ageGated?: boolean
}

export const categories: Category[] = [
  { id: "papers", name: "Rolling papers & wraps", count: "140+ SKUs", hue: 255 },
  { id: "cones", name: "Pre-rolled cones", count: "60+ SKUs", hue: 235 },
  { id: "glass", name: "Glass water pipes", count: "210+ SKUs", hue: 200 },
  { id: "handpipes", name: "Hand pipes & bubblers", count: "180+ SKUs", hue: 265 },
  { id: "hookah", name: "Hookahs & shisha", count: "90+ SKUs", hue: 190 },
  { id: "grinders", name: "Grinders & digital scales", count: "120+ SKUs", hue: 245 },
  { id: "lighters", name: "Lighters & torches", count: "70+ SKUs", hue: 20 },
  { id: "vape", name: "Vaporizers & batteries", count: "85+ SKUs", hue: 275 },
  { id: "hemp", name: "Hemp-derived edibles", count: "45+ SKUs", hue: 150, ageGated: true },
  { id: "storage", name: "Storage & odor control", count: "55+ SKUs", hue: 215 },
  { id: "novelty", name: "Novelty, apparel & gifts", count: "130+ SKUs", hue: 300 },
  { id: "cstore", name: "C-store snacks & drinks", count: "160+ SKUs", hue: 35 },
]

export type Product = {
  id: string
  name: string
  spec: string
  pack: string
  price: number
  stock: "IN STOCK" | "LOW STOCK"
  hue: number
  ageGated?: boolean
}

export const products: Product[] = [
  { id: "p1", name: "Rolling papers, king size", spec: "24 packs per case", pack: "CASE / 50", price: 68, stock: "IN STOCK", hue: 255 },
  { id: "p2", name: "Pre-rolled cone variety", spec: "12 units per pack", pack: "CASE / 20", price: 54, stock: "IN STOCK", hue: 235 },
  { id: "p3", name: "Glass water pipe, 14 inch", spec: "Borosilicate, assorted", pack: "CASE / 12", price: 215, stock: "IN STOCK", hue: 200 },
  { id: "p4", name: "4-piece herb grinder, 50mm", spec: "Anodized aluminum, assorted", pack: "CASE / 24", price: 89, stock: "IN STOCK", hue: 245 },
  { id: "p5", name: "Hemp-derived gummies, 25mg", spec: "10-pack, assorted flavors", pack: "CASE / 12", price: 96, stock: "LOW STOCK", hue: 150, ageGated: true },
]

export const steps = [
  {
    n: "01",
    title: "Browse & price your order",
    body: "Every price is visible up front across the full catalogue — no account needed to shop or compare.",
  },
  {
    n: "02",
    title: "Create a free account",
    body: "Check out in minutes. No licence or Tax ID required for standard retail pricing.",
  },
  {
    n: "03",
    title: "Register for wholesale pricing",
    body: "Licensed retailers can add a resale certificate to unlock tax-exempt case pricing and net terms.",
  },
]

export const faqs = [
  {
    q: "Do I need an account to see pricing?",
    a: "No. Every price on the site is visible without logging in. You'll only need a free account to check out.",
  },
  {
    q: "What do I need for tax-exempt wholesale pricing?",
    a: "A current resale certificate and your business Tax ID. Once verified, tax-exempt case pricing and net terms apply automatically at checkout.",
  },
  {
    q: "Are hemp-derived THC/CBD products legal to resell?",
    a: "It depends on your state — some restrict or ban hemp-derived THC products entirely. Check each product page and your local regulations before ordering; retailers are responsible for confirming their own compliance.",
  },
  {
    q: "Is there a minimum order?",
    a: "No case minimums on standard orders. Tax-exempt wholesale accounts may see additional volume pricing at higher case counts.",
  },
  {
    q: "Where do you ship from?",
    a: "Orders ship from three regional warehouses, typically arriving within 24–48 hours of dispatch for most of the continental US.",
  },
]

export const quickOrder = [
  { name: "Al Fakher shisha, 250g", qty: 1, price: 11.95 },
  { name: "4-piece herb grinder, 50mm", qty: 2, price: 29.95 },
  { name: "Butane torch lighter", qty: 1, price: 9.5 },
]
