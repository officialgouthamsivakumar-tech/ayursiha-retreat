'use client'
import { useEffect } from 'react'

export default function ClientAnimations() {
  useEffect(() => {
    function splitWords(el: HTMLElement) {
      const html = el.innerHTML
      const parts = html.split(/(<br\s*\/?>|<em>[\s\S]*?<\/em>)/gi)
      el.innerHTML = parts
        .map(p => {
          if (/^<br/i.test(p)) return p
          if (/^<em>/i.test(p)) {
            const inner = p.replace(/<\/?em>/gi, '')
            return (
              '<em>' +
              inner
                .trim()
                .split(/\s+/)
                .map(w => `<span class="w">${w}</span>`)
                .join(' ') +
              '</em>'
            )
          }
          return p
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(w => `<span class="w">${w}</span>`)
            .join(' ')
        })
        .join(' ')
    }

    function animWords(el: HTMLElement) {
      el.querySelectorAll<HTMLElement>('.w').forEach((w, i) => {
        setTimeout(() => w.classList.add('on'), i * 85)
      })
    }

    // Split all .ws except hero heading (handled separately)
    document.querySelectorAll<HTMLElement>('.ws').forEach(el => {
      if (el.id !== 'hH1') splitWords(el)
    })

    // Hero heading: split then animate immediately
    const hH1 = document.getElementById('hH1') as HTMLElement | null
    if (hH1) {
      splitWords(hH1)
      setTimeout(() => animWords(hH1), 650)
    }

    // Scroll reveal
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

    // Parallax
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

    window.addEventListener('scroll', runParallax, { passive: true })
    runParallax()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', runParallax)
    }
  }, [])

  return null
}
