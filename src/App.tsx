import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import { smoothScrollTo } from './lib/smoothScroll'
import HeroSection from './sections/HeroSection'
import WorkSection from './sections/WorkSection'
import ClientsSection from './sections/ClientsSection'
import AboutSection from './sections/AboutSection'
import ContactSection from './sections/ContactSection'
import WorkModal from './components/WorkModal'

// Minimal hash router: "#/work/<id>" opens a project page, anything else = home.
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

// Intercept in-page anchor clicks (#about, #work, …) and scroll smoothly with
// a custom ease instead of the browser's instant jump. Leaves route links
// (#/work/…) and downloads alone.
function useSmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href[0] !== '#' || href.startsWith('#/')) return
      const el = document.getElementById(href.slice(1))
      if (!el) return
      e.preventDefault()
      smoothScrollTo(el)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

export default function App() {
  const hash = useHashRoute()
  useSmoothAnchors()
  const projectMatch = hash.match(/^#\/work\/(.+)$/)

  return (
    <>
      <Preloader />
      <Cursor />
      <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        <HeroSection />
        <WorkSection />
        <ClientsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <WorkModal id={projectMatch?.[1] ?? null} />
    </>
  )
}
