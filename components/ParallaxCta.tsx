export default function ParallaxCta() {
  return (
    <div className="pcta" id="cta">
      <div className="pcta-bg" id="pctaBg" />
      <div className="pcta-body">
        <p className="label r" style={{ color: 'var(--amber)' }}>Begin Your Journey</p>
        <h2 className="pcta-h ws r" id="ctaH2">
          Your body already<br /><em>knows how to heal.</em>
        </h2>
        <p className="pcta-sub r">
          Book a complimentary 30-minute introductory call with one of our physicians. No
          commitment — just a conversation about where you are and where you want to be.
        </p>
        <div className="pcta-row r">
          <a href="mailto:consult@ayursiha.com" className="btn btn-gold">
            Book Free Consultation
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </a>
          <a href="tel:+914872440000" className="btn btn-ghost">+91 487 244 0000</a>
        </div>
      </div>
    </div>
  )
}
