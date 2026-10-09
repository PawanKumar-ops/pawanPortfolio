import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  IMG,
  wrap,
  BlurText,
  FadeUp,
  clamp,
  lerp,
  smooth,
  easeInOut,
  ArrowLink,
} from "../lib/ui"
import { setScrollSpeed } from "../lib/smoothScroll"

/** Words blur + slide in when scrolled into view */

/** Draggable decorative shape that springs back on release */
function Draggable({
  children,
  className = "",
  rotate = 0,
  style,
}: {
  children: ReactNode
  className?: string
  rotate?: number
  style?: CSSProperties
}) {
  const [off, setOff] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState(false)
  const start = useRef({ x: 0, y: 0 })
  return (
    <div
      className={`absolute z-20 cursor-grab select-none touch-none active:cursor-grabbing ${className}`}
      style={{
        ...style,
        transform: `translate(${off.x}px, ${off.y}px) rotate(${rotate}deg) scale(${drag ? 1.06 : 1
          })`,
        transition: drag
          ? "transform .08s linear"
          : "transform .7s cubic-bezier(.34,1.56,.64,1)",
      }}
      onPointerDown={(e) => {
        ; (e.target as Element).setPointerCapture(e.pointerId)
        start.current = { x: e.clientX, y: e.clientY }
        setDrag(true)
      }}
      onPointerMove={(e) => {
        if (!drag) return
        setOff({
          x: e.clientX - start.current.x,
          y: e.clientY - start.current.y,
        })
      }}
      onPointerUp={() => {
        setDrag(false)
        setOff({ x: 0, y: 0 })
      }}
    >
      {children}
    </div>
  )
}

function Sparkle() {
  const d =
    "M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0Z"
  return (
    <svg viewBox="-6 -6 116 116" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="irid1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b6bff" />
          <stop offset=".45" stopColor="#d9d5e8" />
          <stop offset=".7" stopColor="#7a52f0" />
          <stop offset="1" stopColor="#c9c9d6" />
        </linearGradient>
      </defs>
      <path d={d} fill="url(#irid1)" transform="translate(5 4)" />
      <path d={d} fill="#111" />
    </svg>
  )
}

function Bolt() {
  const d = "M62 0 L8 62 L44 62 L30 120 L92 50 L54 50 L62 0Z"
  return (
    <svg viewBox="-6 -6 112 136" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="irid2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a52f0" />
          <stop offset=".4" stopColor="#a68bff" />
          <stop offset=".65" stopColor="#e7e4ef" />
          <stop offset="1" stopColor="#8b8b99" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="url(#irid2)"
        strokeLinejoin="round"
        stroke="url(#irid2)"
        strokeWidth="6"
        transform="translate(-5 4)"
      />
      <path
        d={d}
        fill="#111"
        strokeLinejoin="round"
        stroke="#111"
        strokeWidth="6"
      />
    </svg>
  )
}

/* ---------- Hero + About with travelling portrait ---------- */

export default function HeroAbout() {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const root = rootRef.current
      const hero = heroRef.current
      const target = targetRef.current
      const card = cardRef.current
      if (!root || !hero || !target || !card) return
      const rootTop = root.getBoundingClientRect().top + window.scrollY
      const heroH = hero.offsetHeight
      const tRect = target.getBoundingClientRect()
      const tTop = tRect.top + window.scrollY - rootTop
      const tW = tRect.width
      const tH = tRect.height
      const rootW = root.offsetWidth

      // small card in hero: 250x285, bottom 37px above hero bottom
      const sW = Math.min(250, tW / 2)
      const sH = sW * 1.14
      const sCx = rootW / 2
      const sCy = heroH - 37 - sH / 2
      const eCx = tRect.left + tW / 2 - root.getBoundingClientRect().left
      const eCy = tTop + tH / 2

      const endScroll = Math.max(1, tTop + rootTop - 51)
      const p = clamp(window.scrollY / endScroll)
      const e = easeInOut(p)

      const cx = lerp(sCx, eCx, e)
      const cy = lerp(sCy, eCy, e)
      const scale = lerp(sW / tW, 1, e)
      // Spread the flip over most of the journey so it turns gradually
      const flip = 180 * smooth(0.18, 0.88, p)
      // Scroll ~45% slower while the portrait travels/flips, easing back to normal as it lands
      setScrollSpeed(lerp(0.55, 1, smooth(0.9, 1, p)))
      const tilt = Math.sin(p * Math.PI) * 10

      card.style.width = `${tW}px`
      card.style.height = `${tH}px`
      card.style.transform = `translate3d(${cx - tW / 2}px, ${cy - tH / 2}px, 0) scale(${scale}) perspective(1200px) rotateX(${tilt * 0.4}deg) rotateY(${flip}deg) rotateZ(${-tilt * 0.3}deg)`
    }
    const loop = () => {
      update()
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      setScrollSpeed(1)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const titleLine = (txt: string, d: number) => (
    <span className="block overflow-hidden pb-[0.04em]">
      <span
        className="block"
        style={{
          transform: loaded ? "none" : "translateY(105%)",
          transition: `transform 1.2s cubic-bezier(.22,1,.36,1) ${d}s`,
        }}
      >
        {txt}
      </span>
    </span>
  )

  return (
    <div ref={rootRef} className="relative" id="home">

      {/* Travelling portrait card */}
      <div
        ref={cardRef}
        className="pointer-events-none absolute left-0 top-0 z-10 origin-center"
        style={{
          transformStyle: "preserve-3d",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s .5s",
        }}
      >
        {/* FRONT: Black and white */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-[20px] bg-neutral-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={IMG.portrait}
            alt="Portrait of Pawan"
            className="h-full w-full object-cover"
            style={{
              objectPosition: "50% 20%",
              filter: "grayscale(1) brightness(0.85) contrast(1.08)",
            }}
          />
        </div>

        {/* BACK: Original photo in natural colors */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-[20px] bg-neutral-100"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={IMG.portrait}
            alt=""
            className="h-full w-full object-cover"
            style={{
              objectPosition: "50% 20%",
              filter: "none",
            }}
          />
        </div>
      </div>


      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen"
        style={{ minHeight: "max(560px, calc(922 * var(--u)))" }}
      >
        <div className={`${wrap} relative h-full`}>
          <h1
            className="relative text-center font-bold uppercase leading-[0.9] tracking-[-0.02em] text-ink"
            style={{
              fontSize: "calc(218 * var(--u))",
              paddingTop: "max(150px, calc(262 * var(--u)))",
            }}
          >
            {titleLine("Fullstack", 0.1)}
            {titleLine("Developer", 0.22)}
          </h1>

          <Draggable
            className="left-0"
            style={{
              top: "max(130px, calc(210 * var(--u)))",
              width: "calc(128 * var(--u))",
              height: "calc(128 * var(--u))",
            }}
            rotate={16}
          >
            <div
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "scale(.4) rotate(-60deg)",
                transition: "all 1.2s cubic-bezier(.34,1.56,.64,1) .6s",
              }}
            >
              <Sparkle />
            </div>
          </Draggable>
          <Draggable
            style={{
              right: "calc(10 * var(--u))",
              top: "calc(max(150px, calc(262 * var(--u))) + 350 * var(--u))",
              width: "calc(80 * var(--u))",
              height: "calc(120 * var(--u))",
            }}
            rotate={0}
          >
            <div
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "scale(.4) rotate(40deg)",
                transition: "all 1.2s cubic-bezier(.34,1.56,.64,1) .75s",
              }}
            >
              <Bolt />
            </div>
          </Draggable>

          <div
            className="absolute inset-x-0 flex items-end justify-between"
            style={{ bottom: "calc(30 * var(--u))" }}
          >
            <h2
              className="font-semibold leading-none tracking-[-0.04em]"
              style={{
                fontSize: "max(36px, calc(86 * var(--u)))",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "translateY(30px)",
                transition: "all 1s cubic-bezier(.22,1,.36,1) .5s",
              }}
            >
              ©2026
            </h2>
            <p
              className="leading-none tracking-[-0.05em]"
              style={{
                fontSize: "max(12px, calc(20 * var(--u)))",
                paddingBottom: "calc(12 * var(--u))",
                opacity: loaded ? 1 : 0,
                transition: "opacity 1s .7s",
              }}
            >
              /CREATING SINCE 2025
            </p>
          </div>
        </div>
      </section>







      {/* About */}
      <section
        id="aboutme"
        className="relative"
        style={{ paddingTop: "calc(264 * var(--u))" }}
      >
        <div
          className={`${wrap} grid grid-cols-[1fr_auto_1fr] max-[900px]:grid-cols-1`}
          style={{ columnGap: "calc(38 * var(--u))" }}
        >
          {/* Left: heading top, intro bottom */}
          <div className="flex flex-col justify-between max-[900px]:gap-8">
            <BlurText
              text="Hey!"
              className="font-semibold leading-[1.1] tracking-[-0.04em]"
              style={{
                fontSize: "max(56px, calc(100 * var(--u)))",
                marginTop: "calc(-14 * var(--u))",
              }}
            />
            <FadeUp className="max-[900px]:order-last max-[900px]:mt-10">
              <p
                className="max-w-[13.75em] font-medium leading-[1.62] tracking-[-0.05em]"
                style={{ fontSize: "max(17px, calc(24 * var(--u)))" }}
              >
                I’m a developer and student at NIT Kurukshetra, passionate about turning ideas into meaningful digital products.
              </p>
            </FadeUp>
          </div>

          {/* Center: landing spot for the travelling portrait */}
          <div
            ref={targetRef}
            className="max-[900px]:mx-auto max-[900px]:mt-8 max-[900px]:!h-[min(570px,100vw)] max-[900px]:!w-[min(500px,88vw)]"
            style={{
              width: "calc(500 * var(--u))",
              height: "calc(570 * var(--u))",
            }}
          />

          {/* Right: bio, bottom aligned */}
          <div className="flex items-end justify-end max-[900px]:mt-10 max-[900px]:justify-start">
            <FadeUp delay={0.1}>
              <div
                className="w-[22.5em] max-w-full"
                style={{ fontSize: "max(15px, calc(20 * var(--u)))" }}
              >
                <p className="leading-[1.58] tracking-[-0.05em]">
                  I'm a full-stack developer who enjoys building modern web applications, solving problems, and exploring how technology can make everyday experiences better.
                </p>
                <p className="mt-[1.25em] leading-[1.58] tracking-[-0.05em]">
                  From developing SaaS products to creating web applications and management tools, I focus on turning ideas into practical solutions through thoughtful design, clean code, and reliable technology.
                </p>
                <div className="mt-[0.7em] -mb-[2px]">
                  <ArrowLink label="Get Started" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  )
}
