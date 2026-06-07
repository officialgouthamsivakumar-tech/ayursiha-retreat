'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Props {
  value: string
  duration?: number
}

function parseValue(raw: string): { number: number; suffix: string } {
  const match = raw.replace(/,/g, '').match(/^([\d.]+)(.*)$/)
  if (!match) return { number: 0, suffix: raw }
  return { number: parseFloat(match[1]), suffix: match[2] }
}

function formatNumber(n: number, original: string): string {
  if (original.includes(',')) return Math.round(n).toLocaleString('en-IN')
  return String(Math.round(n))
}

export default function StatCounter({ value, duration = 1800 }: Props) {
  const { number: target, suffix } = parseValue(value)
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const pathname = usePathname()

  // Computed from props — correct even inside a Router-Cache-frozen tree.
  // Stored as data-final-v so the CSS ::after can read it via attr().
  const finalText = formatNumber(target, value) + suffix

  // Pre-paint: show final value immediately on return visits.
  // Two signals:
  //   • is-returning  — inline <head> script sets this on hard-reload + popstate
  //   • parent .on    — ClientAnimations stamps this on SPA Link-click returns
  //                     (popstate never fires for Link clicks, so is-returning isn't set)
  // Browser-back with Router Cache: effects are frozen entirely — CSS ::after handles it.
  useLayoutEffect(() => {
    started.current = false
    const el = ref.current
    if (!el) return
    const animParent = el.closest('.rl,.r,.rr,.rs') as HTMLElement | null
    const returning =
      document.documentElement.classList.contains('is-returning') ||
      (animParent?.classList.contains('on') ?? false)
    if (returning) {
      setDisplay(formatNumber(target, value))
      started.current = true
    }
  }, [pathname, target, value])

  useEffect(() => {
    if (started.current) return
    const el = ref.current
    if (!el) return

    const animParent = el.closest('.rl,.r,.rr,.rs') as HTMLElement | null
    const returning =
      document.documentElement.classList.contains('is-returning') ||
      (animParent?.classList.contains('on') ?? false)

    // sessionStorage fallback: if the animation completed in a prior mount the
    // final value was stored here — use it instead of replaying the animation.
    const stored = sessionStorage.getItem(`stat:${value}`)

    if (returning || stored) {
      setDisplay(stored ?? formatNumber(target, value))
      started.current = true
      return
    }

    // First-time visitor: count up when element scrolls into view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        const start = performance.now()
        function step(now: number) {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(formatNumber(eased * target, value))
          if (progress < 1) {
            requestAnimationFrame(step)
          } else {
            // Persist so subsequent remounts show the final value without animation
            sessionStorage.setItem(`stat:${value}`, formatNumber(target, value))
          }
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.3, rootMargin: '0px 0px -5% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [pathname, target, duration, value])

  return (
    // data-final-v is read by CSS ::after (phil-stat-n rule in philosophy.css)
    // to display the correct value when html.is-returning is set and the React
    // tree is frozen — React's reconciliation can reset textContent but not ::after.
    <span
      ref={ref}
      data-final-v={finalText}
      className="phil-stat-n"
      style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}
    >
      {display}{suffix}
    </span>
  )
}
