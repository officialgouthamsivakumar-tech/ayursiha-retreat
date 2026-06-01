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
        <div className="video-frame-wrap r">
          <iframe
            src="https://www.youtube.com/embed/hfMoBrBPGuk?rel=0&modestbranding=1"
            title="Ayurveda Wellness and Yoga"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
