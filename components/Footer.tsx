import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { treatments as treatmentData } from '@/lib/treatments'
import { getSettings } from '@/lib/db'

export default async function Footer() {
  const [t, settings] = await Promise.all([
    getTranslations('footer'),
    Promise.resolve(getSettings()),
  ])

  const centre = [
    { label: t('links.aboutUs'),   href: '/about' },
    { label: t('links.experience'), href: '/experience' },
    { label: t('links.stories'),   href: '/#testi' },
  ]

  return (
    <footer>
      <div className="wrap">
        <div className="ft-top">
          <div>
            <div className="ft-brand-name">{t('brandName')}</div>
            <div className="ft-brand-rule" />
            <p className="ft-brand-p">{t('brandDesc')}</p>
            <div className="ft-brand-contacts">
              <span>{settings.phone}</span>
              <span>{t('email')}</span>
              <span>{settings.address}</span>
              <span>{t('hours')}</span>
            </div>
          </div>

          <div>
            <div className="ft-col-h">{t('colTreatments')}</div>
            <ul className="ft-links">
              {treatmentData.map(tr => <li key={tr.slug}><Link href={`/treatments/${tr.slug}`}>{tr.name}</Link></li>)}
            </ul>
          </div>

          <div>
            <div className="ft-col-h">{t('colCentre')}</div>
            <ul className="ft-links">
              {centre.map(({ label, href }) => (
                <li key={label}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="ft-col-h">{t('colVisit')}</div>
            <ul className="ft-links">
              <li><Link href="/faq">{t('links.faqs')}</Link></li>
            </ul>
            <div className="ft-col-h" style={{ marginTop: '2rem' }}>{t('colFollow')}</div>
            <div className="ft-social">
              <a href={settings.instagram.startsWith('@') ? `https://instagram.com/${settings.instagram.slice(1)}` : settings.instagram} target="_blank" rel="noopener noreferrer" aria-label={t('social.instagram')} className="ft-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/ayursiha" target="_blank" rel="noopener noreferrer" aria-label={t('social.facebook')} className="ft-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label={t('social.youtube')} className="ft-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <span>{t('copyright')}</span>
          <span>{t('tagline')}</span>
        </div>
      </div>
    </footer>
  )
}
