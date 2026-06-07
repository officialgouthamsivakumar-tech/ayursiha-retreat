export default function VideoSection() {
  return (
    <section className="video-section">
      <div className="wrap">
        <div className="video-section-header">
          <p className="label r">Inside Ayursiha</p>
          <h2 className="display r">Experience the healing environment</h2>
          <p className="r">
            A glimpse into the treatments, spaces, and care that define life at Ayursiha —
            before you arrive.
          </p>
        </div>
        <div className="vs-grid">
          {[
            { id: 'hfMoBrBPGuk', title: 'Ayurveda Wellness and Yoga at Ayursiha' },
            { id: 'aNYqqmV1U94', title: 'Explore Ayursiha Hospital: Holistic Healing and Wellness' },
            { id: 'jALuXZMXUWE', title: 'Ayursiha Hospital Promo — Best Ayurveda & Unani Wellness' },
            { id: 'khNWIwwEenM', title: 'Tranquil Evenings of Healing at Ayursiha' },
          ].map(({ id, title }) => (
            <div key={id} className="video-frame-wrap r">
              <iframe
                src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
        <div className="vs-more r">
          <a
            href="https://www.youtube.com/@ayursiha"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View More on YouTube
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
              <path d="M5 2h7v7M12 2L4 10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
