'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useScrollPosition } from '@/hooks/useScrollPosition'

function scrollToEl(id: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const t = useTranslations('nav')
  const solid = useScrollPosition(50)
  const [hideCta, setHideCta] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const cta = document.getElementById('cta')
    if (!cta) return
    const io = new IntersectionObserver(([e]) => setHideCta(e.isIntersecting), { threshold: 0.05 })
    io.observe(cta)
    return () => io.disconnect()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav id="nav" className={solid ? 'solid' : ''}>
        <a href={isHome ? undefined : '/'} className="nav-brand" style={isHome ? { cursor: 'default' } : undefined}>
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
            <li><a href="/treatments" className={pathname === '/treatments' || pathname.startsWith('/treatments/') ? 'nav-active' : ''}>{t('treatments')}</a></li>
            <li><a href="/experience" className={pathname === '/experience' ? 'nav-active' : ''}>{t('experience')}</a></li>
            <li><a href="/about" className={pathname === '/about' ? 'nav-active' : ''}>{t('about')}</a></li>
            <li><a href={isHome ? '#testi' : '/#testi'} onClick={isHome ? scrollToEl('testi') : undefined}>{t('stories')}</a></li>
          </ul>
          <button
            className={`btn btn-gold nav-cta${hideCta ? ' nav-cta--hidden' : ''}`}
            onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}
          >
            {t('bookConsultation')}
          </button>
          <button
            className={`nav-menu-btn${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-drawer-backdrop" onClick={close} />
        <div className="nav-drawer-panel">
          <ul className="nav-drawer-links">
            <li>
              <a href="/treatments" className={pathname.startsWith('/treatments') ? 'nav-active' : ''} onClick={close}>
                {t('treatments')}
              </a>
            </li>
            <li>
              <a href="/experience" className={pathname === '/experience' ? 'nav-active' : ''} onClick={close}>
                {t('experience')}
              </a>
            </li>
            <li>
              <a href="/about" className={pathname === '/about' ? 'nav-active' : ''} onClick={close}>
                {t('about')}
              </a>
            </li>
            <li>
              <a
                href={isHome ? '#testi' : '/#testi'}
                onClick={isHome ? (e) => { close(); scrollToEl('testi')(e) } : close}
              >
                {t('stories')}
              </a>
            </li>
          </ul>
          <button
            className="btn btn-gold nav-drawer-book"
            onClick={() => { close(); window.dispatchEvent(new CustomEvent('openBooking')) }}
          >
            {t('bookConsultation')}
          </button>
          <div className="nav-drawer-contacts">
            <span>{t('phone')}</span>
            <span>{t('email')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
