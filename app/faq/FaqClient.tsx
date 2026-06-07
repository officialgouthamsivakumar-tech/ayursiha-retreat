'use client'

import { useState } from 'react'
import type { FaqCategory } from '@/types'

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <svg className="faq-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 5l5 5 5-5" />
        </svg>
      </button>
      {open && <p className="faq-a">{a}</p>}
    </div>
  )
}

export default function FaqClient({ faqs }: { faqs: FaqCategory[] }) {
  return (
    <>
      {faqs.map(({ category, items }) => (
        <div key={category} className="faq-group">
          <h2 className="faq-category">{category}</h2>
          <div className="faq-list">
            {items.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      ))}

      <div className="faq-cta" id="cta">
        <p className="faq-cta-text">Still have questions? Our team is happy to help.</p>
        <button
          className="btn btn-gold"
          onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}
        >
          Book a Consultation
          <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron">
            <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  )
}
