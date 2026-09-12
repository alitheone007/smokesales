import type { ReactNode } from "react"

export function AgeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] tracking-[0.08em] text-accent border border-rule rounded-full px-2 py-0.5 whitespace-nowrap ${className}`}
    >
      21+
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.1em] text-ok border border-rule rounded-full px-2 py-1">
      {children}
    </span>
  )
}
