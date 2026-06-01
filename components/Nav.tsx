'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

function scrollTo(id: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Nav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav id="nav" className={solid ? 'solid' : ''}>
      <a href="#" className="nav-brand">
        <Image
          src="/logo.png"
          alt="Ayursiha Retreat"
          width={300}
          height={128}
          className="nav-logo"
          priority
        />
      </a>

      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#treatments" onClick={scrollTo('treatments')}>Treatments</a></li>
          <li><a href="#process"    onClick={scrollTo('process')}>Journey</a></li>
          <li><a href="#testi"      onClick={scrollTo('testi')}>Stories</a></li>
        </ul>
        <a href="#cta" className="btn btn-gold nav-cta" onClick={scrollTo('cta')}>
          Book Consultation
        </a>
      </div>
    </nav>
  )
}
