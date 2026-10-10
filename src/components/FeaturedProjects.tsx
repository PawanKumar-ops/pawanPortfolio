import { to, wrap, BlurText, ArrowLink } from "../lib/ui"
import { ProjectCard, projects } from "./ProjectCard"

export default function FeaturedProjects() {
  return (
    <section id="works" className={`${wrap} mt-[160px]`}>
      <div className="flex items-end justify-between max-[810px]:flex-col max-[810px]:items-start max-[810px]:gap-6">
        <BlurText
          text={"Featured\nProjects"}
          className="text-[100px] font-semibold leading-[0.97] tracking-[-0.04em] max-[810px]:text-[64px]"
        />
        <div className="pb-[6px]">
          <ArrowLink label="View All Work" href={to("/projects")} />
        </div>
      </div>
      <div className="mt-[75px] grid grid-cols-2 gap-x-[20px] gap-y-[20px] max-[810px]:grid-cols-1">
        {projects.slice(0, 4).map((p, i) => (
          <ProjectCard key={p.name} p={p} delay={(i % 2) * 0.1} />
        ))}
      </div>
    </section>
  )
}
