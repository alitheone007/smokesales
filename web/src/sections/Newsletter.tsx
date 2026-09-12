import { motion } from "framer-motion"
import { type FormEvent, useState } from "react"

export function Newsletter() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <section className="py-14 md:py-20">
      <div className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="sheen-edge card flex flex-col items-start gap-5 rounded-panel p-8 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <span className="eyebrow">Stay stocked</span>
            <h2 className="h-display mt-2 text-[22px]">New SKUs and restocks, straight to your inbox</h2>
            <p className="mt-1.5 max-w-[46ch] text-[13px] text-muted">
              One email a week — new arrivals, restock alerts, and case-price drops. No spam, unsubscribe anytime.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex w-full max-w-[380px] flex-none flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletterEmail" className="sr-only">
              Email address
            </label>
            <input
              id="newsletterEmail"
              name="newsletterEmail"
              type="email"
              required
              placeholder="you@yourshop.com"
              className="w-full rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
            />
            <button type="submit" className="btn-solid flex-none">
              Subscribe
            </button>
          </form>
        </motion.div>
        {sent && <p className="mt-3 text-[12px] text-ok">Subscribed — welcome aboard.</p>}
      </div>
    </section>
  )
}
