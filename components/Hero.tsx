import { getSettings } from '@/lib/db'

export default async function Hero() {
  const settings = getSettings()
  const hc = settings.homeContent

  const videoSrc = settings.heroVideo || '/homevideo.mp4'
  const videoType = videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'

  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src={videoSrc} type={videoType} />
      </video>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-h1 ws" id="hH1">
          {hc.heroHeadingLine1}<br />{hc.heroHeadingLine2}<br /><em>{hc.heroHeadingLine3}</em>
        </h1>

        <p className="hero-sub">{hc.heroSub}</p>

        <div className="hero-actions">
          <a href="#treatments" className="btn btn-gold">
            {hc.heroCta}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>

      <button type="button" className="hero-scroll-indicator" id="heroScrollBtn">
        <span className="hero-scroll-label">Scroll Down</span>
        <svg viewBox="0 0 24 38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="38">
          <rect x="1" y="1" width="22" height="36" rx="11" ry="11" />
          <line x1="12" y1="8" x2="12" y2="14" className="hero-scroll-wheel" />
        </svg>
      </button>
    </section>
  )
}
