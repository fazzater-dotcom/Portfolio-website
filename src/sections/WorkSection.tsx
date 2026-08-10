import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'
import Magnet from '../components/Magnet'

const N = PROJECTS.length

// Card sizing — scales with the viewport so the active card stays large and
// prominent (like the reference), with neighbours peeking in at the edges.
function getDims() {
  const w = window.innerWidth
  const cardW = Math.round(Math.min(760, Math.max(230, w * 0.4)))
  const gap = Math.round(cardW * 0.2)
  return { cardW, gap }
}

type Mode = 'idle' | 'dragging' | 'inertia' | 'snapping' | 'scrolling'

export default function WorkSection() {
  const [dims, setDims] = useState(getDims)
  const cardH = Math.round(dims.cardW * 0.62)

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Motion state kept in refs so the animation loop never triggers re-renders.
  const spacingRef = useRef(dims.cardW + dims.gap)
  const totalRef = useRef((dims.cardW + dims.gap) * N)
  const state = useRef<{ mode: Mode; offset: number; velocity: number; target: number }>({
    mode: 'idle',
    offset: 0,
    velocity: 0,
    target: 0,
  })
  const wasDrag = useRef(false)

  // Keep spacing/total in sync with the current breakpoint.
  useEffect(() => {
    spacingRef.current = dims.cardW + dims.gap
    totalRef.current = (dims.cardW + dims.gap) * N
  }, [dims])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let raf = 0
    let dragStartX = 0
    let startOffset = 0
    let lastX = 0
    let pointerVel = 0
    let downX = 0
    let wheelTimer = 0

    const render = () => {
      const spacing = spacingRef.current
      const total = totalRef.current
      const offset = state.current.offset
      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        let x = i * spacing - offset
        x = ((x % total) + total) % total // → [0, total)
        if (x > total / 2) x -= total // → (-total/2, total/2]
        const d = Math.abs(x) / spacing
        const scale = Math.max(0.72, 1 - d * 0.12)
        const opacity = Math.max(0.12, 1 - d * 0.32)
        el.style.transform = `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`
        el.style.opacity = String(opacity)
        el.style.zIndex = String(1000 - Math.round(d * 10))
      }
    }

    const snapTarget = () => Math.round(state.current.offset / spacingRef.current) * spacingRef.current

    const loop = () => {
      const st = state.current
      if (st.mode === 'inertia') {
        st.offset += st.velocity
        st.velocity *= 0.94
        if (Math.abs(st.velocity) < 0.4) {
          st.target = snapTarget()
          st.mode = 'snapping'
        }
      } else if (st.mode === 'snapping') {
        st.offset += (st.target - st.offset) * 0.12
        if (Math.abs(st.target - st.offset) < 0.4) {
          st.offset = st.target
          st.mode = 'idle'
        }
      }
      render()
      raf = requestAnimationFrame(loop)
    }

    const onPointerDown = (e: PointerEvent) => {
      const st = state.current
      st.mode = 'dragging'
      dragStartX = e.clientX
      startOffset = st.offset
      lastX = e.clientX
      pointerVel = 0
      downX = e.clientX
      // No setPointerCapture here: move/up are already tracked on `window`
      // regardless, and capturing on the container redirects the resulting
      // click's target to the container itself — which silently breaks the
      // card's <a> navigation on a plain click (no drag involved).
    }
    const onPointerMove = (e: PointerEvent) => {
      if (state.current.mode !== 'dragging') return
      const dx = e.clientX - dragStartX
      state.current.offset = startOffset - dx
      pointerVel = e.clientX - lastX
      lastX = e.clientX
    }
    const onPointerUp = (e: PointerEvent) => {
      const st = state.current
      if (st.mode !== 'dragging') return
      // Judge drag-vs-click by NET displacement between press and release, not
      // by any momentary movement in between — trackpads/mice commonly drift a
      // few px during a plain click, which shouldn't cancel navigation.
      wasDrag.current = Math.abs(e.clientX - downX) > 10
      st.velocity = -pointerVel
      if (Math.abs(st.velocity) > 1.2) {
        st.mode = 'inertia'
      } else {
        st.target = snapTarget()
        st.mode = 'snapping'
      }
    }

    const onWheel = (e: WheelEvent) => {
      // Only take over horizontal intent; leave vertical page-scroll alone.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      state.current.mode = 'scrolling'
      state.current.offset += e.deltaX
      window.clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => {
        state.current.target = snapTarget()
        state.current.mode = 'snapping'
      }, 120)
    }

    const onResize = () => setDims(getDims())

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(wheelTimer)
    }
  }, [])

  const step = (dir: number) => {
    const st = state.current
    st.target = Math.round(st.offset / spacingRef.current) * spacingRef.current + dir * spacingRef.current
    st.mode = 'snapping'
  }

  const onCardClick = (e: React.MouseEvent) => {
    // Suppress navigation if the pointer was dragged rather than clicked.
    if (wasDrag.current) {
      e.preventDefault()
      wasDrag.current = false
    }
  }

  return (
    <section
      id="work"
      className="relative min-h-screen bg-[#0C0C0C] flex flex-col justify-center py-24 overflow-hidden"
    >
      {/* Heading */}
      <div className="px-6 md:px-10 mb-10 md:mb-14 flex items-end justify-between">
        <h2 className="text-[#D7E2EA] font-black uppercase leading-none tracking-tight text-[7vw] sm:text-[5vw] md:text-[3.5vw]">
          {'Work'.split('').map((ch, i) => (
            <Magnet key={i} padding={15} strength={2.5}>
              <span className="inline-block">{ch}</span>
            </Magnet>
          ))}
        </h2>
        <span className="hidden sm:block text-[#D7E2EA]/40 font-medium uppercase tracking-wider text-xs md:text-sm">
          Selected Work — {String(N).padStart(2, '0')}
        </span>
      </div>

      {/* Carousel track — `isolate` contains the cards' internal z-index
          stacking (up to ~1000, for the depth effect) so it can never leak
          above unrelated fixed overlays like WorkModal. */}
      <div
        ref={containerRef}
        className="relative isolate w-full touch-pan-y select-none"
        style={{ height: cardH }}
      >
        {PROJECTS.map((p, i) => (
          <a
            key={p.id}
            ref={(el) => (cardRefs.current[i] = el)}
            href={`#/work/${p.id}`}
            onClick={onCardClick}
            draggable={false}
            aria-label={p.title}
            className="work-card absolute left-1/2 top-1/2 block rounded-2xl overflow-hidden"
            style={{ width: dims.cardW, height: cardH }}
          >
            {/* Accent placeholder — always present underneath while the image loads */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(150deg, ${p.accent} 0%, #0c0c0c 120%)` }}
            />
            {/* Real thumbnail: lazy-loaded, fades in over the placeholder when ready */}
            {p.image && (
              <img
                src={p.image}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                ref={(el) => {
                  if (el && el.complete && el.naturalWidth > 0) el.classList.add('is-loaded')
                }}
                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                className="work-card__img absolute inset-0 h-full w-full object-cover"
              />
            )}
            {!p.image && (
              <span className="absolute top-3 left-4 text-white/85 font-black text-2xl md:text-3xl leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            {/* Bottom gradient + title */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white font-bold uppercase tracking-wide text-sm md:text-base leading-tight">
                {p.title}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Controls + hint */}
      <div className="px-6 md:px-10 mt-10 md:mt-14 flex items-center justify-between">
        <span className="text-[#D7E2EA]/40 font-medium uppercase tracking-wider text-[0.6rem] md:text-xs">
          Drag · swipe · click a card
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous project"
            className="w-10 h-10 rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] flex items-center justify-center transition-colors hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next project"
            className="w-10 h-10 rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] flex items-center justify-center transition-colors hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
