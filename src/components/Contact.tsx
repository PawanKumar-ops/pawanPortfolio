import { to, wrap, BlurText, FadeUp, Roll } from "../lib/ui"

function SocialIcon({ kind }: { kind: "x" | "ig" | "in" | "yt" }) {
  const p = {
    fill: "none",
    stroke: "#111",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  return (
    <a
      href="#"
      className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-black/10 transition-colors hover:bg-black/20"
    >
      <svg width="22" height="22" viewBox="0 0 24 24">
        {kind === "x" && (
          <path
            {...p}
            d="M4 4l6.5 8.6L4.3 20M20 4l-6.2 6.9M4 4h4.2L20 20h-4.2z"
          />
        )}
        {kind === "ig" && (
          <g {...p}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r=".6" fill="#111" />
          </g>
        )}
        {kind === "in" && (
          <g {...p}>
            <path d="M5 10v9M5 5.5v.2M10 19v-9M10 13.5c0-2 1.4-3.5 3.3-3.5S16.5 11.3 16.5 13.3V19" />
          </g>
        )}
        {kind === "yt" && (
          <g {...p}>
            <rect x="3" y="6" width="18" height="12" rx="4" />
            <path d="M10.5 9.5l4 2.5-4 2.5z" />
          </g>
        )}
      </svg>
    </a>
  )
}

export default function Contact() {
  const field =
    "w-full rounded-[12px] border border-cream/15 bg-transparent px-[14px] text-[18px] tracking-[-0.04em] text-cream outline-none transition-colors focus:border-cream/50"
  return (
    <section
      id="contact"
      className={`${wrap} mt-[160px] flex justify-between gap-10 max-[900px]:flex-col`}
    >
      <div className="flex flex-col justify-between">
        <div>
          <BlurText
            text="Let’s talk."
            className="text-[100px] font-semibold leading-[1.1] tracking-[-0.04em] max-[810px]:text-[64px]"
          />
          <FadeUp>
            <p className="mt-[6px] text-[20px] tracking-[-0.05em]">
              Have an idea to build, an opportunity to discuss, or just want to talk
              about technology? I'd love to hear from you.
            </p>
          </FadeUp>
        </div>
        <div className="flex gap-[20px] max-[900px]:mt-8">
          {(["x", "ig", "in", "yt"] as const).map((k) => (
            <SocialIcon key={k} kind={k} />
          ))}
        </div>
      </div>
      <FadeUp className="w-[625px] max-w-full">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-[20px] bg-ink p-[20px] text-cream"
        >
          <label className="block text-[18px] tracking-[-0.04em]">Name</label>
          <input
            className={`${field} mt-[10px] h-[55px]`}
            placeholder="Enter your name"
          />
          <label className="mt-[20px] block text-[18px] tracking-[-0.04em]">
            Email
          </label>
          <input
            type="email"
            className={`${field} mt-[10px] h-[55px]`}
            placeholder="Enter your email"
          />
          <label className="mt-[20px] block text-[18px] tracking-[-0.04em]">
            Your Project
          </label>
          <textarea
            className={`${field} mt-[10px] h-[175px] resize-y py-[12px]`}
            placeholder="Tell us about your project"
          />
          <button
            type="submit"
            className="roll-host mt-[25px] flex h-[55px] w-full items-center justify-center rounded-[8px] bg-cream text-[18px] tracking-[-0.04em] text-ink"
          >
            <Roll text="Submit" />
          </button>
        </form>
      </FadeUp>
    </section>
  )
}
