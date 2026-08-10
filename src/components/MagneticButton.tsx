import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'

type Props = {
  as?: 'a' | 'button'
  href?: string
  download?: string
  target?: string
  rel?: string
  'aria-label'?: string
  className?: string
  children: ReactNode
  /** Fraction of the cursor-to-center distance the whole button drifts. */
  buttonStrength?: number
  /** Fraction the label drifts — larger than buttonStrength gives parallax depth. */
  textStrength?: number
}

/**
 * Cuberto/Codrops "Demo 4" style magnetic button: the button eases toward the
 * cursor, the label parallaxes a touch more, and a circular filler (in CSS)
 * sweeps up on hover with the text colour inverting. Pairs with the WaveText
 * Olé effect, which lives on the same element via the `nav-wave` class.
 */
export default function MagneticButton({
  as = 'a',
  href,
  download,
  target,
  rel,
  'aria-label': ariaLabel,
  className = '',
  children,
  buttonStrength = 0.4,
  textStrength = 0.6,
}: Props) {
  const rootRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const root = rootRef.current
    if (!root) return
    const r = root.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    root.style.transform = `translate3d(${x * buttonStrength}px, ${y * buttonStrength}px, 0)`
    if (textRef.current) {
      textRef.current.style.transform = `translate3d(${x * buttonStrength * textStrength}px, ${y * buttonStrength * textStrength}px, 0)`
    }
  }

  const handleLeave = () => {
    if (rootRef.current) rootRef.current.style.transform = 'translate3d(0, 0, 0)'
    if (textRef.current) textRef.current.style.transform = 'translate3d(0, 0, 0)'
  }

  const Tag = as as 'a'
  const extra = as === 'a' ? { href, download, target, rel } : { type: 'button' as const }

  return (
    <Tag
      ref={rootRef}
      className={`mag-btn ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      {...extra}
    >
      <span className="mag-btn__filler" aria-hidden="true" />
      <span ref={textRef} className="mag-btn__text">
        {children}
      </span>
    </Tag>
  )
}
