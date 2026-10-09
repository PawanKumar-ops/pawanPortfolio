
import { Icon } from "@iconify/react"
import { to, wrap, BlurText, FadeUp, Roll } from "../lib/ui"

function SocialIcon({ kind }: { kind: "x" | "ig" | "in" | "yt" }) {
  const icons = {
    x: "ri:twitter-x-fill",
    ig: "ri:instagram-line",
    in: "basil:linkedin-outline",
    yt: "ant-design:youtube-outlined",
  }

  return (
    <a
      href="#"
      aria-label={{
        x: "X",
        ig: "Instagram",
        in: "LinkedIn",
        yt: "YouTube",
      }[kind]}
      className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-black/10 transition-colors hover:bg-black/20"
    >
      <Icon
        icon={icons[kind]}
        width={22}
        height={22}
        className="text-[#111]"
      />
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
