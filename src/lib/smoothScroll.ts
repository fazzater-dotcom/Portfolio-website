// Ease-in-out cubic — accelerates, then decelerates to a gentle stop
// (the "rolling ball settling" feel).
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Smoothly scrolls the window to a target element (or absolute Y position) with
 * a soft ease-in-out over `duration` ms. Cancels itself if the user scrolls
 * manually (wheel / touch), so it never fights the user.
 */
export function smoothScrollTo(target: HTMLElement | number, duration = 1150) {
  const startY = window.scrollY
  const endY =
    typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  const distance = endY - startY
  if (Math.abs(distance) < 2) return

  let startTime: number | null = null
  let cancelled = false
  const cancel = () => {
    cancelled = true
  }
  window.addEventListener('wheel', cancel, { passive: true, once: true })
  window.addEventListener('touchstart', cancel, { passive: true, once: true })

  const step = (now: number) => {
    if (cancelled) return
    if (startTime === null) startTime = now
    const t = Math.min(1, (now - startTime) / duration)
    window.scrollTo(0, startY + distance * easeInOutCubic(t))
    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
    }
  }
  requestAnimationFrame(step)
}
