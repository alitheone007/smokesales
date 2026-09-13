import { LogOut, ShieldCheck } from "lucide-react"
import { type FormEvent, useEffect, useState } from "react"
import { ThemeToggle } from "../components/ThemeToggle"
import { supabase } from "../lib/supabase"

type Application = {
  id: string
  created_at: string
  business_name: string
  business_phone: string
  business_address: string
  tax_id: string
  certificate_paths: string[]
  status: "pending" | "approved" | "rejected"
}

type Order = {
  id: string
  created_at: string
  items: { name: string; qty: number; price: number }[]
  subtotal: number
  payment_method: string
  status: string
}

function useSession() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return { loading, userId }
}

function LoginForm() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get("email")),
      password: String(data.get("password")),
    })
    setBusy(false)
    if (error) setError(error.message)
  }

  return (
    <div className="mx-auto mt-24 max-w-[380px] px-5">
      <div className="card rounded-panel p-8">
        <div className="mb-1 flex items-center gap-2 text-[13px] text-accent">
          <ShieldCheck size={16} />
          Admin
        </div>
        <h1 className="h-display text-[20px] text-ink">Sign in</h1>
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
          />
          <button type="submit" disabled={busy} className="btn-solid mt-1 disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {error && <p className="text-[12px] text-warn">{error}</p>}
        </form>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const color = status === "approved" || status === "paid" ? "text-ok" : status === "rejected" || status === "failed" ? "text-warn" : "text-muted"
  return <span className={`font-mono text-[10px] uppercase tracking-[0.08em] ${color}`}>{status}</span>
}

function ApplicationsPanel() {
  const [rows, setRows] = useState<Application[] | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from("smoke_wholesale_applications")
      .select("*")
      .order("created_at", { ascending: false })
    setRows((data as Application[]) ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    setBusyId(id)
    await supabase.from("smoke_wholesale_applications").update({ status }).eq("id", id)
    await load()
    setBusyId(null)
  }

  const openFile = async (path: string) => {
    const { data } = await supabase.storage.from("smoke-wholesale-licenses").createSignedUrl(path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener")
  }

  if (!rows) return <p className="text-[13px] text-muted">Loading…</p>
  if (rows.length === 0) return <p className="text-[13px] text-muted">No wholesale applications yet.</p>

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[14px] text-ink">{r.business_name}</div>
            <StatusPill status={r.status} />
          </div>
          <div className="grid grid-cols-1 gap-1 text-[12px] text-muted sm:grid-cols-2">
            <div>Phone: {r.business_phone}</div>
            <div>Tax ID: {r.tax_id}</div>
            <div className="sm:col-span-2">Address: {r.business_address}</div>
            <div>Submitted: {new Date(r.created_at).toLocaleString()}</div>
          </div>
          {r.certificate_paths.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {r.certificate_paths.map((p) => (
                <button key={p} type="button" onClick={() => openFile(p)} className="text-[11px] text-accent underline underline-offset-2">
                  {p.split("/").pop()}
                </button>
              ))}
            </div>
          )}
          {r.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={busyId === r.id}
                onClick={() => setStatus(r.id, "approved")}
                className="btn-solid !px-3 !py-1.5 text-[12px] disabled:opacity-60"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busyId === r.id}
                onClick={() => setStatus(r.id, "rejected")}
                className="btn-ghost !px-3 !py-1.5 text-[12px] disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OrdersPanel() {
  const [rows, setRows] = useState<Order[] | null>(null)

  useEffect(() => {
    supabase
      .from("smoke_wholesale_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Order[]) ?? []))
  }, [])

  if (!rows) return <p className="text-[13px] text-muted">Loading…</p>
  if (rows.length === 0) return <p className="text-[13px] text-muted">No orders yet.</p>

  return (
    <div className="flex flex-col gap-3">
      {rows.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="font-mono text-[12px] text-ink">#{o.id.slice(0, 8)}</div>
            <StatusPill status={o.status} />
          </div>
          <div className="text-[12px] text-muted">
            {o.items.map((it) => `${it.name} × ${it.qty}`).join(", ")}
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <span className="text-muted">{o.payment_method === "qr_test" ? "QR (test)" : "Card (test)"}</span>
            <span className="font-mono font-medium text-ink">${o.subtotal.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  const [tab, setTab] = useState<"applications" | "orders">("applications")

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-rule bg-canvas/85 backdrop-blur">
        <div className="container-px flex items-center justify-between py-4">
          <div className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
            <ShieldCheck size={16} className="text-accent" />
            Smoke Wholesale — Admin
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 text-[12px] text-muted hover:text-ink"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-px py-8">
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("applications")}
            className={`rounded-full border px-4 py-2 text-[12px] ${tab === "applications" ? "border-accent text-accent" : "border-rule text-muted"}`}
          >
            Wholesale applications
          </button>
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`rounded-full border px-4 py-2 text-[12px] ${tab === "orders" ? "border-accent text-accent" : "border-rule text-muted"}`}
          >
            Orders
          </button>
        </div>
        {tab === "applications" ? <ApplicationsPanel /> : <OrdersPanel />}
      </div>
    </div>
  )
}

function NotAnAdmin() {
  return (
    <div className="mx-auto mt-24 max-w-[380px] px-5 text-center">
      <p className="text-[13px] text-muted">
        Signed in, but this account isn't an admin.{" "}
        <button type="button" onClick={() => supabase.auth.signOut()} className="text-accent underline underline-offset-2">
          Sign out
        </button>
      </p>
    </div>
  )
}

export default function AdminApp() {
  const { loading, userId } = useSession()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null)
      return
    }
    supabase
      .from("admins")
      .select("user_id")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)))
  }, [userId])

  if (loading) return null
  if (!userId) return <LoginForm />
  if (isAdmin === null) return <p className="mt-24 text-center text-[13px] text-muted">Checking access…</p>
  if (!isAdmin) return <NotAnAdmin />
  return <Dashboard />
}
