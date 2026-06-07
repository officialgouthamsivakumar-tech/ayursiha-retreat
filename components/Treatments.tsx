import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getTreatments } from '@/lib/db'

export default async function Treatments() {
  const [t, treatments] = await Promise.all([getTranslations('treatments'), getTreatments()])

  return (
    <section className="treatments" id="treatments">
      <div className="treat-header-wrap">
        <p className="label r">{t('label')}</p>
        <h2 className="display treat-heading ws r" id="treatH2">
          {t('heading')}
        </h2>
        <p className="treat-subhead r">{t('subhead')}</p>
      </div>

      <div className="treat-grid">
        {treatments.slice(0, 3).map(({ idx, slug, name, body, image }) => (
          <Link
            key={idx}
            href={`/treatments/${slug}`}
            className="t-card r t-card--bg"
            style={{ backgroundImage: `url(${image})` }}
          >
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
        <Link href="/treatments" className="btn btn-gold">
          {t('viewAll')}
          <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron">
            <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
