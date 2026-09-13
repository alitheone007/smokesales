import { AnimatePresence, motion } from "framer-motion"
import { CreditCard, Loader2, QrCode } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import { GlowCard } from "../components/GlowCard"
import { useCart } from "../lib/cart"
import { supabase } from "../lib/supabase"

type Method = "mock_card" | "qr_test"
type Stage = "summary" | "processing" | "waiting_scan" | "done" | "signed_out" | "error"

function luhnValid(digits: string) {
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return digits.length >= 12 && sum % 10 === 0
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 19)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

const STEPS = ["Review", "Pay", "Done"] as const

function stageToStep(stage: Stage): number {
  if (stage === "done") return 2
  if (stage === "processing" || stage === "waiting_scan") return 1
  return 0
}

function Stepper({ stage }: { stage: Stage }) {
  const active = stageToStep(stage)
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{
                backgroundColor: i <= active ? "var(--color-accent)" : "var(--color-surf)",
                borderColor: i <= active ? "var(--color-accent)" : "var(--color-rule)",
                scale: i === active ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px]"
              style={{ color: i <= active ? "var(--color-accenton)" : "var(--color-muted)" }}
            >
              {i + 1}
            </motion.div>
            <span className={`text-[10px] ${i <= active ? "text-ink" : "text-muted"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="relative mx-2 h-px flex-1 bg-rule">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                initial={false}
                animate={{ width: i < active ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CardPreview({ number, expiry }: { number: string; expiry: string }) {
  const digits = number.replace(/\s/g, "").padEnd(16, "•").slice(0, 16)
  const grouped = digits.match(/.{1,4}/g)?.join("  ") ?? ""

  return (
    <motion.div
      initial={{ rotateX: -8, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative mb-1 aspect-[1.586/1] w-full max-w-[300px] overflow-hidden rounded-2xl p-5 text-accenton"
      style={{
        background: "linear-gradient(135deg, var(--color-sheen-a), var(--color-accent) 55%, var(--color-ok))",
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
    >
      <div className="absolute inset-0 opacity-[0.15]" style={{ background: "radial-gradient(120% 80% at 10% 0%, #fff, transparent 60%)" }} />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.14em] opacity-80">TEST CARD — NOT REAL</span>
        <CreditCard size={18} className="opacity-80" />
      </div>
      <div className="mt-7 font-mono text-[16px] tracking-[0.12em]">{grouped}</div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-[10px] opacity-80">TEST USER</span>
        <span className="font-mono text-[12px] opacity-90">{expiry || "MM/YY"}</span>
      </div>
    </motion.div>
  )
}

function AnimatedCheck() {
  return (
    <svg viewBox="0 0 52 52" className="h-14 w-14">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-ok)"
        strokeWidth={2.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M15 27l7 7 15-15"
        fill="none"
        stroke="var(--color-ok)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
      />
    </svg>
  )
}

export function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const [method, setMethod] = useState<Method>("mock_card")
  const [stage, setStage] = useState<Stage>("summary")
  const [errorMsg, setErrorMsg] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)))
  }, [])

  async function createOrder(paymentMethod: Method) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setStage("signed_out")
      return null
    }
    const { data, error } = await supabase
      .from("smoke_wholesale_orders")
      .insert({
        user_id: user.id,
        items: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })),
        subtotal,
        payment_method: paymentMethod,
      })
      .select("id")
      .single()

    if (error) {
      setErrorMsg(error.message)
      setStage("error")
      return null
    }
    return data.id as string
  }

  async function markPaid(id: string) {
    const { error } = await supabase
      .from("smoke_wholesale_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id)
    if (error) {
      setErrorMsg(error.message)
      setStage("error")
      return
    }
    setStage("done")
    clear()
  }

  async function payWithMockCard() {
    if (!luhnValid(cardNumber.replace(/\s/g, ""))) {
      setErrorMsg("That card number doesn't look right — this is test mode, but it still checks the format.")
      setStage("error")
      return
    }
    setStage("processing")
    const id = await createOrder("mock_card")
    if (!id) return
    setOrderId(id)
    setTimeout(() => markPaid(id), 1300)
  }

  async function payWithQr() {
    setStage("processing")
    const id = await createOrder("qr_test")
    if (!id) return
    setOrderId(id)
    const payload = `SMOKEWHOLESALE-TEST-PAY:${id}:${subtotal.toFixed(2)}:NO-REAL-FUNDS`
    const url = await QRCode.toDataURL(payload, { margin: 1, width: 220 })
    setQrDataUrl(url)
    setStage("waiting_scan")
  }

  if (lines.length === 0 && stage === "summary") {
    return (
      <section id="checkout" className="py-14 md:py-20">
        <div className="container-px">
          <p className="text-[13px] text-muted">
            Your cart is empty.{" "}
            <a href="#hot" className="text-accent underline underline-offset-2">
              Browse products
            </a>{" "}
            to add something first.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="checkout" className="py-14 md:py-20">
      <div className="container-px max-w-[640px]">
        <div className="mb-8">
          <span className="eyebrow">Test mode — no real payment</span>
          <h2 className="h-display mt-2 text-[24px]">Checkout</h2>
        </div>

        <GlowCard radius={320} className="card block rounded-panel p-7 md:p-8">
          <Stepper stage={stage} />

          <AnimatePresence mode="wait">
            {stage === "signed_out" && (
              <motion.div key="signed-out" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[13px] text-ink">
                  You'll need a free account to check out.{" "}
                  <a href="#get-started" className="text-accent underline underline-offset-2">
                    Create one
                  </a>{" "}
                  and come back to this cart.
                </p>
              </motion.div>
            )}

            {stage === "error" && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[13px] text-warn">{errorMsg}</p>
                <button type="button" onClick={() => setStage("summary")} className="btn-ghost mt-4">
                  Back to checkout
                </button>
              </motion.div>
            )}

            {stage === "summary" && signedIn !== null && (
              <motion.div key="summary" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {signedIn === false && (
                  <div className="notice mb-5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none stroke-accent" fill="none" strokeWidth={1.8}>
                      <path d="M12 9v4" />
                      <path d="M12 16h.01" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    <p>
                      You're browsing signed out. You can pick a payment method now, but you'll need to{" "}
                      <a href="#get-started" className="underline underline-offset-2">
                        create a free account
                      </a>{" "}
                      before the order goes through.
                    </p>
                  </div>
                )}

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                  className="mb-6 divide-y divide-rule border-y border-rule"
                >
                  {lines.map((l) => (
                    <motion.div
                      key={l.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                      className="flex justify-between py-3 text-[13px]"
                    >
                      <span className="text-ink">
                        {l.name} <span className="text-muted">× {l.qty}</span>
                      </span>
                      <span className="font-mono text-ink">${(l.price * l.qty).toFixed(2)}</span>
                    </motion.div>
                  ))}
                  <div className="flex items-baseline justify-between py-3">
                    <span className="text-[14px] font-medium text-ink">Total</span>
                    <span className="font-mono text-[20px] font-semibold text-accent">${subtotal.toFixed(2)}</span>
                  </div>
                </motion.div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setMethod("mock_card")}
                    className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-[7px] border py-3 text-[13px] transition-colors ${
                      method === "mock_card" ? "border-accent text-accent" : "border-rule text-muted"
                    }`}
                  >
                    {method === "mock_card" && (
                      <motion.span layoutId="method-glow" className="absolute inset-0 bg-accenton" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                    )}
                    <span className="relative flex items-center gap-2">
                      <CreditCard size={15} /> Card (test)
                    </span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setMethod("qr_test")}
                    className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-[7px] border py-3 text-[13px] transition-colors ${
                      method === "qr_test" ? "border-accent text-accent" : "border-rule text-muted"
                    }`}
                  >
                    {method === "qr_test" && (
                      <motion.span layoutId="method-glow" className="absolute inset-0 bg-accenton" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                    )}
                    <span className="relative flex items-center gap-2">
                      <QrCode size={15} /> QR pay (test)
                    </span>
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {method === "mock_card" ? (
                    <motion.div
                      key="card-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <CardPreview number={cardNumber} expiry={expiry} />
                      <div className="flex w-full flex-col gap-3">
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="Card number (any valid-format test number)"
                          inputMode="numeric"
                          className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 font-mono text-[13px] text-ink outline-none focus:border-accent"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 font-mono text-[13px] text-ink outline-none focus:border-accent"
                          />
                          <input
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="CVC"
                            inputMode="numeric"
                            className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 font-mono text-[13px] text-ink outline-none focus:border-accent"
                          />
                        </div>
                        <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={payWithMockCard} className="btn-solid mt-1">
                          Pay ${subtotal.toFixed(2)} (test)
                        </motion.button>
                        <p className="text-center text-[11px] text-muted">
                          No card is charged. This validates card-number format only, for demo purposes.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={payWithQr} className="btn-solid w-full">
                        Generate test payment QR
                      </motion.button>
                      <p className="text-center text-[11px] text-muted">
                        Generates a QR code for this order. Nothing is actually charged.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {stage === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-14">
                <Loader2 size={24} className="animate-spin text-accent" />
                <p className="text-[13px] text-muted">Processing test payment…</p>
              </motion.div>
            )}

            {stage === "waiting_scan" && qrDataUrl && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5 py-4">
                <div className="relative p-3">
                  {/* scanner-style corner brackets */}
                  {[
                    "left-0 top-0 border-l-2 border-t-2 rounded-tl-lg",
                    "right-0 top-0 border-r-2 border-t-2 rounded-tr-lg",
                    "left-0 bottom-0 border-l-2 border-b-2 rounded-bl-lg",
                    "right-0 bottom-0 border-r-2 border-b-2 rounded-br-lg",
                  ].map((pos) => (
                    <span key={pos} className={`absolute h-6 w-6 border-accent ${pos}`} />
                  ))}
                  <motion.div
                    className="absolute inset-3 rounded-card border border-ok/40"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <img src={qrDataUrl} alt="Test payment QR code" width={220} height={220} className="relative rounded-card" />
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted">
                  <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
                  Waiting for test scan…
                </div>
                <p className="max-w-[38ch] text-center text-[12px] text-muted">
                  Order #{orderId?.slice(0, 8)} · ${subtotal.toFixed(2)} · test mode, no real funds move.
                </p>
                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => orderId && markPaid(orderId)} className="btn-solid">
                  Simulate scan &amp; confirm payment
                </motion.button>
              </motion.div>
            )}

            {stage === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <AnimatedCheck />
                <h3 className="h-display text-[18px]">Order confirmed</h3>
                <p className="max-w-[38ch] text-[13px] text-muted">
                  Order #{orderId?.slice(0, 8)} is marked paid in test mode. In production this is the point a real
                  order would enter fulfillment.
                </p>
                <a href="#hot" className="btn-ghost mt-2">
                  Continue browsing
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      </div>
    </section>
  )
}
