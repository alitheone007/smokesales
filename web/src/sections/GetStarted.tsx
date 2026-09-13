import { motion } from "framer-motion"
import { MessageCircle, UploadCloud } from "lucide-react"
import { type FormEvent, useState } from "react"
import { supabase } from "../lib/supabase"

function Field({
  id,
  label,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] text-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="rounded-[7px] border border-rule bg-canvas px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-accent"
      />
    </div>
  )
}

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "ok"; message: string } | { kind: "error"; message: string }

function StatusLine({ status }: { status: Status }) {
  if (status.kind === "ok") return <p className="mt-3.5 max-w-[60ch] text-[12px] text-ok">{status.message}</p>
  if (status.kind === "error") return <p className="mt-3.5 max-w-[60ch] text-[12px] text-warn">{status.message}</p>
  return null
}

export function GetStarted() {
  const [signupStatus, setSignupStatus] = useState<Status>({ kind: "idle" })
  const [wholesaleStatus, setWholesaleStatus] = useState<Status>({ kind: "idle" })

  const onSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setSignupStatus({ kind: "busy" })

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: String(data.get("suEmail")),
      password: String(data.get("suPassword")),
      options: {
        data: {
          full_name: data.get("suName"),
          store_name: data.get("suStore") || null,
        },
      },
    })

    if (error) {
      setSignupStatus({ kind: "error", message: error.message })
      return
    }

    form.reset()
    setSignupStatus({
      kind: "ok",
      message: signUpData.session
        ? "Account created — you're signed in and can check out right away."
        : "Account created — check your email to confirm it, then come back to register for wholesale pricing.",
    })
  }

  const onWholesale = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setWholesaleStatus({ kind: "busy" })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setWholesaleStatus({
        kind: "error",
        message: "Create a free account first (the card on the left), then come back to submit this form.",
      })
      return
    }

    const fileInput = form.elements.namedItem("certUpload") as HTMLInputElement | null
    const files = fileInput?.files ? Array.from(fileInput.files) : []
    const certificatePaths: string[] = []

    for (const file of files) {
      const path = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from("smoke-wholesale-licenses").upload(path, file)
      if (uploadError) {
        setWholesaleStatus({ kind: "error", message: `Couldn't upload ${file.name}: ${uploadError.message}` })
        return
      }
      certificatePaths.push(path)
    }

    const { error: insertError } = await supabase.from("smoke_wholesale_applications").insert({
      user_id: user.id,
      business_name: data.get("bizName"),
      business_phone: data.get("bizPhone"),
      business_address: data.get("bizAddress"),
      tax_id: data.get("taxId"),
      certificate_paths: certificatePaths,
    })

    if (insertError) {
      setWholesaleStatus({ kind: "error", message: insertError.message })
      return
    }

    form.reset()
    setWholesaleStatus({
      kind: "ok",
      message: "Thanks — your application has been queued for review. Tax-exempt pricing unlocks within one business day.",
    })
  }

  return (
    <section id="get-started" className="py-14 md:py-20">
      <div className="container-px">
        <div className="mb-8">
          <h2 className="h-display text-[24px]">Get started</h2>
          <p className="mt-1.5 max-w-[55ch] text-[13px] text-muted">
            Shop today with a free account, or register your business for tax-exempt wholesale pricing.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* free account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="sheen-edge card rounded-panel p-7 md:p-8"
          >
            <h3 className="h-display text-[20px]">Create a free account</h3>
            <p className="mt-1.5 max-w-[46ch] text-[13px] text-muted">
              See live pricing and check out today. No licence or business documents required.
            </p>
            <form onSubmit={onSignup} className="mt-6">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="suName" label="Full name" required autoComplete="name" />
                <Field id="suStore" label="Store name (optional)" autoComplete="organization" />
                <Field id="suEmail" label="Email" type="email" required autoComplete="email" />
                <Field id="suPassword" label="Password" type="password" required autoComplete="new-password" />
              </div>
              <button type="submit" disabled={signupStatus.kind === "busy"} className="btn-solid mt-5 disabled:opacity-60">
                {signupStatus.kind === "busy" ? "Creating account…" : "Create account"}
              </button>
              <StatusLine status={signupStatus} />
            </form>
          </motion.div>

          {/* wholesale registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sheen-edge card rounded-panel p-7 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="h-display text-[20px]">Register for wholesale pricing</h3>
                <p className="mt-1.5 max-w-[46ch] text-[13px] text-muted">
                  Add your resale certificate to unlock tax-exempt case pricing and net terms.
                </p>
              </div>
              <span className="whitespace-nowrap rounded-full border border-rule px-2.5 py-1.5 font-mono text-[10px] tracking-[0.06em] text-ok">
                USUALLY VERIFIED IN 1 BUSINESS DAY
              </span>
            </div>
            <form onSubmit={onWholesale} className="mt-6">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="bizName" label="Business name" required autoComplete="organization" />
                <Field id="bizPhone" label="Business phone" type="tel" required autoComplete="tel" />
                <Field id="bizAddress" label="Business address" required autoComplete="street-address" />
                <Field id="taxId" label="Tax ID / EIN" required placeholder="XX-XXXXXXX" />
                <div className="flex flex-col items-center gap-2 rounded-[7px] border border-dashed border-rule px-3 py-4 text-center text-[12px] text-muted sm:col-span-2">
                  <UploadCloud size={18} className="text-accent" />
                  <span>
                    <b className="font-medium text-ink">Upload resale certificate</b> — and retail/tobacco licence if
                    applicable (PDF, JPG or PNG)
                  </span>
                  <input id="certUpload" name="certUpload" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="mt-1 w-full text-[11px]" />
                </div>
              </div>
              <button type="submit" disabled={wholesaleStatus.kind === "busy"} className="btn-solid mt-5 disabled:opacity-60">
                {wholesaleStatus.kind === "busy" ? "Submitting…" : "Submit for review"}
              </button>
              <StatusLine status={wholesaleStatus} />
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-ok" />
                No Tax ID yet? Send an enquiry on WhatsApp and the team will quote you directly.
              </div>
              <a href="https://wa.me/10000000000" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle size={14} />
                Message on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
