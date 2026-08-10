import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: CSSProperties
}

interface CharProps {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}

function Char({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* Invisible placeholder reserves layout space. */}
      <span style={{ opacity: 0 }}>{char}</span>
      {/* Animated span painted on top. */}
      <motion.span style={{ position: 'absolute', left: 0, top: 0, opacity }}>
        {char}
      </motion.span>
    </span>
  )
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')
  const total = text.length
  let index = 0

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        // Keep each word as an inline-block unit so wrapping stays natural.
        const wordNode = (
          <span key={`w-${wi}`} style={{ display: 'inline-block' }}>
            {word.split('').map((char, ci) => {
              const start = index / total
              const end = (index + 1) / total
              index += 1
              return (
                <Char
                  key={`c-${wi}-${ci}`}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              )
            })}
          </span>
        )
        // Advance the counter for the space between words.
        index += 1
        return (
          <span key={`ws-${wi}`}>
            {wordNode}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </p>
  )
}
