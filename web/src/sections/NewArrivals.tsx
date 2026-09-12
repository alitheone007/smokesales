import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { GlassSwatch } from "../components/GlassSwatch"
import { AgeBadge } from "../components/Badge"
import { newArrivals } from "../lib/data"
import { useToast } from "../lib/toast"

export function NewArrivals() {
  const { show } = useToast()

  return (
    <section className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Just landed</span>
            <h2 className="h-display mt-2 text-[24px]">New arrivals</h2>
            <p className="mt-1.5 max-w-[50ch] text-[13px] text-muted">
              Newest additions to the catalogue, added as soon as they clear our warehouses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {newArrivals.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card overflow-hidden"
            >
              <GlassSwatch hue={p.hue} className="h-32 w-full" />
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.1em] text-ok">{p.stock}</span>
                  <span className="font-mono text-[10px] text-muted">{p.pack}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-ink">
                  {p.name}
                  {p.ageGated && <AgeBadge />}
                </div>
                <div className="mb-3.5 mt-0.5 text-[12px] text-muted">{p.spec}</div>
                <div className="mb-3.5 flex items-baseline gap-1">
                  <span className="font-mono text-[18px] font-semibold text-ink">${p.price.toFixed(2)}</span>
                  <span className="text-[11px] text-muted">/case</span>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => show(`Added "${p.name}" to cart`)}
                  className="btn-solid w-full"
                >
                  <ShoppingCart size={14} />
                  Add to cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
