export default function MapSection() {
  return (
    <section className="map-section">
      <div className="map-section-hd">
        <h2 className="map-section-title r">Find Us</h2>
      </div>
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

    </section>
  )
}
