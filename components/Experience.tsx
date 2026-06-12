import Image from 'next/image'
import { getSettings } from '@/lib/db'

const cards = [
  { n: '01', title: 'Arrive & Assess',      body: 'Your journey begins with a private consultation — pulse diagnosis, tongue analysis, and a full review of your constitution and history.' },
  { n: '02', title: 'Your Personal Plan',   body: 'Every therapy, herb, and dietary guideline is prescribed specifically for you. No shared protocols. No templates.' },
  { n: '03', title: 'Daily Treatments',     body: 'Unhurried, immersive sessions in our purpose-built suites — administered by certified practitioners trained in classical Kerala Ayurveda.' },
  { n: '04', title: 'Lasting Restoration',  body: 'Herbal protocols, dietary guidance, and follow-up consultations ensure your healing continues long after you leave.' },
]

export default async function Experience() {
  const settings = getSettings()
  const images = settings.experienceImages ?? []

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
          {cards.map(({ n, title, body }, i) => {
            const img = images[i] || ''
            return (
              <div key={n} className="exp-card r">
                {img && (
                  <Image
                    src={img}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    unoptimized={img.startsWith('/api/')}
                  />
                )}
                <span className="exp-card-n">{n}</span>
                <div className="exp-card-overlay">
                  <div className="exp-card-content">
                    <div className="exp-card-title">{title}</div>
                    <p className="exp-card-text">{body}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
