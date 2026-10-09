import type { ReactNode } from "react"
import { FadeUp, IMG } from "../lib/ui"


export type Project = {
  name: string
  type: string
  background: string
  website: string
}

export const projects: Project[] = [
  {
    name: "UniLynk",
    type: "Campus Community Platform",
    background: "/projects/unilynk-bg.png",
    website: "/projects/unilynk-website.png",
  },
  {
    name: "DevDomain",
    type: "Lead Management CRM",
    background: "/projects/devdomain-bg.png",
    website: "/projects/devdomain-website.png",
  },
  {
    name: "Radhakishan hospital",
    type: "Hospital Website",
    background: "/projects/radhakishan-bg.png",
    website: "/projects/radhakishan-website.png",
  },
  {
    name: "Yubhi Ayurveda",
    type: "Ayurvedic E-commerce Website",
    background: "/projects/yubhi-bg.png",
    website: "/projects/yubhi-website.png",
  },
]



export function ProjectCard({
  p,
  delay = 0,
}: {
  p: Project
  delay?: number
}) {
  return (
    <FadeUp delay={delay}>
      <a href="#" className="group block">
        <div className="relative aspect-[728/502] overflow-hidden rounded-[20px]">
          {/* Background image */}
          <img
            src={p.background}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />

          {/* Website screenshot */}
          <div className="absolute inset-x-[12%] top-[3%] bottom-0 overflow-hidden rounded-t-[14px] shadow-[0_20px_60px_rgba(0,0,0,.35)]">
            <img
              src={p.website}
              alt={`${p.name} website preview`}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <h3 className="mt-[12px] text-[40px] font-medium leading-[1.2] tracking-[-0.04em]">
          {p.name}
        </h3>

        <p className="text-[20px] leading-[1.5] tracking-[-0.05em]">
          {p.type}
        </p>
      </a>
    </FadeUp>
  )
}

