import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../lib/theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative flex h-9 w-16 items-center rounded-full border border-rule bg-canvas px-1"
    >
      <motion.span
        className="absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accenton"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
      <Sun size={13} className="ml-1 text-muted" />
      <Moon size={13} className="ml-auto mr-1.5 text-muted" />
    </button>
  )
}
