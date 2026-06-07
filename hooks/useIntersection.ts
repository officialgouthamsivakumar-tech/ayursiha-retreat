'use client'
import { useEffect, useRef, useState } from 'react'

export function useIntersection(options?: IntersectionObserverInit): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null)
  const [intersecting, setIntersecting] = useState(false)
  // Capture options once — callers often pass object literals (new ref each render)
  const optionsRef = useRef(options)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), optionsRef.current)
    io.observe(el)
    return () => io.disconnect()
  }, []) // stable — IO created once on mount

  return [ref, intersecting]
}
