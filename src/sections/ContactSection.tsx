import { Instagram, Linkedin, Youtube } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import CopyableEmail from '../components/CopyableEmail'

// ── Edit your contact details here ────────────────────────────────────────
const EMAIL = 'mfazzat@gmail.com'
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mehdi-fazzat-7b9a4815b', Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/fazzatimation/', Icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/watch?v=NxDL8nfy66k', Icon: Youtube },
]
// ────────────────────────────────────────────────────────────────────────────

const ACCENT = '#e56b59'
const CREAM = '#ECE6DA'

export default function ContactSection() {
  const year = new Date().getFullYear()

  return (
    <section
      id="contact"
      className="relative bg-[#0C0C0C] overflow-hidden px-6 md:px-10 pt-28 md:pt-36 pb-10"
    >
      {/* Soft radial glow low in the section (behind the socials/footer), for a
          premium/cinematic feel — the top of the section (behind the heading)
          stays plain background. */}
      <div
        className="pointer-events-none absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[140vw] h-[70vh] opacity-[0.16]"
        style={{
          background: `radial-gradient(closest-side, ${ACCENT} 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <FadeIn
          as="p"
          className="font-mono uppercase tracking-[0.3em] text-xs sm:text-sm mb-6 md:mb-8"
          style={{ color: ACCENT }}
        >
          Get In Touch
        </FadeIn>

        <FadeIn
          as="h2"
          delay={0.08}
          className="font-black uppercase leading-[0.92] tracking-tight"
          style={{ color: CREAM, fontSize: 'clamp(2.6rem, 8vw, 6.5rem)' }}
        >
          Let&apos;s create
          <br />
          something <span style={{ color: ACCENT }}>great</span>
        </FadeIn>

        <FadeIn delay={0.18} y={20} className="mt-10 md:mt-14">
          <CopyableEmail email={EMAIL} />
        </FadeIn>

        {/* Socials */}
        <FadeIn delay={0.28} y={20} className="mt-14 md:mt-20">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {SOCIALS.map(({ label, href, Icon }) => (
              <Magnet key={label} padding={40} strength={3}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA]/70 transition-colors duration-300 hover:border-transparent hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
                >
                  <Icon size={22} strokeWidth={1.6} />
                </a>
              </Magnet>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Footer line */}
      <FadeIn
        delay={0.36}
        y={12}
        className="relative mt-24 md:mt-32 pt-8 border-t border-[#D7E2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto"
      >
        <p className="font-mono uppercase tracking-[0.2em] text-[#D7E2EA]/35 text-[0.65rem] sm:text-xs">
          © {year} Mehdi Fazzat — 2D Motion Designer
        </p>
        <p className="font-mono uppercase tracking-[0.2em] text-[#D7E2EA]/35 text-[0.65rem] sm:text-xs">
          Casablanca, Morocco
        </p>
      </FadeIn>
    </section>
  )
}
