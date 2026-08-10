import FadeIn from '../components/FadeIn'

// Served from the MEDIA folder (public). Portrait blends into the dark bg.
const PROFILE_IMG = '/PICTURES/MehdiProfilePic.png'

// ── Edit your About details here ──────────────────────────────────────────
const NAME = 'Mehdi Fazzat'
const ROLE = '2D Motion Designer'
const SUBTITLE = 'Compositor & VFX Artist'
const LOCATION = 'Casablanca, Morocco'

// "years of experience" auto-updates each calendar year — never edit by hand.
// 2026 → 16, 2027 → 17, and so on.
const EXPERIENCE_SINCE = 2010
const YEARS = new Date().getFullYear() - EXPERIENCE_SINCE

const BIO_LEAD =
  'Great animation does more than look beautiful—it communicates, connects, and leaves a lasting impression.'
const BIO_BODY = `With over ${YEARS} years of experience across motion design, 2D animation, and visual effects, I've helped brands, agencies, and studios transform ideas into engaging visual experiences. Every project is crafted with a focus on clarity, smooth motion, and attention to detail, creating animations that are both visually compelling and purposeful.`
// ──────────────────────────────────────────────────────────────────────────

const ACCENT = '#e56b59'
const CREAM = '#ECE6DA'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#0C0C0C] flex flex-col md:flex-row items-stretch overflow-hidden"
    >
      {/* Left — portrait (bleeds to the edge; its dark tones blend into the bg on their own) */}
      <div className="relative z-0 w-full md:w-1/2 h-[55vh] sm:h-[62vh] md:h-auto md:min-h-screen">
        <img
          src={PROFILE_IMG}
          alt={NAME}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain object-center"
        />
      </div>

      {/* Right — text block (kept above the image in stacking order, whatever the layout) */}
      <div className="relative z-10 w-full md:w-1/2 flex items-center px-6 sm:px-10 md:px-14 lg:px-20 py-14 md:py-0">
        {/* Each line reveals on scroll, staggered, and replays on re-entry */}
        <div className="w-full max-w-xl">
          <FadeIn
            as="p"
            delay={0}
            className="font-mono uppercase tracking-[0.25em] text-xs sm:text-sm mb-5 md:mb-7"
            style={{ color: ACCENT }}
          >
            About
          </FadeIn>

          <FadeIn
            as="h2"
            delay={0.08}
            className="font-black uppercase leading-[0.95] tracking-tight"
            style={{ color: CREAM, fontSize: 'clamp(2.1rem, 5vw, 3.9rem)' }}
          >
            {NAME}
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.16}
            className="font-black uppercase leading-[0.95] tracking-tight mb-4"
            style={{ color: ACCENT, fontSize: 'clamp(2.2rem, 5.4vw, 4.2rem)' }}
          >
            {ROLE}
          </FadeIn>

          <FadeIn
            as="p"
            delay={0.24}
            className="text-[#D7E2EA]/60 font-light"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)' }}
          >
            {SUBTITLE}
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.3}
            className="font-mono uppercase tracking-[0.2em] text-[#D7E2EA]/40 text-[0.7rem] sm:text-xs mt-2"
          >
            {LOCATION}
          </FadeIn>

          <FadeIn delay={0.36} className="h-px bg-[#D7E2EA]/15 my-7 md:my-9" y={0}>
            {null}
          </FadeIn>

          <FadeIn
            as="p"
            delay={0.42}
            className="text-[#D7E2EA]/60 font-light leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)' }}
          >
            {BIO_LEAD}
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.5}
            className="text-[#D7E2EA]/60 font-light leading-relaxed mt-4"
            style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)' }}
          >
            {BIO_BODY}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
