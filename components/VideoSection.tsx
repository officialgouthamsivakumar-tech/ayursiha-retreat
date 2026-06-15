import { getSettings } from '@/lib/db'
import Btn from './Btn'

export default async function VideoSection() {
  const settings = getSettings()
  const hc = settings.homeContent

  return (
    <section className="video-section">
      <div className="wrap">
        <div className="video-section-header">
          <p className="label r">{hc.videoLabel}</p>
          <h2 className="display r">{hc.videoHeading}</h2>
          <p className="r">{hc.videoDescription}</p>
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
          <Btn variant="outline" href={settings.youtube} external chevron={false}>
            {hc.videoViewMore}
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
              <path d="M5 2h7v7M12 2L4 10" />
            </svg>
          </Btn>
        </div>
      </div>
    </section>
  )
}
