import { motion } from "framer-motion"
import { steps } from "../lib/data"

export function HowItWorks() {
  return (
    <section id="how" className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8">
          <h2 className="h-display text-[24px]">How it works</h2>
          <p className="mt-1.5 max-w-[50ch] text-[13px] text-muted">
            Browse and price out an order with no account at all — an account only comes in at checkout.
          </p>
        </div>

        <div className="relative grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
              className="card p-6"
            >
              <div className="mb-3.5 font-mono text-[12px] text-accent">{s.n}</div>
              <h3 className="mb-2 text-[15px] font-medium text-ink">{s.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
