import { IMG, to, wrap, useInView, BlurText, smooth } from "../lib/ui"

const testimonials = [
  [
    "Pawan has a great eye for detail and a clear understanding of how to turn ideas into functional, well-designed web experiences. The final result feels polished and thoughtfully built.",
    "Client Name",
    "Website Client",
    IMG.a1,
  ],
  [
    "What stands out is the attention to both design and functionality. The application feels intuitive, performs smoothly, and delivers a great user experience.",
    "Client Name",
    "Project Collaborator",
    IMG.a2,
  ],
  [
    "Working with Pawan was a great experience. He approaches challenges with a problem-solving mindset and focuses on building solutions that work in the real world.",
    "Client Name",
    "Business Owner",
    IMG.a3,
  ],
  [
    "Pawan combines technical skills with a strong interest in product development. He thinks beyond the interface and considers how the entire application works together.",
    "Client Name",
    "Development Teammate",
    IMG.a4,
  ],
]

export default function Testimonials() {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  return (
    <section className={`${wrap} mt-[160px]`}>
      <BlurText
        text="Testimonials"
        className="text-[100px] font-semibold leading-[1.1] tracking-[-0.04em] max-[810px]:text-[56px]"
      />
      <div
        ref={ref}
        className="mt-[60px] grid grid-cols-4 gap-[20px] max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1"
      >
        {testimonials.map(([quote, name, role, img], i) => (
          <div
            key={name}
            className="h-[340px]"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                transformStyle: "preserve-3d",
                transform: inView ? "rotateY(0deg)" : "rotateY(180deg)",
                transition: `transform 1.2s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
              }}
            >
              <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-[20px] bg-ink p-[24px] text-cream">
                <p className="text-[18px] leading-[1.3] tracking-[-0.05em]">
                  {quote}
                </p>
                <div className="flex items-center gap-[10px]">
                  <img
                    src={img}
                    alt={name}
                    className="h-[50px] w-[50px] rounded-full object-cover"
                  />
                  <div className="text-[18px] leading-[1.3] tracking-[-0.05em]">
                    <p className="text-[16px]">{name}</p>
                    <p className="text-cream/90 text-[16px]">{role}</p>
                  </div>
                </div>
              </div>
              <div
                className="backface-hidden absolute inset-0 flex items-center justify-center rounded-[20px] bg-ink"
                style={{ transform: "perspective(1200px) rotateY(180deg)" }}
              >
                <span className="text-[120px] font-bold leading-none text-cream/10">
                  “
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
