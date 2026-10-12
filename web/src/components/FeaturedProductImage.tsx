import { ImageOff } from "lucide-react"
import { useState } from "react"

type Props = {
  image: string
  name: string
  hue: number
  label: string
  large?: boolean
}

export function FeaturedProductImage({ image, name, hue, label, large = false }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative isolate overflow-hidden border-b border-rule bg-white ${large ? "h-64 sm:h-72" : "h-56"}`}
      style={{ backgroundImage: `radial-gradient(ellipse at top right, hsl(${hue} 70% 96%), transparent 65%)` }}
    >
      <span className="absolute left-3 top-3 z-10 rounded-full border border-black/5 bg-white/95 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600 shadow-sm">
        {label}
      </span>
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400" role="img" aria-label={`${name}: image unavailable`}>
          <ImageOff size={28} />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}${image}`}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain px-6 pb-5 pt-12 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
      )}
    </div>
  )
}
