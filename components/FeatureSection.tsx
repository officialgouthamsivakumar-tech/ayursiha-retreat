import React from 'react'
import { getTranslations } from 'next-intl/server'

export default async function FeatureSection() {
  const t = await getTranslations('feature')
  const details = t.raw('details') as string[]

  return (
    <section className="feature">
      <div className="feature-inner">

        <div className="feature-visual">
          <svg className="feature-art" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="250" rx="140" ry="200" stroke="#a87c35" strokeWidth=".6" opacity=".5"/>
            <ellipse cx="200" cy="250" rx="100" ry="145" stroke="#a87c35" strokeWidth=".5" opacity=".4"/>
            <ellipse cx="200" cy="250" rx="60"  ry="88"  stroke="#a87c35" strokeWidth=".7" opacity=".45"/>
            <line x1="200" y1="50"  x2="200" y2="450" stroke="#a87c35" strokeWidth=".5" opacity=".25"/>
            <line x1="60"  y1="250" x2="340" y2="250" stroke="#a87c35" strokeWidth=".5" opacity=".25"/>
            <circle cx="200" cy="250" r="8"  fill="#a87c35" opacity=".35"/>
            <circle cx="200" cy="250" r="24" stroke="#a87c35" strokeWidth=".7" opacity=".3"/>
            <path d="M200 130 C220 175 220 220 200 250 C180 220 180 175 200 130Z" stroke="#a87c35" strokeWidth=".7" opacity=".4"/>
            <path d="M200 370 C220 325 220 280 200 250 C180 280 180 325 200 370Z" stroke="#a87c35" strokeWidth=".7" opacity=".4"/>
            <path d="M320 250 C275 230 230 230 200 250 C230 270 275 270 320 250Z" stroke="#a87c35" strokeWidth=".7" opacity=".4"/>
            <path d="M80 250 C125 230 170 230 200 250 C170 270 125 270 80 250Z"  stroke="#a87c35" strokeWidth=".7" opacity=".4"/>
          </svg>
        </div>

        <div className="feature-content">
          <p className="label r">{t('label')}</p>
          <h2 className="display feature-heading ws r" id="featH2">
            {t('heading')}
          </h2>
          <p className="feature-body r">{t('body1')}</p>
          <p className="feature-body r">{t('body2')}</p>
          <div className="feature-details stagger">
            {details.map((d, i) => (
              <div key={i} className="feature-detail r" style={{ '--i': i } as React.CSSProperties}>
                {d}
              </div>
            ))}
          </div>
          <a href="#cta" className="btn btn-dark r">
            {t('cta')}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

      </div>
    </section>
  )
}
