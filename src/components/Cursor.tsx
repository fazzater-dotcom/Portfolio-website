import { useEffect, useRef } from 'react'

// Elements that make the cursor grow on hover.
const HOVER_SELECTOR = 'a, button, [data-cursor-hover]'
// Number of segments in the emitter-style trailing tail (shorter = fades earlier).
const TRAIL_LENGTH = 9

/**
 * Custom cursor: an instant white dot + a black ring that trails with easing and
 * morphs into a circle-with-plus over clickable elements. The dot also emits a
 * tapering "comet" tail (canvas), inspired by Codrops' EmitterCursor demo 4.
 * Auto-disables on touch / coarse-pointer devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    if (!dot || !ring || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.body.classList.add('has-custom-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let hovering = false
    let hoverAmt = 0 // eased 0→1; fades the tail out over clickable elements

    // Trailing points: each chases the one before it, forming a tapering tail.
    const pts = Array.from({ length: TRAIL_LENGTH }, () => ({ x: mx, y: my }))

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Start both at centre so there's no flash in the top-left corner.
    dot.style.left = ring.style.left = `${mx}px`
    dot.style.top = ring.style.top = `${my}px`

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = `${mx}px`
      dot.style.top = `${my}px`
    }

    const tick = () => {
      // Ring eases toward the pointer (0.11 = trail amount).
      rx += (mx - rx) * 0.11
      ry += (my - ry) * 0.11
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`

      // Emitter tail: head chases the pointer, each segment chases the previous.
      pts[0].x += (mx - pts[0].x) * 0.45
      pts[0].y += (my - pts[0].y) * 0.45
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.45
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.45
      }

      hoverAmt += ((hovering ? 1 : 0) - hoverAmt) * 0.2
      const alpha = 1 - hoverAmt

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const head = pts[0]
      const tail = pts[pts.length - 1]
      const dist = Math.hypot(head.x - tail.x, head.y - tail.y)
      if (!reduceMotion && alpha > 0.01 && dist > 1) {
        // One continuous line at constant width; opacity fades toward the tail.
        const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y)
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(head.x, head.y)
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
        ctx.stroke()
      }

      raf = requestAnimationFrame(tick)
    }

    const setHover = (on: boolean) => {
      hovering = on
      dot.classList.toggle('hover', on)
      ring.classList.toggle('hover', on)
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(HOVER_SELECTOR)) setHover(true)
    }
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as Element | null
      if (to?.closest?.(HOVER_SELECTOR)) return
      setHover(false)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('resize', resize)
    tick()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('resize', resize)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
