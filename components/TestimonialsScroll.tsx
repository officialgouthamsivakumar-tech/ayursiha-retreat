'use client'
import { useEffect, useRef, useState } from 'react'

export default function TestimonialsScroll({
  children,
  count,
}: {
  children: React.ReactNode
  count: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const raf = useRef<number>(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function updateDot() {
      const half = el!.scrollWidth / 2
      const cardWidth = half / count
      const normalized = el!.scrollLeft % half
      setActive(Math.min(Math.round(normalized / cardWidth), count - 1))
    }
    el.addEventListener('scroll', updateDot, { passive: true })
    return () => el.removeEventListener('scroll', updateDot)
  }, [count])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(max-width: 768px)').matches) return

    let speed = 0.6

    function step() {
      if (!paused.current && el) {
        el.scrollLeft += speed
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0
      }
      raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)

    const pause = () => { paused.current = true }
    const resume = () => { paused.current = false }

    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume)

    let isDragging = false, startX = 0, scrollStart = 0

    el.addEventListener('mousedown', (e) => {
      isDragging = true; paused.current = true
      startX = e.pageX - el.offsetLeft; scrollStart = el.scrollLeft
      el.style.cursor = 'grabbing'
    })
    el.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      el.scrollLeft = scrollStart - (e.pageX - el.offsetLeft - startX)
    })
    el.addEventListener('mouseup', () => {
      isDragging = false; paused.current = false; el.style.cursor = 'grab'
    })
    el.addEventListener('mouseleave', () => { isDragging = false })

    return () => {
      cancelAnimationFrame(raf.current)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function goTo(index: number) {
    const el = ref.current
    if (!el) return
    paused.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    const cardWidth = (el.scrollWidth / 2) / count
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
    resumeTimer.current = setTimeout(() => { paused.current = false }, 1200)
  }

  function prev() { goTo((active - 1 + count) % count) }
  function next() { goTo((active + 1) % count) }

  return (
    <>
      <div className="testi-track">
        <button className="testi-arrow testi-arrow-prev" onClick={prev} aria-label="Previous testimonial">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="testi-grid" ref={ref} role="region" aria-label="Patient testimonials">
          {children}
          {children}
        </div>

        <button className="testi-arrow testi-arrow-next" onClick={next} aria-label="Next testimonial">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="testi-controls">
        <div className="testi-dots" role="tablist" aria-label="Testimonial indicators">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Testimonial ${i + 1}`}
              className={`testi-dot${i === active ? ' active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
