'use client'
import { useTranslations } from 'next-intl'

export default function ParallaxCta() {
  const t = useTranslations('parallaxCta')

  return (
    <div className="pcta" id="cta">
      <div className="pcta-bg" id="pctaBg" />
      <div className="pcta-body">
        <p className="label r" style={{ color: 'var(--amber)' }}>{t('label')}</p>
        <h2 className="pcta-h ws r" id="ctaH2">
          {t('headingLine1')}<br /><em>{t('headingLine2')}</em>
        </h2>
        <p className="pcta-sub r">{t('sub')}</p>
        <div className="pcta-row r">
          <button className="btn btn-gold" onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}>
            {t('bookFree')}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href={`tel:${t('call').replace(/\s/g, '')}`} className="btn btn-ghost">{t('call')}</a>
        </div>
      </div>
    </div>
  )
}
