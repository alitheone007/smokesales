import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type CartLine = {
  id: string
  name: string
  price: number
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  add: (item: { id: string; name: string; price: number }, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  subtotal: number
  count: number
  open: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "sw-cart"

function loadInitial(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadInitial)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // no persistence available — cart just won't survive a reload
    }
  }, [lines])

  const add: CartContextValue["add"] = (item, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id)
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l))
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty }]
    })
  }

  const setQty: CartContextValue["setQty"] = (id, qty) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    )
  }

  const remove: CartContextValue["remove"] = (id) => setLines((prev) => prev.filter((l) => l.id !== id))
  const clear = () => setLines([])

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.qty, 0), [lines])
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])

  return (
    <CartContext.Provider value={{ lines, add, setQty, remove, clear, subtotal, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}
