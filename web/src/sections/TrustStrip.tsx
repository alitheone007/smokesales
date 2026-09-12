import { motion } from "framer-motion"

const items = [
  { b: "Live pricing", t: "visible to everyone, no login required" },
  { b: "Free account checkout", t: "no licence upload needed to buy" },
  { b: "Net terms available", t: "for verified wholesale accounts" },
  { b: "Nationwide shipping", t: "from three regional warehouses" },
]

export function TrustStrip() {
  return (
    <section className="border-y border-rule bg-surf py-5">
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="container-px flex flex-wrap justify-between gap-x-7 gap-y-3 text-[12px] text-muted"
      >
        {items.map((it) => (
          <motion.li
            key={it.b}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            className="flex items-center gap-2"
          >
            <b className="font-medium text-ink">{it.b}</b> — {it.t}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
