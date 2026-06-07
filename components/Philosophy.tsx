import React from 'react'
import { getTranslations } from 'next-intl/server'
import StatCounter from '@/components/StatCounter'
import { pillars, stats } from '@/lib/philosophy'

function IndiaFlag() {
  const cx = 15, cy = 10, outerR = 2.8, innerR = 0.6
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
    }
  })
  return (
    <svg viewBox="0 0 30 20" className="pkh-flag" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0"     width="30" height="6.67" fill="#FF9933" />
      <rect x="0" y="6.67"  width="30" height="6.66" fill="#FFFFFF" />
      <rect x="0" y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#000080" strokeWidth="0.45" />
      <circle cx={cx} cy={cy} r={innerR * 0.6} fill="#000080" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#000080" strokeWidth="0.28" />
      ))}
    </svg>
  )
}

export default async function Philosophy() {
  const t = await getTranslations('philosophy')

  return (
    <section className="philosophy" id="philosophy">
      <div className="wrap">
        <div className="phil-inner">

          <div className="phil-left">
            <p className="label rl">{t('label')}</p>
            <blockquote className="phil-quote rl" style={{ marginTop: '1rem' }}>
              {t('quote')}
            </blockquote>
            <div className="phil-stats stagger">
              {stats.map(({ n, l }, i) => (
                <div key={l} className="phil-stat rl" style={{ '--i': i } as React.CSSProperties}>
                  <StatCounter value={n} />
                  <span className="phil-stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="phil-right">
            <p className="label rr">{t('sectionLabel')}</p>
            <h2 className="display phil-heading ws rr" id="philH2">
              {t('heading')}
            </h2>
            <p className="phil-body rr">{t('body1')}</p>
            <p className="phil-body rr">
              Every consultation begins with a comprehensive <strong className="phil-prakriti-inline">Prakriti assessment</strong> — your unique
              doshic constitution. From there, every therapy, every herb, every dietary
              recommendation is calibrated to you alone. There are no templates here.
            </p>
            <div className="phil-prakriti rr">
              <div className="phil-prakriti-body">
                <strong className="phil-prakriti-heading">{t('prakritiHeading')}</strong>
                <span className="phil-prakriti-gov-label">
                  <IndiaFlag />
                  {t('prakritiGovLabel')}
                </span>
                <p className="phil-prakriti-text">{t('prakritiText')}</p>
                <a
                  href="https://prakriti.ayush.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="phil-prakriti-link"
                >
                  {t('prakritiLink')}
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 2h7v7M12 2L4 10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>


      </div>
    </section>
  )
}
