import { motion } from "framer-motion"
import { MessageCircle, UploadCloud } from "lucide-react"
import { type FormEvent, useState } from "react"

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

function useFormNote() {
  const [note, setNote] = useState<string | null>(null)
  const submit = (message: string) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNote(message)
    e.currentTarget.reset()
  }
  return { note, submit }
}

export function GetStarted() {
  const signup = useFormNote()
  const wholesale = useFormNote()

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
            <form onSubmit={signup.submit("Account created — you can browse and check out right away.")} className="mt-6">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="suName" label="Full name" required autoComplete="name" />
                <Field id="suStore" label="Store name (optional)" autoComplete="organization" />
                <Field id="suEmail" label="Email" type="email" required autoComplete="email" />
                <Field id="suPassword" label="Password" type="password" required autoComplete="new-password" />
              </div>
              <button type="submit" className="btn-solid mt-5">
                Create account
              </button>
              {signup.note && <p className="mt-3.5 max-w-[60ch] text-[12px] text-ok">{signup.note}</p>}
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
            <form
              onSubmit={wholesale.submit(
                "Thanks — your resale certificate has been queued for review. Tax-exempt pricing unlocks within one business day.",
              )}
              className="mt-6"
            >
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
              <button type="submit" className="btn-solid mt-5">
                Submit for review
              </button>
              {wholesale.note && <p className="mt-3.5 max-w-[60ch] text-[12px] text-ok">{wholesale.note}</p>}
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-ok" />
                No Tax ID yet? Send an enquiry on WhatsApp and the team will quote you directly.
              </div>
              <a
                href="https://wa.me/10000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
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
