import { ChevronLeft, ChevronRight, ExternalLink, ImageOff, Search } from "lucide-react"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"

type CatalogProduct = {
  id: string
  name: string
  category: string
  image: string
  sourcePage: string
  sourceImage: string
}

type CatalogPayload = {
  count: number
  products: CatalogProduct[]
}

const PAGE_SIZE = 48
const baseUrl = import.meta.env.BASE_URL

export function Catalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All categories")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useLayoutEffect(() => {
    if (window.location.hash !== "#catalog") return
    window.requestAnimationFrame(() => {
      document.getElementById("catalog")?.scrollIntoView()
    })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${baseUrl}catalog/products.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Catalogue request failed (${response.status})`)
        return response.json() as Promise<CatalogPayload>
      })
      .then((payload) => setProducts(payload.products))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return
        setError(reason instanceof Error ? reason.message : "Unable to load catalogue")
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  )
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    return products.filter(
      (product) =>
        (category === "All categories" || product.category === category) &&
        (!term || `${product.name} ${product.id} ${product.category}`.toLocaleLowerCase().includes(term)),
    )
  }, [category, products, query])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <section id="catalog" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-px">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Local product library</span>
            <h2 className="h-display mt-2 text-[28px]">Full catalogue</h2>
            <p className="mt-1.5 text-[13px] text-muted">
              {loading ? "Loading catalogue…" : `${filtered.toLocaleString()} of ${products.length.toLocaleString()} products`}
            </p>
          </div>
          <p className="max-w-[48ch] text-[12px] leading-relaxed text-muted">
            Product imagery is served from this project. Contact sales to confirm availability, case quantity, and current pricing.
          </p>
        </div>

        <div className="mb-7 grid gap-3 rounded-card border border-rule bg-surf p-3 sm:grid-cols-[1fr_240px]">
          <label className="relative">
            <Search aria-hidden="true" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <span className="sr-only">Search catalogue</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search product name or SKU"
              className="w-full rounded-chip border border-rule bg-canvas py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition focus:border-accent"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setPage(1)
              }}
              className="w-full rounded-chip border border-rule bg-canvas px-3 py-2.5 text-[13px] text-ink outline-none transition focus:border-accent"
            >
              {categories.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>

        {error && <div role="alert" className="rounded-card border border-warn/40 bg-surf p-5 text-[13px] text-warn">{error}</div>}
        {!loading && !error && visible.length === 0 && (
          <div className="rounded-card border border-rule bg-surf p-10 text-center text-[13px] text-muted">No products match your search.</div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visible.map((product) => <CatalogCard key={product.id} product={product} />)}
        </div>

        {!loading && !error && filtered.length > PAGE_SIZE && (
          <nav aria-label="Catalogue pages" className="mt-8 flex items-center justify-center gap-3">
            <button type="button" className="btn-ghost px-3" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              <ChevronLeft size={15} /> Previous
            </button>
            <span className="font-mono text-[11px] text-muted">Page {safePage} of {pages}</span>
            <button type="button" className="btn-ghost px-3" disabled={safePage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>
              Next <ChevronRight size={15} />
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}

function CatalogCard({ product }: { product: CatalogProduct }) {
  const [failed, setFailed] = useState(false)
  return (
    <article className="card flex min-w-0 flex-col overflow-hidden">
      <div className="aspect-square overflow-hidden bg-white">
        {failed ? (
          <div className="flex h-full items-center justify-center text-muted"><ImageOff size={22} /><span className="sr-only">Image unavailable</span></div>
        ) : (
          <img
            src={`${baseUrl}${product.image}`}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-contain p-2 transition duration-300 hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-rule p-3">
        <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-accent">{product.category}</span>
        <h3 className="line-clamp-3 text-[12px] font-medium leading-snug text-ink" title={product.name}>{product.name}</h3>
        <div className="mt-auto pt-3">
          <div className="mb-2 truncate font-mono text-[9px] text-muted" title={product.id}>SKU {product.id}</div>
          <a href={product.sourcePage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
            Product details <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </article>
  )
}

