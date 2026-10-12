import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { LogOut, Menu, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "../components/ThemeToggle"
import { useAuth } from "../lib/auth"
import { useCart } from "../lib/cart"

const NAV_LINKS = [
  { href: "#catalog", label: "Catalogue" },
  { href: "#hot", label: "Hot this week" },
  { href: "#how", label: "How it works" },
  { href: "#get-started", label: "Create account" },
  { href: "#faq", label: "FAQ" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { count, setOpen: setCartOpen } = useCart()
  const { user, setSignInOpen, signOut } = useAuth()

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
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink"
          >
            <ShoppingCart size={16} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] text-accenton">
                {count}
              </span>
            )}
          </button>
          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="max-w-[140px] truncate text-[12px] text-muted" title={user.email ?? undefined}>
                {user.email}
              </span>
              <button type="button" onClick={() => signOut()} className="btn-ghost" aria-label="Sign out">
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setSignInOpen(true)} className="btn-ghost hidden sm:inline-flex">
                Sign in
              </button>
              <a href="#get-started" className="btn-solid hidden sm:inline-flex">
                Create account
              </a>
            </>
          )}

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
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    signOut()
                  }}
                  className="flex items-center gap-1.5 py-3 text-left text-[13px] text-ink"
                >
                  <LogOut size={13} /> Sign out ({user.email})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setSignInOpen(true)
                  }}
                  className="py-3 text-left text-[13px] text-ink"
                >
                  Sign in
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
