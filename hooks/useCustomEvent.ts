'use client'
import { useEffect } from 'react'

export function useCustomEvent(eventName: string, handler: () => void): void {
  useEffect(() => {
    window.addEventListener(eventName, handler)
    return () => window.removeEventListener(eventName, handler)
  }, [eventName, handler])
}
