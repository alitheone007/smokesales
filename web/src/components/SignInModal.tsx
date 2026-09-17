import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { type FormEvent, useState } from "react"
import { useAuth } from "../lib/auth"
import { supabase } from "../lib/supabase"

export function SignInModal() {
  const { signInOpen, setSignInOpen } = useAuth()
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
    if (error) {
      setError(error.message)
      return
    }
    setSignInOpen(false)
  }

  return (
    <AnimatePresence>
      {signInOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40"
            onClick={() => setSignInOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
            className="fixed left-1/2 top-1/2 z-50 w-[min(360px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-panel border border-rule bg-surf p-7"
          >
            <button
              type="button"
              onClick={() => setSignInOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted hover:text-ink"
            >
              <X size={16} />
            </button>
            <h2 className="h-display text-[18px] text-ink">Sign in</h2>
            <p className="mt-1 text-[12px] text-muted">See your live pricing and past orders.</p>
            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
              />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
              />
              <button type="submit" disabled={busy} className="btn-solid mt-1 disabled:opacity-60">
                {busy ? "Signing in…" : "Sign in"}
              </button>
              {error && <p className="text-[12px] text-warn">{error}</p>}
            </form>
            <p className="mt-4 text-center text-[12px] text-muted">
              No account yet?{" "}
              <a
                href="#get-started"
                onClick={() => setSignInOpen(false)}
                className="text-accent underline underline-offset-2"
              >
                Create one
              </a>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
