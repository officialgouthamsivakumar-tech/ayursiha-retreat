'use client'
import { useEffect, useRef } from 'react'

export default function TestimonialsScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const raf = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let speed = 0.6 // px per frame

    function step() {
      if (!paused.current && el) {
        el.scrollLeft += speed
        // Loop: when we've scrolled past half (duplicate content), reset
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }
      raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)

    const pause = () => { paused.current = true }
    const resume = () => { paused.current = false }

    // Pause on hover and touch
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume)

    // Drag to scroll
    let isDragging = false
    let startX = 0
    let scrollStart = 0

    el.addEventListener('mousedown', (e) => {
      isDragging = true
      paused.current = true
      startX = e.pageX - el.offsetLeft
      scrollStart = el.scrollLeft
      el.style.cursor = 'grabbing'
    })
    el.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const x = e.pageX - el.offsetLeft
      el.scrollLeft = scrollStart - (x - startX)
    })
    el.addEventListener('mouseup', () => {
      isDragging = false
      paused.current = false
      el.style.cursor = 'grab'
    })
    el.addEventListener('mouseleave', () => {
      isDragging = false
    })

    return () => {
      cancelAnimationFrame(raf.current)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  return (
    <div className="testi-grid" ref={ref}>
      {children}
      {/* Duplicate children for seamless loop */}
      {children}
    </div>
  )
}
