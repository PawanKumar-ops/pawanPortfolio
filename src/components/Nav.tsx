import { useEffect, useRef, useState, type FormEvent } from "react"
import { to, Roll, Arrow } from "../lib/ui"
import { askAI, suggestions, type ChatLink } from "./chat/ai"
import { setScrollLocked } from "../lib/smoothScroll"
import { Icon } from "@iconify/react";

type Msg = { id: number; role: "user" | "ai"; text: string; links?: ChatLink[] }

const EASE = "cubic-bezier(.65,0,.35,1)"
const links = ["Home", "About Me", "Services", "Works", "Contact"]

// [blur px, mask start %, mask full %] — each layer fades in lower down the screen
const BLUR_LAYERS: [number, number, number][] = [
  [1, 0, 18],
  [3, 10, 32],
  [6, 22, 48],
  [12, 36, 64],
  [22, 50, 80],
  [36, 64, 96],
]

/** Reveals AI text progressively, like a streamed response */
function TypeText({ text, onTick, onDone }: { text: string; onTick: () => void; onDone: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) {
      onDone()
      return
    }
    const t = setTimeout(() => {
      setN((v) => Math.min(text.length, v + 3))
      onTick()
    }, 16)
    return () => clearTimeout(t)
  }, [n, text, onTick, onDone])
  return <>{text.slice(0, n)}</>
}

function AIBubble({ msg, animate, onTick, close }: { msg: Msg; animate: boolean; onTick: () => void; close: () => void }) {
  const [done, setDone] = useState(!animate)
  return (
    <div className="chat-in flex max-w-[86%] items-end gap-[10px] self-start max-[640px]:max-w-[94%] max-[640px]:gap-[8px]">
      <span className="mb-[2px] flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-ink text-cream">
        <Icon
          icon="carbon:ai-observability"
          width={14}
          height={14}
        />
      </span>
      <div>
        <div className="whitespace-pre-line rounded-[20px] rounded-bl-[6px] border border-black/[0.06] bg-white/75 px-[18px] py-[14px] text-[17px] leading-[1.5] tracking-[-0.03em] text-ink max-[640px]:px-[15px] max-[640px]:py-[11px] max-[640px]:text-[15.5px] shadow-[0_10px_40px_-12px_rgba(0,0,0,.18)] backdrop-blur-xl">
          {animate ? <TypeText text={msg.text} onTick={onTick} onDone={() => setDone(true)} /> : msg.text}
        </div>
        {msg.links && (
          <div
            className="mt-[10px] flex flex-wrap gap-[8px]"
            style={{ opacity: done ? 1 : 0, transform: done ? "none" : "translateY(6px)", transition: `all .5s ${EASE}` }}
          >
            {msg.links.map((l) => (
              <a
                key={l.href}
                href={l.href.startsWith("mailto:") ? l.href : to(l.href)}
                onClick={l.href.startsWith("mailto:") ? undefined : close}
                className="roll-host inline-flex h-[38px] items-center gap-[10px] rounded-[10px] bg-ink pl-[14px] pr-[6px] text-[15px] tracking-[-0.03em] text-cream transition-transform duration-300 hover:-translate-y-[2px]"
              >
                <Roll text={l.label} />
                <span className="arrow-box flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-cream text-ink">
                  <Arrow size={12} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([])
  const [thinking, setThinking] = useState(false)
  const [lastAnimated, setLastAnimated] = useState(-1)
  const [nearBottom, setNearBottom] = useState(false)
  // Dock to the bottom (and become the AI input) at the end of the page or while chatting
  const docked = nearBottom || chatOpen || input.length > 0
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const scrollToEnd = useRef(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }).current

  const openChat = () => {
    setMenuOpen(false)
    setChatOpen(true)
  }
  const closeChat = () => {
    setChatOpen(false)
    inputRef.current?.blur()
  }

  // Lock page scroll while the chat layer is showing; Esc closes it
  useEffect(() => {
    const html = document.documentElement
    html.style.overflow = chatOpen ? "hidden" : ""
    setScrollLocked(chatOpen)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat()
    window.addEventListener("keydown", onKey)
    return () => {
      html.style.overflow = ""
      setScrollLocked(false)
      window.removeEventListener("keydown", onKey)
    }
  }, [chatOpen])

  useEffect(() => {
    const check = () => {
      const doc = document.documentElement
      setNearBottom(window.innerHeight + window.scrollY >= doc.scrollHeight - 160)
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  // The links menu flips direction with the bar, so close it on dock changes
  useEffect(() => setMenuOpen(false), [docked])

  useEffect(() => {
    if (chatOpen) requestAnimationFrame(scrollToEnd)
  }, [messages, thinking, chatOpen, scrollToEnd])

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || thinking) return
    openChat()
    setInput("")
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text }])
    setThinking(true)
    const reply = await askAI(text)
    const id = idRef.current++
    setThinking(false)
    setLastAnimated(id)
    setMessages((m) => [...m, { id, role: "ai", ...reply }])
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const hasText = input.trim().length > 0

  return (
    <>
      {/* Progressive blur backdrop: stacked blur layers, each masked to its own band,
          so the blur builds smoothly from clear at the top to frosted at the bottom */}
      <div
        aria-hidden={!chatOpen}
        onClick={closeChat}
        className="fixed inset-0 z-40 overflow-hidden"
        style={{
          pointerEvents: chatOpen ? "auto" : "none",
          opacity: chatOpen ? 1 : 0,
          transition: `opacity .8s ${EASE}`,
        }}
      >
        {BLUR_LAYERS.map(([blur, from, to2], i) => {
          const mask = `linear-gradient(to bottom, transparent ${from}%, #000 ${to2}%)`
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          )
        })}

        {/* Warm tint that thickens toward the input */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,247,243,0) 0%, rgba(250,247,243,.35) 30%, rgba(250,247,243,.72) 62%, rgba(250,247,243,.92) 100%)",
          }}
        />

        {/* Soft ambient glow behind the chat, echoing the iridescent hero shapes */}
        <div
          className="absolute inset-0"
          style={{
            transform: chatOpen ? "none" : "translateY(60px) scale(.9)",
            transition: `transform 1.4s ${EASE}`,
          }}
        >
          <div className="chat-glow absolute bottom-[-18vh] left-1/2 h-[60vh] w-[min(1100px,120vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(122,82,240,.16),rgba(122,82,240,0))]" />
          <div className="chat-glow-alt absolute bottom-[-10vh] left-[38%] h-[42vh] w-[min(700px,90vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,140,90,.10),rgba(255,140,90,0))]" />
        </div>

        {/* Hairline highlight where the frosted area begins + fine grain */}
        <div className="absolute inset-x-0 top-[22%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)] opacity-60" />
        <div className="grain !absolute !z-0 !opacity-[0.05]" />
      </div>

      {/* Chat layer floats on the same plane as the input */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[131px] top-0 z-[45] flex justify-center"
        style={{ opacity: chatOpen ? 1 : 0, transition: `opacity .6s ${EASE}` }}
      >
        <div className="relative flex h-full w-[min(680px,calc(100%-32px))] flex-col max-[640px]:w-[calc(100%-24px)]">
          {/* Header */}
          <div
            className="pointer-events-auto flex items-center justify-between gap-[10px] pb-[8px] pt-[28px] max-[640px]:pt-[max(14px,env(safe-area-inset-top))]"
            style={{
              transform: chatOpen ? "none" : "translateY(-16px)",
              transition: `transform .7s ${EASE}`,
              pointerEvents: chatOpen ? "auto" : "none",
            }}
          >
            <div className="flex min-w-0 items-center gap-[12px] rounded-full border border-black/[0.06] bg-white/60 py-[6px] pl-[6px] pr-[18px] shadow-[0_10px_40px_-14px_rgba(0,0,0,.2)] backdrop-blur-xl max-[640px]:gap-[10px] max-[640px]:py-[5px] max-[640px]:pl-[5px] max-[640px]:pr-[14px]">
              <span className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-ink text-cream max-[640px]:h-[34px] max-[640px]:w-[34px]">
                <Icon
                  icon="carbon:ai-observability"
                  width={16}
                  height={16}
                />
                <span className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full border-2 border-white bg-[#3ccf6e]" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[16px] font-semibold tracking-[-0.04em] max-[640px]:text-[15px]">Ask Pawan</p>
                <p className="truncate text-[13px] tracking-[-0.02em] text-black/50 max-[640px]:text-[12px]">AI assistant · Online</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[8px] max-[640px]:gap-[6px]">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  aria-label="Clear chat"
                  className="flex h-[44px] items-center justify-center rounded-full border border-black/[0.06] bg-white/60 px-[18px] text-[15px] tracking-[-0.03em] text-black/70 backdrop-blur-xl transition-colors hover:bg-white max-[640px]:h-[40px] max-[640px]:w-[40px] max-[640px]:px-0"
                >
                  <span className="max-[640px]:hidden">Clear</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="hidden max-[640px]:block" aria-hidden>
                    <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="group flex h-[44px] items-center justify-center gap-[8px] rounded-full bg-ink pl-[16px] pr-[14px] text-[15px] tracking-[-0.03em] text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,.4)] transition-transform duration-300 hover:scale-[1.03] max-[640px]:h-[40px] max-[640px]:w-[40px] max-[640px]:px-0"
              >
                <span className="max-[640px]:hidden">Exit chat</span>
                <svg width="14" height="14" viewBox="0 0 16 16" className="transition-transform duration-500 group-hover:rotate-90">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            data-lenis-prevent
            className="chat-scroll flex-1 overflow-y-auto overscroll-contain"
            style={{
              pointerEvents: chatOpen ? "auto" : "none",
              maskImage: "linear-gradient(to bottom, transparent 0, #000 40px, #000 calc(100% - 12px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 40px, #000 calc(100% - 12px), transparent 100%)",
            }}
          >
            <div className="flex min-h-full flex-col justify-end gap-[16px] pb-[16px] pt-[64px] max-[640px]:gap-[12px] max-[640px]:pt-[36px]">
              {messages.length === 0 && !thinking ? (
                <div key={chatOpen ? "open" : "closed"} className="chat-in pb-[8px]">
                  <p className="text-[clamp(30px,4vw,52px)] font-semibold leading-[1.02] tracking-[-0.05em]">
                    Ask me anything
                    <br />
                    <span className="text-black/30">about Pawan.</span>
                  </p>
                  <p className="mt-[14px] max-w-[440px] text-[17px] leading-[1.5] tracking-[-0.03em] text-black/55 max-[640px]:mt-[10px] max-[640px]:text-[15px]">
                    His work, services, projects, or how to start a project together.
                  </p>
                  <div className="mt-[24px] flex flex-wrap gap-[8px]">
                    {suggestions.map((s, i) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="chat-in rounded-full border border-black/[0.08] bg-white/60 px-[16px] py-[10px] text-[15px] tracking-[-0.03em] backdrop-blur-xl max-[640px]:px-[14px] max-[640px]:py-[8px] max-[640px]:text-[14px] transition-all duration-300 hover:-translate-y-[2px] hover:border-ink hover:bg-ink hover:text-cream"
                        style={{ animationDelay: `${0.12 + i * 0.06}s` }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) =>
                  m.role === "user" ? (
                    <div
                      key={m.id}
                      className="chat-in max-w-[80%] self-end rounded-[20px] rounded-br-[6px] bg-ink px-[18px] py-[14px] text-[17px] max-[640px]:max-w-[88%] max-[640px]:px-[15px] max-[640px]:py-[11px] max-[640px]:text-[15.5px] leading-[1.45] tracking-[-0.03em] text-cream shadow-[0_14px_40px_-14px_rgba(0,0,0,.45)]"
                    >
                      {m.text}
                    </div>
                  ) : (
                    <AIBubble key={m.id} msg={m} animate={m.id === lastAnimated} onTick={scrollToEnd} close={closeChat} />
                  ),
                )
              )}
              {thinking && (
                <div className="chat-in flex items-end gap-[10px] self-start">
                  <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-ink text-cream">
                    <Icon
                      icon="carbon:ai-observability"
                      width={14}
                      height={14}
                    />
                  </span>
                  <div className="flex h-[48px] items-center gap-[5px] rounded-[20px] rounded-bl-[6px] border border-black/[0.06] bg-white/75 px-[18px] backdrop-blur-xl">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="chat-dot h-[7px] w-[7px] rounded-full bg-ink/60" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating bar: 38px from the top while browsing, travels to 38px from the bottom
          at the end of the page, then widens into the AI input (reversed on the way back) */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <nav
          className="pointer-events-auto absolute left-1/2 box-border max-w-[calc(100vw-24px)]"
          style={{
            top: docked ? "calc(100% - 38px)" : "38px",
            transform: docked ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            width: docked ? "min(680px, calc(100vw - 24px))" : "min(400px, calc(100vw - 24px))",
            transition: docked
              ? `top .8s ${EASE}, transform .8s ${EASE}, width .7s ${EASE} .55s`
              : `width .55s ${EASE}, top .8s ${EASE} .35s, transform .8s ${EASE} .35s`,
          }}
        >
          <div
            className={`flex overflow-hidden rounded-[16px] bg-ink text-cream ${docked ? "flex-col" : "flex-col-reverse"}`}
            style={{
              boxShadow: chatOpen ? "0 30px 80px -20px rgba(0,0,0,.45)" : "0 10px 30px -12px rgba(0,0,0,.25)",
              transition: `box-shadow .6s ${EASE}`,
            }}
          >
            {/* Links menu opens away from the screen edge: down at the top, up at the bottom */}
            <div
              className="grid"
              style={{ gridTemplateRows: menuOpen ? "1fr" : "0fr", transition: `grid-template-rows .5s ${EASE}` }}
            >
              <div className="overflow-hidden">
                <ul className={`flex flex-col gap-[6px] px-[21px] ${docked ? "pb-[4px] pt-[18px]" : "pb-[22px] pt-[4px]"}`}>
                  {links.map((l, i) => (
                    <li
                      key={l}
                      style={{
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? "none" : `translateY(${docked ? -10 : 10}px)`,
                        transition: `all .5s ${menuOpen ? 0.1 + (docked ? links.length - i : i) * 0.04 : 0}s`,
                      }}
                    >
                      <a
                        href={to(`/#${l.toLowerCase().replace(" ", "")}`)}
                        onClick={() => setMenuOpen(false)}
                        className="roll-host flex items-center justify-between border-b border-cream/10 py-[10px] text-[24px] font-medium tracking-[-0.04em]"
                      >
                        <Roll text={l} />
                        <span className="arrow-box">
                          <Arrow size={16} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex h-[73px] items-center gap-[14px] pl-[21px] pr-[14px] max-[640px]:h-[64px] max-[640px]:gap-[10px] max-[640px]:pl-[16px] max-[640px]:pr-[10px]">
              <a href={to("/")} className="shrink-0 text-[28px] max-[640px]:text-[22px] font-bold leading-none tracking-[-0.06em]">
                Pawan
              </a>
              <span
                className="h-[26px] w-px shrink-0 bg-cream/15"
                style={{ opacity: docked ? 1 : 0, transition: `opacity .5s ${docked ? ".7s" : "0s"}` }}
              />
              <label
                className="flex min-w-0 flex-1 cursor-text items-center gap-[10px]"
                style={{
                  opacity: docked ? 1 : 0,
                  transform: docked ? "none" : "translateX(-12px)",
                  filter: docked ? "blur(0)" : "blur(4px)",
                  pointerEvents: docked ? "auto" : "none",
                  transition: `all .6s ${EASE} ${docked ? ".75s" : "0s"}`,
                }}
              >
                <Icon
                  icon="carbon:ai-observability"
                  width={16}
                  height={16}
                  className={`shrink-0 transition-colors duration-500 ${chatOpen ? "text-cream" : "text-cream/50"
                    }`}
                />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={openChat}
                  tabIndex={docked ? 0 : -1}
                  placeholder={chatOpen ? "Ask anything about Pawan…" : "Ask AI about me"}
                  aria-label="Ask AI about Pawan"
                  className="h-[44px] min-w-0 flex-1 bg-transparent text-[17px] max-[640px]:text-[16px] tracking-[-0.03em] text-cream outline-none placeholder:text-cream/45"
                />
              </label>
              <button
                type={hasText ? "submit" : "button"}
                onClick={hasText ? undefined : () => (chatOpen ? closeChat() : setMenuOpen((o) => !o))}
                aria-label={hasText ? "Send" : chatOpen ? "Close chat" : "Menu"}
                disabled={thinking && hasText}
                className="relative flex h-[44px] w-[55px] shrink-0 items-center justify-center rounded-[8px] bg-cream text-ink transition-transform duration-300 active:scale-95 max-[640px]:h-[40px] max-[640px]:w-[44px]"
              >
                {/* dots → menu, X → close, arrow → send */}
                <span
                  className="absolute flex gap-[4px]"
                  style={{
                    transition: "all .4s",
                    opacity: !hasText && !menuOpen && !chatOpen ? 1 : 0,
                    transform: !hasText && !menuOpen && !chatOpen ? "none" : "scale(.5)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-[5px] w-[5px] rounded-full bg-ink" />
                  ))}
                </span>
                <span
                  className="absolute"
                  style={{
                    transition: "all .4s",
                    opacity: !hasText && (menuOpen || chatOpen) ? 1 : 0,
                    transform: !hasText && (menuOpen || chatOpen) ? "rotate(0)" : "rotate(-90deg)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M3 3l10 10M13 3L3 13" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span
                  className="absolute"
                  style={{
                    transition: "all .4s",
                    opacity: hasText ? 1 : 0,
                    transform: hasText ? "none" : "translateY(8px)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </nav>
      </div>
    </>
  )
}
