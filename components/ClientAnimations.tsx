'use client'
import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClientAnimations() {
  const pathname = usePathname()

  // Runs synchronously before paint on every SPA navigation.
  // The inline <head> script owns is-returning for hard-reload + browser back (popstate).
  // This effect handles SPA forward navigation (Link clicks) where popstate doesn't fire.
  useLayoutEffect(() => {
    const key = `visited:${pathname}`
    const hasKey = !!sessionStorage.getItem(key)
    if (!hasKey) {
      document.documentElement.classList.remove('is-returning')
      return
    }
    // Home page return visits: stamp .on immediately to avoid flash of invisible content.
    // Inner pages re-animate on every visit — don't stamp here.
    if (pathname !== '/') return
    document.querySelectorAll<HTMLElement>('.r,.rl,.rr,.rs,.ws,.ps').forEach(el => {
      el.classList.add('on')
      el.querySelectorAll<HTMLElement>('.w').forEach(w => w.classList.add('on'))
    })
  }, [pathname])

  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual'

    const key = `visited:${pathname}`
    const returning = !!sessionStorage.getItem(key)

    // Scroll restoration for all pages
    if (returning) {
      const hash = window.location.hash
      if (hash) {
        const target = document.querySelector(hash) as HTMLElement | null
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      } else {
        window.scrollTo(0, 0)
      }
    } else {
      sessionStorage.setItem(key, '1')
      window.scrollTo(0, 0)
    }

    // Home page return visit: useLayoutEffect already stamped .on — skip animation setup
    if (returning && pathname === '/') return

    function splitWords(el: HTMLElement) {
      if (el.querySelector('.w')) return
      const html = el.innerHTML
      const parts = html.split(/(<br\s*\/?>|<em>[\s\S]*?<\/em>)/gi)
      el.innerHTML = parts
        .map(p => {
          if (/^<br/i.test(p)) return p
          if (/^<em>/i.test(p)) {
            const inner = p.replace(/<\/?em>/gi, '')
            return '<em>' + inner.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ') + '</em>'
          }
          return p.trim().split(/\s+/).filter(Boolean).map(w => `<span class="w">${w}</span>`).join(' ')
        })
        .join(' ')
    }

    function animWords(el: HTMLElement) {
      el.querySelectorAll<HTMLElement>('.w').forEach((w, i) => {
        setTimeout(() => w.classList.add('on'), i * 85)
      })
    }

    document.querySelectorAll<HTMLElement>('.ws').forEach(el => {
      if (el.id !== 'hH1') splitWords(el)
    })

    const hH1 = document.getElementById('hH1') as HTMLElement | null
    if (hH1) {
      splitWords(hH1)
      setTimeout(() => animWords(hH1), 650)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          setTimeout(() => {
            el.classList.add('on')
            if (el.classList.contains('ws')) animWords(el)
          }, i * 75)
          io.unobserve(el)
        })
      },
      { threshold: 0.14 }
    )

    document.querySelectorAll('.r,.rl,.rr,.rs,.ws,.ps').forEach(el => io.observe(el))

    const pxPairs: Array<{ s: HTMLElement | null; b: HTMLElement | null }> = [
      { s: document.getElementById('pq'),  b: document.getElementById('pqBg')   },
      { s: document.getElementById('cta'), b: document.getElementById('pctaBg') },
    ]

    function runParallax() {
      pxPairs.forEach(({ s, b }) => {
        if (!s || !b) return
        b.style.transform = `translateY(${s.getBoundingClientRect().top * 0.34}px)`
      })
    }

    const scrollBtn = document.getElementById('heroScrollBtn')
    const handleScrollBtn = () => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    scrollBtn?.addEventListener('click', handleScrollBtn)

    window.addEventListener('scroll', runParallax, { passive: true })
    runParallax()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', runParallax)
      scrollBtn?.removeEventListener('click', handleScrollBtn)
    }
  }, [pathname])

  return null
}
