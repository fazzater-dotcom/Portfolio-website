type Props = {
  text: string
  /** Seconds of delay between adjacent letters — controls how fast the wave travels. */
  step?: number
}

/**
 * Renders text as individual letters so a stadium-style "Olé" wave can ripple
 * across them on hover. The wave itself lives in CSS (`.nav-wave:hover .wave-letter`),
 * driven by the per-letter `animation-delay` set here.
 */
export default function WaveText({ text, step = 0.05 }: Props) {
  return (
    <span className="wave-text" aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="wave-letter"
          style={{ animationDelay: `${i * step}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
