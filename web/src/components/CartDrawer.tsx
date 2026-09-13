import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"
import { useCart } from "../lib/cart"

export function CartDrawer() {
  const { lines, setQty, remove, subtotal, open, setOpen } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-rule bg-surf"
          >
            <div className="flex items-center justify-between border-b border-rule p-5">
              <div className="flex items-center gap-2 text-[15px] font-medium text-ink">
                <ShoppingCart size={16} />
                Your cart
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-muted hover:text-ink" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <p className="mt-10 text-center text-[13px] text-muted">Your cart is empty. Add a case to get started.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {lines.map((l) => (
                    <div key={l.id} className="flex items-center gap-3 border-b border-rule pb-4">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] text-ink">{l.name}</div>
                        <div className="font-mono text-[12px] text-muted">${l.price.toFixed(2)} / case</div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-rule px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="flex h-5 w-5 items-center justify-center text-muted hover:text-ink"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center font-mono text-[12px] text-ink">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="flex h-5 w-5 items-center justify-center text-muted hover:text-ink"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.id)} className="text-muted hover:text-warn" aria-label={`Remove ${l.name}`}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-rule p-5">
              <div className="mb-4 flex items-center justify-between text-[14px]">
                <span className="text-ink">Subtotal</span>
                <span className="font-mono font-semibold text-accent">${subtotal.toFixed(2)}</span>
              </div>
              <a
                href="#checkout"
                onClick={() => setOpen(false)}
                className={`btn-solid w-full ${lines.length === 0 ? "pointer-events-none opacity-50" : ""}`}
              >
                Checkout
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
