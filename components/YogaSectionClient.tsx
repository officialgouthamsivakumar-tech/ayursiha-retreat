'use client'
import { useState } from 'react'
import YogaModal from './YogaModal'

interface YogaHighlight {
  value: string
  label: string
}

interface Props {
  label: string
  heading: string
  body: string
  cta: string
  bgImage: string
  highlights: YogaHighlight[]
}

export default function YogaSectionClient({ label, heading, body, cta, bgImage, highlights }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <YogaModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <section
        className="yoga-section"
        style={bgImage ? { backgroundImage: `url('${bgImage}')` } : undefined}
      >
        <div className="yoga-overlay" />

        <div className="yoga-content">
          <p className="label yoga-label r">{label}</p>
          <h2 className="display yoga-heading ws r" id="yogaH2">
            {heading}
          </h2>
          <p className="yoga-body r">{body}</p>

          <div className="yoga-highlights r">
            {highlights.map(({ value, label: hlLabel }) => (
              <div key={hlLabel} className="yoga-hl">
                <span className="yoga-hl-value">{value}</span>
                <span className="yoga-hl-label">{hlLabel}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-gold r" onClick={() => setModalOpen(true)}>
            {cta}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </section>
    </>
  )
}
