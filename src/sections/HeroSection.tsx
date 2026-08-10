import FadeIn from '../components/FadeIn'
import WaveText from '../components/WaveText'
import MagneticButton from '../components/MagneticButton'

const NAV_LINKS = ['About', 'Work', 'Clients', 'Contact']

// Served from the MEDIA folder (see vite.config.ts publicDir).
// Lightweight compressed clip for the autoplaying hero (~10 MB).
const HERO_VIDEO_URL = '/VIDEOS/ShowREELweb.mp4'
// Full-quality reel offered as a download (~145 MB).
const SHOWREEL_DOWNLOAD_URL = '/VIDEOS/ShowREEL%202026%20B.mp4'
const CV_URL = '/DOCUMENTS/CV.pdf'

// Nav label styling — half the previous size, plus the Olé wave (nav-wave).
// Layout/hover (fill, magnetic, colour flip) come from .mag-btn.
const NAV_LABEL_CLASS =
  'nav-wave text-[#D7E2EA] font-medium uppercase tracking-wider text-[0.44rem] md:text-[0.56rem] lg:text-[0.7rem]'

// Links inside the Download dropdown — fill sweep only (no wave / magnetic).
const DROPDOWN_ITEM_CLASS =
  'fill-btn block text-[#D7E2EA] font-medium uppercase tracking-wider text-[0.44rem] md:text-[0.56rem] lg:text-[0.7rem] px-3 py-2'

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Full-screen autoplaying showreel */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Subtle top scrim so the nav stays legible over the video */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40"
        style={{
          background: 'linear-gradient(180deg, rgba(12,12,12,0.65) 0%, rgba(12,12,12,0) 100%)',
        }}
      />

      {/* Navbar — top-right */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex justify-end items-center gap-1 md:gap-2 lg:gap-3 px-6 md:px-10 pt-6 md:pt-8"
      >
        {NAV_LINKS.map((link) => (
          <MagneticButton key={link} href={`#${link.toLowerCase()}`} className={NAV_LABEL_CLASS}>
            <WaveText text={link} />
          </MagneticButton>
        ))}

        {/* Download — reveals CV / Showreel on hover or focus */}
        <div className="relative group">
          <MagneticButton as="button" className={NAV_LABEL_CLASS}>
            <WaveText text="Download" />
            <span aria-hidden="true" className="text-[0.7em] leading-none">▾</span>
          </MagneticButton>

          <div
            className="absolute right-0 top-full pt-3 min-w-[9rem] opacity-0 invisible translate-y-1
                       transition-all duration-200
                       group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                       group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0"
          >
            <div className="flex flex-col overflow-hidden rounded-md bg-[#151515] ring-1 ring-white/10 shadow-xl">
              <a href={CV_URL} download="CV.pdf" className={DROPDOWN_ITEM_CLASS}>
                <span className="fill-btn__filler" aria-hidden="true" />
                <span className="fill-btn__text">CV</span>
              </a>
              <a href={SHOWREEL_DOWNLOAD_URL} download="ShowREEL 2026 B.mp4" className={DROPDOWN_ITEM_CLASS}>
                <span className="fill-btn__filler" aria-hidden="true" />
                <span className="fill-btn__text">Showreel</span>
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
