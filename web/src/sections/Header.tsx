import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "../components/ThemeToggle"

const NAV_LINKS = [
  { href: "#categories", label: "Catalogue" },
  { href: "#hot", label: "Hot this week" },
  { href: "#how", label: "How it works" },
  { href: "#get-started", label: "Create account" },
  { href: "#faq", label: "FAQ" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8))

  return (
    <header
      className={`sticky top-0 z-40 border-b border-rule backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-canvas/85" : "bg-canvas/60"
      }`}
    >
      <div className="container-px flex items-center justify-between gap-4 py-4">
        <a href="#top" className="font-display text-[17px] font-semibold tracking-tight text-ink">
          SMOKE<span className="text-accent">WHOLESALE</span>
        </a>

        <nav className="hidden items-center gap-7 text-[13px] text-muted md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href="#signin" className="btn-ghost hidden sm:inline-flex">
            Sign in
          </a>
          <a href="#get-started" className="btn-solid hidden sm:inline-flex">
            Create account
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink md:hidden"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-rule bg-surf md:hidden"
          >
            <div className="container-px flex flex-col py-2">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-rule py-3 text-[13px] text-ink last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
              <a href="#signin" onClick={() => setMenuOpen(false)} className="py-3 text-[13px] text-ink">
                Sign in
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
