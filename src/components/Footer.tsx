import { useEffect, useRef, useState } from "react"
import { to, wrap, BlurText, clamp, lerp, smooth, Roll } from "../lib/ui"

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(clamp((window.innerHeight - r.top) / r.height))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <footer
      ref={ref}
      className="relative mt-[150px] h-[782px] overflow-hidden bg-ink text-cream max-[900px]:h-auto max-[900px]:pb-[40vw]"
    >
      <div
        className={`${wrap} flex pt-[150px] max-[900px]:flex-col max-[900px]:gap-12`}
      >
        <BlurText
          text={"Ideas Into\nDigital\nReality."}
          className="w-[575px] max-[900px]:w-full max-[900px]:max-w-full text-[80px] font-semibold leading-[1.05] tracking-[-0.04em] max-[810px]:text-[56px]"
        />
        <div className="w-[525px] max-[900px]:w-full max-[900px]:max-w-full pt-[82px] max-[900px]:pt-0">
          <h4 className="text-[32px] font-medium tracking-[-0.04em]">
            /Quick links
          </h4>
          <div className="mt-[14px] flex max-w-[380px] flex-wrap gap-[12px]">
            {["Home", "About Me", "Services", "Works", "Contact"].map((l) => (
              <a
                key={l}
                href={to(`/#${l.toLowerCase().replace(" ", "")}`)}
                className="roll-host flex h-[43px] items-center rounded-[8px] bg-cream px-[20px] text-[18px] tracking-[-0.04em] text-ink"
              >
                <Roll text={l} />
              </a>
            ))}
          </div>
        </div>
        <div className="pt-[82px] max-[900px]:pt-0">
          <h4 className="text-[32px] font-medium tracking-[-0.04em]">
            /Contact
          </h4>
          <a
            href="mailto:Mejed@Templyo.io"
            className="roll-host mt-[18px] block text-[22px] tracking-[-0.05em]"
          >
            <Roll text="pawankumarr16108@gmail.com" />
          </a>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 select-none whitespace-nowrap font-bold leading-[0.9] tracking-[-0.02em] text-cream/[0.06]"
        style={{
          fontSize: "clamp(160px, 26.4vw, 560px)",
          transform: `translateX(-50%) translateY(${lerp(75, 30, smooth(0, 1, p))}%)`,
        }}
      >
        Pawan
      </p>
    </footer>
  )
}
