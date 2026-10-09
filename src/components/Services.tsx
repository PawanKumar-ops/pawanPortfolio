import { wrap, BlurText, FadeUp } from "../lib/ui"

const services = [
  [
    "Full-Stack Development",
    ["React", "Next.js", "Node.js"],
  ],
  [
    "Frontend Engineering",
    ["UI Development", "Responsive Design", "Performance"],
  ],
  [
    "Backend & Database",
    ["REST APIs", "Authentication", "MongoDB"],
  ],
  [
    "Product Development",
    ["SaaS Applications", "System Design", "Problem Solving"],
  ],
] as const

export default function Services() {
  return (
    <section id="services" className={`${wrap} pt-[46px]`}>
      <BlurText
        text="Services"
        className="text-[100px] font-semibold leading-[1.1] tracking-[-0.04em] max-[810px]:text-[64px]"
      />
      <div className="mt-[52px]">
        {services.map(([title, tags], i) => (
          <FadeUp key={title} delay={i * 0.06}>
            <div className="group flex items-center justify-between gap-6 border-b border-black/10 py-[64px] max-[810px]:flex-col max-[810px]:items-start max-[810px]:py-10">
              <h3 className="text-[36px] font-medium leading-[1.2] tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-[12px] max-[810px]:text-[28px]">
                {title}
              </h3>
              <div className="flex flex-wrap items-center gap-[12px] text-[20px] tracking-[-0.05em] text-black/50">
                {tags.map((t, j) => (
                  <span key={t} className="flex items-center gap-[12px]">
                    {j > 0 && (
                      <span className="h-[4px] w-[4px] rounded-full bg-ink" />
                    )}
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
