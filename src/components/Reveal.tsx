import { useEffect, useRef, useState } from "react"
import { to, clamp } from "../lib/ui"

export default function Reveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const text =
  "Great ideas deserve thoughtful execution. I turn complex problems into intuitive digital experiences, combining purposeful design, solid engineering, and a mindset focused on building things that matter."
  const words = text.split(" ")
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setProgress(
        clamp(
          (-r.top + window.innerHeight * 0.25) /
            (total + window.innerHeight * 0.25),
        ),
      )
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const lit = Math.floor(progress * (words.length + 1))
  return (
    <div
      ref={ref}
      className="relative mt-[40px]"
      style={{ height: "calc(100vh + 400px)" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <p className="mx-auto max-w-[1040px] px-6 text-center text-[44px] font-medium leading-[1.25] tracking-[-0.04em] max-[810px]:text-[28px]">
          {words.map((w, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                marginRight: "0.25em",
                color: i < lit ? "#111111" : "rgba(0,0,0,0.1)",
                transition: "color .3s linear",
              }}
            >
              {w}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
