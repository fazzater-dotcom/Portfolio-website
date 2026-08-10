import { useEffect, useState } from 'react'

/**
 * Full-page loading screen shown while the site's media (hero video, images,
 * fonts) loads — helpful on slow connections. Four white squares bounce and
 * rotate in a staggered wave, inspired by GSAP's "keyframes" demo, then the
 * overlay fades out once the page has loaded (with a min/max time guard).
 */
export default function Preloader() {
  const [hidden, setHidden] = useState(false) // fade-out started
  const [removed, setRemoved] = useState(false) // taken out of the DOM

  useEffect(() => {
    const start = Date.now()
    const MIN_MS = 1200 // show at least one full loop, avoid a flash
    const MAX_MS = 15000 // safety cap so a failed/absent video can't trap the user
    let done = false

    const finish = () => {
      if (done) return
      done = true
      const wait = Math.max(0, MIN_MS - (Date.now() - start))
      window.setTimeout(() => {
        setHidden(true)
        window.setTimeout(() => setRemoved(true), 650) // after the fade transition
      }, wait)
    }

    const cap = window.setTimeout(finish, MAX_MS)
    const cleanups: Array<() => void> = [() => window.clearTimeout(cap)]

    // Keep the loader looping until the hero video can actually play (i.e. is
    // ready to be shown) — not merely until the page's `load` event fires.
    const video = document.querySelector('video') as HTMLVideoElement | null
    if (video) {
      if (video.readyState >= 3 /* HAVE_FUTURE_DATA — can play */) {
        finish()
      } else {
        const onReady = () => finish()
        for (const ev of ['canplay', 'playing', 'error'] as const) {
          video.addEventListener(ev, onReady)
          cleanups.push(() => video.removeEventListener(ev, onReady))
        }
      }
    } else {
      // No hero video on this route → fall back to the window load event.
      if (document.readyState === 'complete') finish()
      else {
        window.addEventListener('load', finish)
        cleanups.push(() => window.removeEventListener('load', finish))
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  if (removed) return null

  return (
    <div className={`preloader${hidden ? ' preloader--hidden' : ''}`} aria-hidden="true">
      <div className="preloader__row">
        <span className="preloader__box" />
        <span className="preloader__box" />
        <span className="preloader__box" />
        <span className="preloader__box" />
      </div>
    </div>
  )
}
