import React from 'react'

function IndiaFlag() {
  const cx = 15, cy = 10, outerR = 2.8, innerR = 0.6
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
    }
  })
  return (
    <svg viewBox="0 0 30 20" className="pkh-flag" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0"     width="30" height="6.67" fill="#FF9933" />
      <rect x="0" y="6.67"  width="30" height="6.66" fill="#FFFFFF" />
      <rect x="0" y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#000080" strokeWidth="0.45" />
      <circle cx={cx} cy={cy} r={innerR * 0.6} fill="#000080" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#000080" strokeWidth="0.28" />
      ))}
    </svg>
  )
}

export default function PrakritiHighlight() {
  return (
    <section className="pkh" id="prakriti">

      {/* Credential strip */}
      <div className="pkh-strip">
        <div className="pkh-strip-inner wrap">
          <IndiaFlag />
          <span className="pkh-strip-sep" />
          <span className="pkh-strip-text">Government of India</span>
          <span className="pkh-strip-dot" />
          <span className="pkh-strip-text">Ministry of AYUSH</span>
          <span className="pkh-strip-dot" />
          <span className="pkh-strip-text pkh-strip-highlight">Official Prakriti Assessment</span>
        </div>
      </div>

      {/* Main content */}
      <div className="pkh-body-wrap wrap">
        <div className="pkh-content">

          <h2 className="display pkh-heading ws r" id="pkhH2">
            We conduct the<br />
            <em>official Prakriti</em><br />
            Assessment
          </h2>

          <div className="pkh-rule r" />

          <p className="pkh-body r">
            Prakriti — your unique psycho-physical constitution — is the foundation of all
            Ayurvedic treatment. At Ayursiha, we use the validated assessment framework
            established by the Ministry of AYUSH to determine your precise doshic profile
            before any treatment is prescribed.
          </p>

          <div className="pkh-actions r">
            <a href="/#cta" className="btn btn-gold">
              Book Your Assessment
              <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a
              href="https://prakriti.ayush.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn pkh-outline-btn"
            >
              AYUSH Official Portal
              <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>

        </div>
      </div>

    </section>
  )
}
