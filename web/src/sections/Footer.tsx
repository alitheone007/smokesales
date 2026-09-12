const columns = [
  {
    title: "Shop",
    links: [
      { label: "All categories", href: "#categories" },
      { label: "Hot this week", href: "#hot" },
      { label: "Brands we carry", href: "#categories" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Create an account", href: "#get-started" },
      { label: "Wholesale registration", href: "#get-started" },
      { label: "Sign in", href: "#signin" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ's", href: "#faq" },
      { label: "How we work", href: "#how" },
      { label: "Contact us", href: "mailto:wholesale@example.com" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Age policy", href: "#faq" },
      { label: "Hemp & THC disclaimer", href: "#faq" },
      { label: "Shipping policy", href: "#faq" },
      { label: "Return & refund policy", href: "#faq" },
      { label: "Privacy & terms", href: "#faq" },
    ],
  },
]

export function Footer() {
  return (
    <footer id="signin" className="border-t border-rule bg-surf py-11">
      <div className="container-px">
        <div className="mb-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-2.5 font-display text-[17px] font-semibold text-ink">
              SMOKE<span className="text-accent">WHOLESALE</span>
            </div>
            <p className="max-w-[34ch] text-[12px] text-muted">
              Wholesale distribution for smoke shops, vape shops and C-stores. Live pricing for everyone; tax-exempt
              wholesale pricing for verified retailers.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-[12px] font-medium text-ink">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[12px] text-muted transition-colors hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="max-w-[90ch] border-t border-rule pt-4.5 text-[11px] leading-relaxed text-muted">
          Age-restricted products. Some categories, including hemp-derived THC/CBD goods and vape hardware, are
          restricted or unavailable in certain states — availability is checked against your delivery address at
          checkout. Product names, specifications and prices are placeholders for layout purposes and subject to
          change. Nothing on this site constitutes legal advice regarding tobacco, vape, hemp or paraphernalia
          regulation in your jurisdiction — retailers are responsible for confirming their own compliance
          obligations before purchase and resale.
        </p>
        <div className="mt-4 flex flex-wrap justify-between gap-2.5 text-[11px] text-muted">
          <span>© 2026 Smoke Wholesale. All rights reserved.</span>
          <span>Concept build — placeholder catalogue for layout purposes.</span>
        </div>
      </div>
    </footer>
  )
}
