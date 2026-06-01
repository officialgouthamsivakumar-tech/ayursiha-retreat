'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string   // e.g. "4,800+", "22", "97%"
  duration?: number
}

function parseValue(raw: string): { number: number; suffix: string } {
  const match = raw.replace(/,/g, '').match(/^([\d.]+)(.*)$/)
  if (!match) return { number: 0, suffix: raw }
  return { number: parseFloat(match[1]), suffix: match[2] }
}

function formatNumber(n: number, original: string): string {
  if (original.includes(',')) {
    return Math.round(n).toLocaleString('en-IN')
  }
  return String(Math.round(n))
}

export default function StatCounter({ value, duration = 1800 }: Props) {
  const { number: target, suffix } = parseValue(value)
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      io.disconnect()

      const start = performance.now()
      function step(now: number) {
        const progress = Math.min((now - start) / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(formatNumber(eased * target, value))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })

    io.observe(el)
    return () => io.disconnect()
  }, [target, duration, value])

  return (
    <span ref={ref} className="phil-stat-n" style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>
      {display}{suffix}
    </span>
  )
}
