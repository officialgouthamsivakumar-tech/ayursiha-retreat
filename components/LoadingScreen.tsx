'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible')

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 1800)
    const doneTimer = setTimeout(() => setPhase('done'), 2600)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`loader ${phase === 'fading' ? 'loader--fade' : ''}`}>
      <div className="loader-logo">
        <Image
          src="/logo.png"
          alt="Ayursiha Retreat"
          width={320}
          height={137}
          priority
          className="loader-img"
        />
        <div className="loader-line" />
      </div>
    </div>
  )
}
