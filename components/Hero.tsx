export default function Hero() {
  return (
    <section className="hero">
      {/* Full-width background video */}
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/homevideo.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-h1 ws" id="hH1">
          Where ancient<br />medicine<br /><em>meets you.</em>
        </h1>

        <p className="hero-sub">
          Personalised Ayurvedic care rooted in authentic Kerala tradition. Every treatment
          begins with understanding who you are — not just what ails you.
        </p>

        <div className="hero-actions">
          <a href="#treatments" className="btn btn-gold">
            Explore Treatments
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

    </section>
  )
}
