'use client'
import { useState } from 'react'
import YogaModal from './YogaModal'
import Btn from './Btn'

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

          <Btn variant="gold" className="r" onClick={() => setModalOpen(true)}>{cta}</Btn>
        </div>
      </section>
    </>
  )
}
