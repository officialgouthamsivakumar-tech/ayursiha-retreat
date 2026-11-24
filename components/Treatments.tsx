import Link from 'next/link'
import Image from 'next/image'
import { getSettings, getTreatments } from '@/lib/db'
import Btn from './Btn'

export default async function Treatments() {
  const [settings, treatments] = await Promise.all([
    Promise.resolve(getSettings()),
    getTreatments(),
  ])
  const hc = settings.homeContent

  return (
    <section className="treatments" id="treatments">
      <div className="treat-header-wrap">
        <p className="label r">{hc.treatmentsLabel}</p>
        <h2 className="display treat-heading ws r" id="treatH2">
          {hc.treatmentsHeading}
        </h2>
        <p className="treat-subhead r">{hc.treatmentsSubhead}</p>
      </div>

      <div className="treat-grid">
        {treatments.slice(0, 3).map(({ idx, slug, name, body, image }) => (
          <Link
            key={idx}
            href={`/treatments/${slug}`}
            className="t-card r t-card--bg"
          >
            {image && (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="t-card-img"
                style={{ objectFit: 'cover' }}
                unoptimized={image.startsWith('/api/')}
              />
            )}
            <div className="t-card-bg-overlay" />
            <div className="t-card-inner">
              <div className="t-card-top">
                <span className="t-card-idx">{idx}</span>
              </div>
              <div className="t-card-bottom">
                <div className="t-card-name">{name}</div>
                <p className="t-card-body">{body}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="treat-view-all">
        <Btn variant="gold" href="/treatments">{hc.treatmentsViewAll}</Btn>
      </div>
    </section>
  )
}
