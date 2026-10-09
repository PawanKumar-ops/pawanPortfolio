import { useEffect, useState } from "react"
import HomePage from "./home/page"
import { jumpTo, initSmoothScroll } from "./lib/smoothScroll"
import { BASE } from "./lib/ui"
import ProjectsPage from "./projects/page"

type Route = "home" | "projects"
const getRoute = (): Route =>
  window.location.pathname.slice(BASE.length).replace(/\/$/, "") === "/projects"
    ? "projects"
    : "home"

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    // After a page change, jump to the URL's section anchor or to the top
    const settle = () =>
      requestAnimationFrame(() => {
        const id = decodeURIComponent(window.location.hash.slice(1))
        const el = id ? document.getElementById(id) : null
        jumpTo(el ?? 0)
      })

    // Client-side navigation for same-origin links that change the page path
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return
      const a = (e.target as Element).closest("a")
      if (!a || a.target === "_blank" || !a.href) return
      const url = new URL(a.href)
      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      )
        return
      e.preventDefault()
      window.history.pushState(null, "", url.pathname + url.search + url.hash)
      setRoute(getRoute())
      settle()
    }
    const onPop = () => {
      setRoute(getRoute())
      settle()
    }
    document.addEventListener("click", onClick)
    window.addEventListener("popstate", onPop)
    return () => {
      document.removeEventListener("click", onClick)
      window.removeEventListener("popstate", onPop)
    }
  }, [])

  return (
    <div className="relative min-h-screen font-archivo">
      <div className="grain" />
      {route === "projects" ? (
        <ProjectsPage key="projects" />
      ) : (
        <HomePage key="home" />
      )}
    </div>
  )
}
