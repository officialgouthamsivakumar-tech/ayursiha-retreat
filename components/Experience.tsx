const highlights = [
  {
    n: '01',
    title: 'Arrive & Assess',
    body: 'Your journey begins with a private consultation — pulse diagnosis, tongue analysis, and a full review of your constitution and history.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
  },
  {
    n: '02',
    title: 'Your Personal Plan',
    body: 'Every therapy, herb, and dietary guideline is prescribed specifically for you. No shared protocols. No templates.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
  },
  {
    n: '03',
    title: 'Daily Treatments',
    body: 'Unhurried, immersive sessions in our purpose-built suites — administered by certified practitioners trained in classical Kerala Ayurveda.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
  {
    n: '04',
    title: 'Lasting Restoration',
    body: 'Herbal protocols, dietary guidance, and follow-up consultations ensure your healing continues long after you leave.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
]

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="wrap">
        <div className="exp-hd">
          <p className="label r">The Ayursiha Experience</p>
          <h2 className="display exp-heading r ws" id="expH2">
            What your stay looks like
          </h2>
        </div>

        <div className="exp-grid">
          {highlights.map(({ n, title, body, image }) => (
            <div key={n} className="exp-card r" style={{ backgroundImage: `url(${image})` }}>
              <span className="exp-card-n">{n}</span>
              <div className="exp-card-overlay">
                <div className="exp-card-content">
                  <div className="exp-card-title">{title}</div>
                  <p className="exp-card-text">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
