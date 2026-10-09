import { useEffect, useRef, useState, type CSSProperties } from "react"
import type { ReactNode } from "react"

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`

export const IMG = {
  portrait: "/portrait/pawan.png",
  streaks: U("photo-1550275994-2bc88dc68637"),
  hoodie: U("photo-1552337557-45792b252a2e", 900),
  purple: U("photo-1614851099511-773084f6911d"),
  gradient: U("photo-1579546929662-711aa81148cf"),
  city: U("photo-1606454277702-91f9c92257cc"),
  glass: U("photo-1496307653780-42ee777d4833"),
  field: U("photo-1724328226990-6ea7e660237f"),
  dunes: U("photo-1545431766-45ff67845191"),
  train: U("photo-1677095030827-950e69f0545a"),
  a1: U("photo-1587397845856-e6cf49176c70", 200),
  a2: U("photo-1624395213043-fa2e123b2656", 200),
  a3: U("photo-1535713875002-d1d0cf377fde", 200),
  a4: U("photo-1590086782957-93c06ef21604", 200),
}

// Respect the deploy base path when building in-app links
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "")
export const to = (path: string) => `${BASE}${path}`

// Original keeps ~11.25% side margins (1475px content at a 1903px viewport)
export const wrap =
  "mx-auto w-[min(1475px,77.5%)] max-[810px]:w-[calc(100%-40px)]"

export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

export function BlurText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  style,
}: {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p"
  delay?: number
  style?: CSSProperties
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.3)
  const lines = text.split("\n")
  let n = 0
  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => {
            const i = n++
            return (
              <span
                key={wi}
                className="inline-block will-change-transform"
                style={{
                  marginRight: wi < line.split(" ").length - 1 ? "0.25em" : 0,
                  opacity: inView ? 1 : 0,
                  filter: inView ? "blur(0px)" : "blur(10px)",
                  transform: inView ? "none" : "translateY(30px)",
                  transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${delay + i * 0.08}s, filter .8s cubic-bezier(.22,1,.36,1) ${delay + i * 0.08}s, transform .8s cubic-bezier(.22,1,.36,1) ${delay + i * 0.08}s`,
                }}
              >
                {w}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px)",
        filter: inView ? "blur(0px)" : "blur(6px)",
        transition: `all 1s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}
export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

export function Roll({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  return (
    <span className={`roll ${className}`} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden style={{ transitionDelay: `${i * 0.018}s` }}>
          {c === " " ? "\u00a0" : c}
        </span>
      ))}
    </span>
  )
}

export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M4 12L12 4M12 4H5.5M12 4V10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowLink({
  label,
  dark = false,
  href = "#",
}: {
  label: string
  dark?: boolean
  href?: string
}) {
  return (
    <a
      href={href}
      className="roll-host inline-flex items-center gap-[14px] text-[20px] leading-[1.2] tracking-[-0.04em]"
    >
      <Roll text={label} />
      <span
        className={`arrow-box flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border ${
          dark ? "border-cream/80" : "border-ink"
        }`}
      >
        <Arrow />
      </span>
    </a>
  )
}
