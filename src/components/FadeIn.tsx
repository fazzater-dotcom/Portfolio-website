import { useMemo } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FadeInProps {
  children: ReactNode
  /** Element type to render (e.g. 'div', 'nav', 'h1', 'p'). Defaults to 'div'. */
  as?: ElementType
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: CSSProperties
}

export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.9,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  // motion.create() builds a motion-enabled component for a dynamic element type.
  const MotionTag = useMemo(() => motion.create(as), [as])

  // The entrance animation is driven by requestAnimationFrame, which is paused
  // while the document is hidden (a background tab, or a preview pane that isn't
  // displayed). In that state the animation never advances, so relying on it to
  // reveal content would leave the whole page stuck at opacity:0 (blank). If the
  // page isn't visible at mount, start already-revealed instead of animating in.
  const pageVisible =
    typeof document === 'undefined' || document.visibilityState === 'visible'

  return (
    <MotionTag
      className={className}
      style={style}
      initial={pageVisible ? { opacity: 0, x, y } : { opacity: 1, x: 0, y: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      // once: false → the reveal replays every time the element re-enters view.
      viewport={{ once: false, amount: 0.25 }}
      // Smooth ease-out (easeOutExpo-like) for a soft, gliding motion-design feel.
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
