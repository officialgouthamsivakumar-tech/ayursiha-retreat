'use client'
import Btn from './Btn'

interface Props {
  label: string
  headingLine1: string
  headingLine2: string
  sub: string
  bookFree: string
  phone: string
}

export default function ParallaxCtaClient({ label, headingLine1, headingLine2, sub, bookFree, phone }: Props) {
  const telHref = `tel:${phone.replace(/\s/g, '')}`

  return (
    <div className="pcta" id="cta">
      <div className="pcta-bg" id="pctaBg" />
      <div className="pcta-body">
        <p className="label r" style={{ color: 'var(--amber)' }}>{label}</p>
        <h2 className="pcta-h ws r" id="ctaH2">
          {headingLine1}<br /><em>{headingLine2}</em>
        </h2>
        <p className="pcta-sub r">{sub}</p>
        <div className="pcta-row r">
          <Btn variant="gold" onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}>{bookFree}</Btn>
          <Btn variant="ghost" href={telHref} chevron={false}>{phone}</Btn>
        </div>
      </div>
    </div>
  )
}
