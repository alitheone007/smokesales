import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import type { PointerEvent } from "react"
import { quickOrder } from "../lib/data"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  // mouse-reactive parallax for the dichroic blob behind the hero panel
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const smx = useSpring(mx, { stiffness: 60, damping: 20 })
  const smy = useSpring(my, { stiffness: 60, damping: 20 })
  const blobBg = useMotionTemplate`radial-gradient(60% 60% at ${smx}% ${smy}%, var(--color-sheen-a) 0%, transparent 65%)`

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const subtotal = quickOrder.reduce((sum, l) => sum + l.qty * l.price, 0)

  return (
    <section className="relative overflow-hidden py-16 md:py-24" onPointerMove={onPointerMove}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{ background: blobBg }}
      />
      <div className="container-px relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="eyebrow">
            Wholesale smoke shop distributor
          </motion.div>
          <motion.h1 variants={item} className="h-display mt-3 max-w-[16ch] text-[34px] leading-[1.1] sm:text-[44px]">
            Wholesale pricing for smoke shops, vape shops &amp; C-stores.
          </motion.h1>
          <motion.p variants={item} className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Every price on the site is live and visible — no login required to browse or compare. Create a free
            account to check out, or register your resale certificate for tax-exempt case pricing and net terms.
          </motion.p>
          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            <a href="#get-started" className="btn-solid">
              Create free account
            </a>
            <a href="#categories" className="btn-ghost">
              Browse catalogue
            </a>
          </motion.div>
          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[12px] text-muted">
            {["Live pricing, no login required", "Ships in 24–48h", "1,200+ SKUs in stock"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-none stroke-ok" fill="none" strokeWidth={2}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {b}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="sheen-edge card relative rounded-panel p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow !text-[11px]">Quick order</span>
            <span className="rounded-full border border-rule px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-ok">
              LIVE PRICING
            </span>
          </div>
          {quickOrder.map((line) => (
            <div key={line.name} className="flex items-center justify-between gap-3 border-b border-rule py-3 text-[13px]">
              <span className="text-ink">
                {line.name}
                <br />
                <span className="text-[11px] text-muted">Qty {line.qty}</span>
              </span>
              <span className="whitespace-nowrap font-mono text-[13px] font-medium text-ink">
                ${(line.qty * line.price).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 text-[13px]">
            <span className="font-medium text-ink">Subtotal</span>
            <span className="font-mono text-[15px] font-semibold text-accent">${subtotal.toFixed(2)}</span>
          </div>
          <a href="#get-started" className="btn-solid mt-4 w-full">
            View cart
          </a>
        </motion.div>
      </div>
    </section>
  )
}
