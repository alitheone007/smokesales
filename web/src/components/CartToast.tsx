import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "../lib/toast"

export function CartToast() {
  const { message } = useToast()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-7 z-[60] flex justify-center">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-ink px-5 py-2.5 text-[12px] text-canvas shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
