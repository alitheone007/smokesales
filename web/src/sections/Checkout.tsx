import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, CreditCard, Loader2, QrCode } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
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

export function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const [method, setMethod] = useState<Method>("mock_card")
  const [stage, setStage] = useState<Stage>("summary")
  const [errorMsg, setErrorMsg] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
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
    setTimeout(() => markPaid(id), 1200)
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
            Your cart is empty. <a href="#hot" className="text-accent underline underline-offset-2">Browse products</a> to add
            something first.
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

        <div className="card rounded-panel p-7 md:p-8">
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
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

                <div className="mb-6 divide-y divide-rule border-y border-rule">
                  {lines.map((l) => (
                    <div key={l.id} className="flex justify-between py-3 text-[13px]">
                      <span className="text-ink">
                        {l.name} <span className="text-muted">× {l.qty}</span>
                      </span>
                      <span className="font-mono text-ink">${(l.price * l.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 text-[14px] font-medium">
                    <span className="text-ink">Total</span>
                    <span className="font-mono text-accent">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("mock_card")}
                    className={`flex items-center justify-center gap-2 rounded-[7px] border py-3 text-[13px] transition-colors ${
                      method === "mock_card" ? "border-accent text-accent" : "border-rule text-muted"
                    }`}
                  >
                    <CreditCard size={15} /> Card (test)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("qr_test")}
                    className={`flex items-center justify-center gap-2 rounded-[7px] border py-3 text-[13px] transition-colors ${
                      method === "qr_test" ? "border-accent text-accent" : "border-rule text-muted"
                    }`}
                  >
                    <QrCode size={15} /> QR pay (test)
                  </button>
                </div>

                {method === "mock_card" ? (
                  <div className="flex flex-col gap-3">
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number (any valid-format test number)"
                      inputMode="numeric"
                      className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="MM/YY"
                        className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
                      />
                      <input
                        placeholder="CVC"
                        inputMode="numeric"
                        className="rounded-[7px] border border-rule bg-canvas px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
                      />
                    </div>
                    <button type="button" onClick={payWithMockCard} className="btn-solid mt-2">
                      Pay ${subtotal.toFixed(2)} (test)
                    </button>
                    <p className="text-center text-[11px] text-muted">
                      No card is charged. This validates card-number format only, for demo purposes.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <button type="button" onClick={payWithQr} className="btn-solid w-full">
                      Generate test payment QR
                    </button>
                    <p className="text-center text-[11px] text-muted">
                      Generates a QR code for this order. Nothing is actually charged.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {stage === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-10">
                <Loader2 size={22} className="animate-spin text-accent" />
                <p className="text-[13px] text-muted">Processing test payment…</p>
              </motion.div>
            )}

            {stage === "waiting_scan" && qrDataUrl && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-4">
                <img src={qrDataUrl} alt="Test payment QR code" width={220} height={220} className="rounded-card border border-rule" />
                <p className="max-w-[38ch] text-center text-[12px] text-muted">
                  Order #{orderId?.slice(0, 8)} · ${subtotal.toFixed(2)} · test mode, no real funds move.
                </p>
                <button type="button" onClick={() => orderId && markPaid(orderId)} className="btn-solid">
                  Simulate scan &amp; confirm payment
                </button>
              </motion.div>
            )}

            {stage === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <CheckCircle2 size={32} className="text-ok" />
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
        </div>
      </div>
    </section>
  )
}
