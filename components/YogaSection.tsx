'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import YogaModal from './YogaModal'

export default function YogaSection() {
  const t = useTranslations('yoga')
  const [modalOpen, setModalOpen] = useState(false)

  const highlights = [
    { value: t('highlights.dailyValue'),       label: t('highlights.dailyLabel') },
    { value: t('highlights.levelsValue'),      label: t('highlights.levelsLabel') },
    { value: t('highlights.personalisedValue'), label: t('highlights.personalisedLabel') },
  ]

  return (
    <>
      <YogaModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <section className="yoga-section">
        <div className="yoga-overlay" />

        <div className="yoga-content">
          <p className="label yoga-label r">{t('label')}</p>
          <h2 className="display yoga-heading ws r" id="yogaH2">
            {t('heading')}
          </h2>
          <p className="yoga-body r">{t('body')}</p>

          <div className="yoga-highlights r">
            {highlights.map(({ value, label }) => (
              <div key={label} className="yoga-hl">
                <span className="yoga-hl-value">{value}</span>
                <span className="yoga-hl-label">{label}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-gold r" onClick={() => setModalOpen(true)}>
            {t('cta')}
            <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </section>
    </>
  )
}
