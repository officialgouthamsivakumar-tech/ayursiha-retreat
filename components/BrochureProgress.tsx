'use client'
import { useEffect, useRef } from 'react'

/** Thin gold bar at the top of the brochure that fills as you scroll. */
export default function BrochureProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="bro-progress" aria-hidden="true"><div ref={bar} /></div>
}

export function BrochurePrintBtn() {
  return (
    <button type="button" className="bro-print" onClick={() => window.print()}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M4 6V2h8v4M4 12H2.5V6.5h11V12H12M4 9.5h8V14H4z" />
      </svg>
      Save as PDF
    </button>
  )
}
