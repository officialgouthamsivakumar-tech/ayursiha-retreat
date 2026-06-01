export default function MapSection() {
  return (
    <section className="map-section">
      {/* Full-width map */}
      <div className="map-embed">
        <iframe
          src="https://maps.google.com/maps?q=CAS+Group+Holdings%2C+11%2F310%2C+Thuruth%2C+Aluva%2C+Chowara%2C+Kerala+683101&output=embed"
          width="100%" height="100%"
          style={{ border: 0 }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ayursiha Location"
        />
      </div>

      {/* Info bar below map */}
      <div className="map-bar">
        <div className="map-bar-brand r">
          <p className="label" style={{ color: 'var(--amber)' }}>Find Us</p>
          <h3 className="map-bar-name">Ayursiha Retreat</h3>
        </div>
        <div className="map-bar-details">
          <div className="map-bar-item r">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>11/310 Thuruth, Aluva, Chowara, Kerala 683101</span>
          </div>
          <div className="map-bar-item r">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.08 6.08l1.1-1.1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>+91 487 244 0000</span>
          </div>
          <div className="map-bar-item r">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Mon – Sat · 8 am – 7 pm</span>
          </div>
        </div>
        <a href="#cta" className="btn btn-gold r">
          Book Consultation
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 7h10M8 3l4 4-4 4" />
          </svg>
        </a>
      </div>
    </section>
  )
}
