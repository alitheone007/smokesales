import { motion } from "framer-motion"
import { AlertTriangle, ShoppingCart } from "lucide-react"
import { GlassSwatch } from "../components/GlassSwatch"
import { AgeBadge } from "../components/Badge"
import { products } from "../lib/data"
import { useToast } from "../lib/toast"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ProductGrid() {
  const { show } = useToast()

  return (
    <section id="hot" className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="h-display text-[24px]">Hot this week</h2>
            <p className="mt-1.5 max-w-[50ch] text-[13px] text-muted">
              Fast-moving lines restocked from our own warehouses. Prices shown are per case, updated daily.
            </p>
          </div>
          <span className="text-[11px] text-muted">Updated daily</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={item} className="card overflow-hidden">
              <GlassSwatch hue={p.hue} className="h-32 w-full" />
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] ${
                      p.stock === "IN STOCK" ? "text-ok" : "text-accent"
                    }`}
                  >
                    {p.stock}
                  </span>
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
        </motion.div>

        <div className="mt-6 flex items-start gap-3 rounded-card border border-rule bg-accenton p-4">
          <AlertTriangle size={16} className="mt-0.5 flex-none text-accent" />
          <p className="text-[12px] leading-relaxed text-ink">
            Hemp-derived products are federally regulated but restricted or banned in some states. Availability
            varies by delivery address, and retailers are responsible for confirming their own state and local
            compliance before resale.
          </p>
        </div>
      </div>
    </section>
  )
}
