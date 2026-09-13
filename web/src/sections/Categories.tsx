import { motion } from "framer-motion"
import { GlassSwatch } from "../components/GlassSwatch"
import { GlowCard } from "../components/GlowCard"
import { AgeBadge } from "../components/Badge"
import { categories } from "../lib/data"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Categories() {
  return (
    <section id="categories" className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="h-display text-[24px]">Shop by category</h2>
            <p className="mt-1.5 max-w-[50ch] text-[13px] text-muted">
              The full catalogue and every price are open to browse. Sign in only when you're ready to check out.
            </p>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {categories.map((c) => (
            <motion.div
              key={c.id}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <GlowCard as="a" href="#hot" radius={200} className="card block overflow-hidden">
                <GlassSwatch hue={c.hue} className="h-20 w-full" />
                <div className="p-4">
                  <h3 className="flex items-center gap-1.5 text-[14px] text-ink">
                    {c.name}
                    {c.ageGated && <AgeBadge />}
                  </h3>
                  <div className="mt-1 font-mono text-[11px] text-muted">{c.count}</div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
