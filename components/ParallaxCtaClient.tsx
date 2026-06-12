'use client'

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
          <button className="btn btn-gold" onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}>
            {bookFree}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href={telHref} className="btn btn-ghost">{phone}</a>
        </div>
      </div>
    </div>
  )
}
