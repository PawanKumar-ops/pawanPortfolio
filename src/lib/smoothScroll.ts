import Lenis from "lenis"

/**
 * Site-wide smooth scrolling. Wheel/trackpad input is eased and slightly
 * slowed so scroll-driven animations (portrait flip, word reveal, footer)
 * play out with more weight. Touch devices keep native scrolling.
 */
let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {}
  lenis = new Lenis({
    lerp: 0.075, // lower = smoother/slower catch-up
    wheelMultiplier: 0.8, // ~20% less distance per wheel tick
    smoothWheel: true,
    anchors: true, // same-page #links glide instead of jumping
  })
  let raf = 0
  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

/** Pause/resume page scrolling, e.g. while an overlay is open */
export function setScrollLocked(locked: boolean) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

/** Instant jump that keeps Lenis in sync (used after page changes) */
export function jumpTo(target: HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
  else if (typeof target === "number") window.scrollTo(0, target)
  else target.scrollIntoView()
}

const BASE_WHEEL = 0.8
const BASE_LERP = 0.075

/**
 * Scale scroll speed relative to the site default (1 = normal).
 * Used to slow scrolling through specific moments like the hero portrait flip.
 */
export function setScrollSpeed(factor: number) {
  if (!lenis) return
  lenis.options.wheelMultiplier = BASE_WHEEL * factor
  lenis.options.lerp = BASE_LERP * (0.75 + 0.25 * factor)
}
