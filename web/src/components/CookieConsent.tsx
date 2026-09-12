import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

const STORAGE_KEY = "sw-cookie-consent"

function alreadyConsented() {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return false
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !alreadyConsented())

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // no persistence available — banner just won't be remembered this session
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-surf/95 backdrop-blur"
        >
          <div className="container-px flex flex-wrap items-center justify-between gap-4 py-4">
            <p className="max-w-[60ch] text-[12px] text-muted">
              We use cookies to keep you signed in, remember your theme, and see which pages are useful. Continuing
              to browse means you're okay with that.{" "}
              <a href="#faq" className="text-ink underline underline-offset-2">
                Read more
              </a>
            </p>
            <button type="button" onClick={dismiss} className="btn-solid flex-none">
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
