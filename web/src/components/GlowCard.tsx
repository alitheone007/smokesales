import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { type ElementType, type PointerEvent, type ReactNode } from "react"

type GlowCardProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  /** px radius of the light — bigger reads as a softer, more ambient glow */
  radius?: number
  href?: string
  onClick?: () => void
}

/**
 * A card whose border lights up along a cursor-following radial gradient,
 * masked so only the 1px edge glows (the fill stays put). This is the
 * "illuminated border" treatment used across every product/category card —
 * built once here so the whole catalogue gets a consistent, premium hover
 * feel instead of a flat static border.
 */
export function GlowCard({ children, className = "", as, radius = 220, href, onClick }: GlowCardProps) {
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const smx = useSpring(mx, { stiffness: 350, damping: 32, mass: 0.4 })
  const smy = useSpring(my, { stiffness: 350, damping: 32, mass: 0.4 })
  const glowOpacity = useMotionValue(0)
  const springOpacity = useSpring(glowOpacity, { stiffness: 300, damping: 30 })

  const borderGlow = useMotionTemplate`radial-gradient(${radius}px circle at ${smx}% ${smy}%, var(--color-sheen-a) 0%, var(--color-ok) 45%, transparent 75%)`
  const fillGlow = useMotionTemplate`radial-gradient(${radius * 1.4}px circle at ${smx}% ${smy}%, color-mix(in srgb, var(--color-sheen-a) 10%, transparent) 0%, transparent 70%)`

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const Comp = (as ?? (href ? "a" : "div")) as ElementType

  return (
    <Comp
      href={href}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerEnter={() => glowOpacity.set(1)}
      onPointerLeave={() => glowOpacity.set(0)}
      className={`group relative isolate ${className}`}
    >
      {/* ambient fill glow, very soft */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: fillGlow, opacity: springOpacity }}
      />
      {/* the illuminated 1px border */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          padding: 1,
          background: borderGlow,
          opacity: springOpacity,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude" as never,
        }}
      />
      {children}
    </Comp>
  )
}
