import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getProject, getWorkBlocks } from '../data/projects'

// Real media is temporarily replaced with a placeholder while the work-page
// design is reworked. Flip this back to true to show the real workpages/<n>/
// media (or the legacy WV_<n> video) again — auto-discovery is untouched.
const SHOW_REAL_MEDIA = true

function close() {
  window.location.hash = '#/'
}

// An inline "TITLE:" heading — orange, medium weight, letters fade/slide up
// in a stagger as the popup opens (à la edgardavey.com's "Work" heading).
function TitleBlock({ text }: { text: string }) {
  return (
    <h2
      className="font-medium uppercase leading-[0.95] tracking-tight"
      style={{ fontSize: 'clamp(0.98rem, 2.38vw, 1.54rem)', color: '#e56b59' }}
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </h2>
  )
}

// Same bouncing-squares loader as the hero Preloader, scoped to one block.
function MediaLoader({ visible }: { visible: boolean }) {
  return (
    <div className={`media-loader${visible ? '' : ' media-loader--hidden'}`} aria-hidden="true">
      <div className="preloader__row">
        <span className="preloader__box" />
        <span className="preloader__box" />
        <span className="preloader__box" />
        <span className="preloader__box" />
      </div>
    </div>
  )
}

// A local video file — shows the loader until it can actually play, sized to
// its own resolution (min-height only, so it can still grow once loaded).
function LocalVideoBlock({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-full min-h-[220px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-black">
      <video
        src={url}
        className="w-full rounded-2xl bg-black"
        autoPlay
        muted
        controls
        playsInline
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
      />
      <MediaLoader visible={!loaded} />
    </div>
  )
}

// An embedded YouTube video — shows the loader until the iframe reports
// loaded (the closest signal available without the YouTube IFrame API).
function YouTubeBlock({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        title={title}
        allow="accelerated-video; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
      <MediaLoader visible={!loaded} />
    </div>
  )
}

export default function WorkModal({ id }: { id: string | null }) {
  const project = id ? getProject(id) : undefined
  // Prefer the new ordered workpages/<n>/ folder; fall back to the single
  // legacy WV_<n> video for works that only have that.
  const blocks = project
    ? getWorkBlocks(project.n).length > 0
      ? getWorkBlocks(project.n)
      : project.video
        ? [{ type: 'video' as const, url: project.video }]
        : []
    : []

  // Lock the page behind the modal from scrolling while it's open.
  useEffect(() => {
    if (!id) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [id])

  // Escape closes it, same as the backdrop/✕.
  useEffect(() => {
    if (!id) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id])

  return (
    <AnimatePresence>
      {id && (
        <>
          {/* Backdrop — dims the page behind, click the visible edges to close.
              z-[2000]: well above the Work carousel's own internal z-index
              (up to ~1000, for its card depth effect) so the modal always
              renders on top of it. */}
          <motion.div
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Card — near-fullscreen height, but narrower width (grows toward
              the edges only on small screens) so the dimmed page reads
              clearly on both sides, matching the reference. Its own bounding
              box doesn't reach the margin, so clicks there land on the
              backdrop beneath and close it. */}
          <motion.div
            className="no-scrollbar fixed inset-y-4 sm:inset-y-8 md:inset-y-12 inset-x-4 sm:inset-x-10 md:inset-x-[3%] lg:inset-x-[5%] xl:inset-x-[11%] z-[2001] overflow-y-auto rounded-3xl bg-[#0C0C0C] text-[#D7E2EA] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
              {!project ? (
                <div className="flex flex-col items-center justify-center gap-6 px-6 py-24">
                  <p className="uppercase tracking-wider">Project not found.</p>
                  <a
                    href="#/"
                    className="underline underline-offset-4 uppercase tracking-wider text-sm hover:opacity-70"
                  >
                    ← Back to work
                  </a>
                </div>
              ) : (
                <>
                  {/* Top bar */}
                  <div className="sticky top-0 z-10 bg-[#0C0C0C]/95 backdrop-blur px-5 sm:px-8 pt-5 pb-3 flex items-center justify-end">
                    <a
                      href="#/"
                      aria-label="Close"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D7E2EA]/25 flex items-center justify-center text-base sm:text-lg hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors"
                    >
                      ✕
                    </a>
                  </div>

                  {/* Media — an ordered stack of whatever's in this work's
                      WE_<n>/ folder: local video/images, embedded YouTube
                      links, inline title headings, and description blurbs —
                      any mix, in whatever order the numbering puts them */}
                  {SHOW_REAL_MEDIA && blocks.length > 0 ? (
                    // Keyed by project id: navigating directly between two
                    // different works' popups (without the modal fully
                    // closing) forces a fresh remount of every block — so
                    // title letters replay their entrance and each video's/
                    // YouTube's loader state resets, instead of React quietly
                    // reusing the previous work's already-settled instances.
                    <div key={project.id} className="px-5 sm:px-8 mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-6">
                      {blocks.map((b, i) => {
                        if (b.type === 'title') {
                          return <TitleBlock key={i} text={b.text} />
                        }
                        if (b.type === 'video') {
                          return <LocalVideoBlock key={i} url={b.url} />
                        }
                        if (b.type === 'image') {
                          return (
                            <img
                              key={i}
                              src={b.url}
                              alt=""
                              loading="lazy"
                              className="w-full rounded-2xl object-cover"
                            />
                          )
                        }
                        if (b.type === 'youtube') {
                          return <YouTubeBlock key={i} videoId={b.videoId} title={project.title} />
                        }
                        return (
                          <p key={i} className="font-light text-base sm:text-lg leading-relaxed text-[#D7E2EA]/80">
                            {b.text}
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    <div
                      className="mx-5 sm:mx-8 mt-6 sm:mt-8 rounded-2xl h-[38vh] sm:h-[46vh] flex items-center justify-center"
                      style={{ background: `linear-gradient(150deg, ${project.accent} 0%, #0c0c0c 130%)` }}
                    >
                      <span className="uppercase tracking-[0.2em] text-white/60 text-xs sm:text-sm">
                        Video placeholder
                      </span>
                    </div>
                  )}

                  <div className="px-5 sm:px-8 mt-10 sm:mt-14 pb-10">
                    <a
                      href="#/"
                      className="inline-block uppercase tracking-wider font-medium text-sm border border-[#D7E2EA]/30 rounded-full px-6 py-3 hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors"
                    >
                      ← All work
                    </a>
                  </div>
                </>
              )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
