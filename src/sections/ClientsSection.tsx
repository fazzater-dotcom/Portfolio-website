import { useEffect, useMemo, useRef } from 'react'
import Magnet from '../components/Magnet'

/**
 * Client logos are auto-discovered from MEDIA/PICTURES/Clients/. Drop any new
 * logo (png/jpg/svg/webp/jfif) into that folder and it shows up automatically —
 * no code changes needed. They run across three rows that slide (driven by
 * scroll) in alternating directions, looping seamlessly (a tile that leaves one
 * edge reappears on the other — no empty gap).
 */
const logoFiles = import.meta.glob('/MEDIA/PICTURES/Clients/*.{png,jpg,jpeg,svg,webp,jfif}')

type Logo = { url: string; name: string }

// Order by the number in the filename (workic_1, workic_2, … workic_10),
// so renaming a logo's number changes its position.
const numberOf = (name: string) => {
  const m = /(\d+)/.exec(name)
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER
}

// In dev, append a per-load cache-buster so renaming/swapping logo files always
// shows up on a plain refresh (the browser otherwise reuses cached images even
// after a hard refresh, because renaming keeps a file's timestamp). No effect on
// the production build.
const BUST = import.meta.env.DEV ? `?t=${Date.now()}` : ''

const LOGOS: Logo[] = Object.keys(logoFiles)
  .map((path) => ({
    url: path.replace(/^\/MEDIA/, '') + BUST, // public URL (MEDIA is the publicDir)
    name: path.split('/').pop()!.replace(/\.[^.]+$/, ''),
  }))
  .sort((a, b) => numberOf(a.name) - numberOf(b.name))

// Split into three rows.
const THIRD = Math.ceil(LOGOS.length / 3)
const ROWS: Logo[][] = [
  LOGOS.slice(0, THIRD),
  LOGOS.slice(THIRD, THIRD * 2),
  LOGOS.slice(THIRD * 2),
]

// Repeated enough times that the strip always overflows the viewport.
const REPEAT = 4
// How far the rows drift per pixel scrolled.
const SPEED = 0.3

function LogoTile({ url, name }: Logo) {
  return (
    <div className="flex-shrink-0 rounded-2xl bg-white w-[195px] h-[120px] sm:w-[247px] sm:h-[150px] p-[25px]">
      {/* Fills the tile (minus the 25px padding), keeping aspect ratio → the
          logo touches within 25px of whichever edge binds it. */}
      <img
        src={url}
        alt={name}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

function LogoRow({ logos, dir }: { logos: Logo[]; dir: 1 | -1 }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const setWidth = useRef(0)
  const tiles = useMemo(() => Array.from({ length: REPEAT }, () => logos).flat(), [logos])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    // One "set" width = distance between a tile and its copy one set later.
    const measure = () => {
      const kids = row.children
      if (kids.length > logos.length) {
        setWidth.current =
          (kids[logos.length] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
      }
    }

    const apply = () => {
      const sw = setWidth.current
      if (!sw) return
      const shift = window.scrollY * SPEED * dir
      // Wrap into [-sw, 0] so the strip always covers the viewport → seamless loop.
      const x = -(((shift % sw) + sw) % sw)
      row.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const onResize = () => {
      measure()
      apply()
    }

    measure()
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', onResize)
    }
  }, [logos, dir])

  return (
    <div ref={rowRef} className="flex gap-3 sm:gap-4 w-max will-change-transform">
      {tiles.map((logo, i) => (
        <LogoTile key={i} {...logo} />
      ))}
    </div>
  )
}

export default function ClientsSection() {
  return (
    <section id="clients" className="bg-[#0C0C0C] py-24 md:py-32 overflow-hidden">
      {/* Title — magnetic letters, like Work */}
      <h2 className="text-[#D7E2EA] font-black uppercase leading-none tracking-tight text-[7vw] sm:text-[5vw] md:text-[3.5vw] px-6 md:px-10 mb-12 md:mb-16">
        {'Clients'.split('').map((ch, i) => (
          <Magnet key={i} padding={15} strength={2.5}>
            <span className="inline-block">{ch}</span>
          </Magnet>
        ))}
      </h2>

      {/* Three rows, alternating direction, seamless loop */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <LogoRow logos={ROWS[0]} dir={-1} />
        <LogoRow logos={ROWS[1]} dir={1} />
        <LogoRow logos={ROWS[2]} dir={-1} />
      </div>
    </section>
  )
}
