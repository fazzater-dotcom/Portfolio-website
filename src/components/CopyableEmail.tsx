import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for browsers/contexts without Clipboard API access.
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

/**
 * Plain, static, NON-clickable email text (no mailto — nothing should open
 * when clicked) with a one-click copy icon. Each click shows a small
 * "Copied" toast (green check) that fades in, holds, then fades out —
 * re-triggered fresh on every click via a remount key.
 */
export default function CopyableEmail({ email }: { email: string }) {
  const [toastKey, setToastKey] = useState(0)
  const [showToast, setShowToast] = useState(false)

  const handleCopy = () => {
    copyText(email)
    setShowToast(true)
    setToastKey((k) => k + 1)
  }

  return (
    <span className="relative inline-flex items-center gap-3 sm:gap-4">
      <span
        className="font-medium break-all sm:break-normal text-[#ECE6DA]"
        style={{ fontSize: 'clamp(1.15rem, 4vw, 2.4rem)' }}
      >
        {email}
      </span>

      <span className="relative inline-flex shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy email address"
          className="text-[#ECE6DA]/50 transition-colors duration-300 hover:text-[#ECE6DA]"
        >
          <Copy size={20} className="sm:w-6 sm:h-6" strokeWidth={1.7} />
        </button>

        {showToast && (
          <span
            key={toastKey}
            className="copy-toast pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-3"
            onAnimationEnd={() => setShowToast(false)}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-[#151515] ring-1 ring-white/10 shadow-lg px-3.5 py-1.5 whitespace-nowrap">
              <Check size={14} color="#57c07a" strokeWidth={2.5} />
              <span className="font-mono uppercase tracking-wider text-[0.65rem] text-[#ECE6DA]">
                Copied
              </span>
            </span>
          </span>
        )}
      </span>
    </span>
  )
}
