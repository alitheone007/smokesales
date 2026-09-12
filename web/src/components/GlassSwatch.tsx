import { motion } from "framer-motion"

type GlassSwatchProps = {
  hue?: number
  className?: string
  /** 0-1, how strong the highlight sweep is on hover */
  interactive?: boolean
}

/**
 * Original generative "dichroic glass" art used in place of product photography.
 * Every instance is a pure CSS/SVG composition parameterised by `hue`, so the
 * whole catalogue gets a consistent, licensable visual system instead of stock
 * or scraped imagery.
 */
export function GlassSwatch({ hue = 255, className = "", interactive = true }: GlassSwatchProps) {
  const a = `hsl(${hue} 85% 62%)`
  const b = `hsl(${(hue + 45) % 360} 80% 58%)`
  const c = `hsl(${(hue + 190) % 360} 70% 55%)`

  return (
    <div className={`relative overflow-hidden rounded-card ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 100% at 8% 8%, ${a} 0%, transparent 55%),
            radial-gradient(100% 90% at 90% 20%, ${c} 0%, transparent 50%),
            radial-gradient(140% 120% at 60% 100%, ${b} 0%, transparent 60%),
            linear-gradient(160deg, var(--color-surf), var(--color-canvas))
          `,
          opacity: 0.9,
        }}
      />
      {/* frosted grain overlay */}
      <svg className="absolute inset-0 h-full w-full mix-blend-overlay opacity-[0.35]" aria-hidden="true">
        <filter id={`grain-${hue}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${hue})`} />
      </svg>
      {/* glass edge highlight */}
      <div className="absolute inset-0 rounded-card ring-1 ring-inset ring-white/10" />
      {interactive && (
        <motion.div
          className="pointer-events-none absolute -inset-1"
          style={{
            background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)`,
          }}
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      )}
    </div>
  )
}
