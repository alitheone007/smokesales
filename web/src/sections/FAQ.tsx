import { Accordion } from "../components/Accordion"
import { faqs } from "../lib/data"

export function FAQ() {
  return (
    <section id="faq" className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8">
          <h2 className="h-display text-[24px]">Frequently asked</h2>
        </div>
        <Accordion items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
      </div>
    </section>
  )
}
