import { IMG, wrap, BlurText, FadeUp, ArrowLink } from "../lib/ui"

const posts = [
  [
    "01 / DEVELOPMENT",
    "Beyond Writing Code",
    "Why building great software means understanding problems, making thoughtful decisions, and caring about the details.",
    IMG.city,
  ],
  [
    "02 / PRODUCT THINKING",
    "From Idea to Product",
    "Turning an initial idea into a useful digital product through experimentation, iteration, and purposeful engineering.",
    IMG.train,
  ],
]

export default function Thoughts() {
  return (
    <section className={`${wrap} mt-[160px]`}>
      <BlurText
        text="Notes & Insights"
        className="text-[100px] font-semibold leading-[1.1] tracking-[-0.04em] max-[810px]:text-[64px]"
      />
      <div className="mt-[60px] grid grid-cols-3 gap-[20px] max-[1000px]:grid-cols-1">
        {posts.map(([date, title, desc, img], i) => (
          <FadeUp key={title} delay={i * 0.1}>
            <a
              href="#"
              className="group relative block h-[575px] overflow-hidden rounded-[20px] bg-ink text-cream"
            >
              <img
                src={img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                style={{ filter: "grayscale(1) blur(1.5px)" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,.85)_100%)]" />
              <div className="absolute inset-x-[24px] bottom-[24px]">
                <p className="text-[18px] tracking-[-0.05em]">{date}</p>
                <h3 className="mt-[8px] max-w-[400px] text-[36px] font-medium leading-[1.2] tracking-[-0.04em]">
                  {title}
                </h3>
                <p className="mt-[12px] text-[18px] leading-[1.4] tracking-[-0.05em] text-cream/90">
                  {desc}
                </p>
              </div>
            </a>
          </FadeUp>
        ))}
        <FadeUp delay={0.2}>
          <div className="flex h-[575px] flex-col justify-between rounded-[20px] bg-ink p-[30px] text-cream">
            <p className="text-[50px] leading-[1.32] tracking-[-0.04em] max-[810px]:text-[38px]">
              Ideas, lessons, and perspectives on software, products, and building for the real world.
            </p>
            <div className="pb-[2px]">
              <ArrowLink label="View All Work" dark />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
