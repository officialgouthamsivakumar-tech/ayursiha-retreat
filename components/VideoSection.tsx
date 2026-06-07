import { getSettings } from '@/lib/db'

export default async function VideoSection() {
  const settings = getSettings()

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
          {settings.videos.map(({ id, title }) => (
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
          <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
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
