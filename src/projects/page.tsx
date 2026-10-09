import Footer from "../components/Footer"
import Nav from "../components/Nav"
import { ProjectCard, projects } from "../components/ProjectCard"
import { BlurText, FadeUp, wrap } from "../lib/ui"

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="pt-[220px] max-[810px]:pt-[160px]">
        <section className={wrap}>
          <BlurText
            as="h1"
            text={"My Brightest\nCreations"}
            className="text-[100px] font-semibold leading-[0.9] tracking-[-0.04em] max-[810px]:text-[56px]"
          />
          <FadeUp delay={0.2}>
            <p className="mt-[12px] max-w-[590px] text-[20px] leading-[1.4] tracking-[-0.05em]">
              A showcase of my latest projects, highlighting thoughtful design,
              clear strategy, and impactful results.
            </p>
          </FadeUp>
          <div className="mt-[78px] grid grid-cols-2 gap-[24px] max-[810px]:grid-cols-1">
            {projects.map((p, i) => (
              <ProjectCard key={p.name} p={p} delay={(i % 2) * 0.1} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
