import { motion } from "framer-motion"
import { ExternalLink, ShoppingCart } from "lucide-react"
import { FeaturedProductImage } from "../components/FeaturedProductImage"
import { featuredImages } from "../lib/featuredImages"
import { GlowCard } from "../components/GlowCard"
import { AgeBadge } from "../components/Badge"
import { newArrivals } from "../lib/data"
import { useCart } from "../lib/cart"
import { useToast } from "../lib/toast"

const arrivals = [
  { ...newArrivals[0], sourcePage: "" },
  { id: "716165151098-1", name: "RAW bamboo rolling mat", spec: "Natural bamboo · 24 mats per box", pack: "BOX / 24", price: null, stock: "CATALOGUE PICK", hue: 35, ageGated: false, sourcePage: "https://www.mysmokewholesale.com/716165151098-1.html" },
  { id: "888931-1", name: "Smizzles organic hemp cones", spec: "Pre-rolled · 98mm · 800 cones per box", pack: "BOX / 800", price: null, stock: "CATALOGUE PICK", hue: 150, ageGated: false, sourcePage: "https://www.mysmokewholesale.com/888931-1.html" },
]

export function NewArrivals() {
  const { show } = useToast()
  const { add } = useCart()

  return (
    <section id="new-arrivals" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Just landed</span>
            <h2 className="h-display mt-2 text-[24px]">New arrivals</h2>
            <p className="mt-1.5 max-w-[50ch] text-[13px] text-muted">
              Explore our latest featured picks, from everyday essentials to fresh discoveries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {arrivals.map((p, i) => (
            <motion.div
              key={p.id}
              className="h-full"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
            <GlowCard radius={200} className="card flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <FeaturedProductImage {...featuredImages[p.id]} hue={p.hue} label="Discover" large />
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.1em] text-ok">{p.stock}</span>
                  <span className="font-mono text-[10px] text-muted">{p.pack}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[16px] font-medium text-ink">
                  {p.name}
                  {p.ageGated && <AgeBadge />}
                </div>
                <div className="mb-3.5 mt-0.5 text-[12px] text-muted">{p.spec}</div>
                <div className="mb-3.5 flex items-baseline gap-1">
                  {p.price !== null ? <><span className="font-mono text-[18px] font-semibold text-ink">${p.price.toFixed(2)}</span><span className="text-[11px] text-muted">/case</span></> : <span className="text-[12px] text-muted">View product for pricing and availability</span>}
                </div>
                {p.sourcePage ? <a href={p.sourcePage} target="_blank" rel="noreferrer" className="btn-solid mt-auto w-full"><ExternalLink size={14} />View product</a> : <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (p.price === null) return
                    add({ id: p.id, name: p.name, price: p.price })
                    show(`Added "${p.name}" to cart`)
                  }}
                  className="btn-solid mt-auto w-full"
                >
                  <ShoppingCart size={14} />
                  Add to cart
                </motion.button>}
              </div>
            </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
