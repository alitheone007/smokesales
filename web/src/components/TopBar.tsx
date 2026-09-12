/**
 * Persistent compliance strip. Sits above the header on every page — this is
 * the kind of thing legal review usually wants above the fold, not buried in
 * the footer.
 */
export function TopBar() {
  return (
    <div className="bg-ink py-2 text-center text-[11px] font-medium leading-snug text-canvas">
      <div className="container-px">
        Nicotine and hemp-derived products are addictive. Not for sale to minors — 21+ only, ID checked on delivery.{" "}
        <a href="#faq" className="underline underline-offset-2 hover:opacity-80">
          Learn more
        </a>
      </div>
    </div>
  )
}
