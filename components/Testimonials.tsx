import { getTranslations } from 'next-intl/server'
import TestimonialsScroll from '@/components/TestimonialsScroll'
import { getTestimonials } from '@/lib/db'

export default async function Testimonials() {
  const [t, testimonials] = await Promise.all([getTranslations('testimonials'), getTestimonials()])

  return (
    <section className="testi" id="testi">
      <div className="wrap">
        <div className="testi-hd">
          <h2 className="display testi-heading ws r" id="testiH2">
            {t('heading')}
          </h2>
          <p className="testi-aside r">{t('aside')}</p>
        </div>
      </div>
      <TestimonialsScroll count={testimonials.length}>
        {testimonials.map(({ quote, lang, name, role, initial, color, rtl }) => (
          <div key={name} className="tc">
            <div className="tc-top">
              <div className="tc-rating">★★★★★</div>
              <span className="tc-lang">{lang}</span>
            </div>
            <p className="tc-q" dir={rtl ? 'rtl' : 'ltr'} style={rtl ? { fontFamily: 'system-ui, sans-serif', lineHeight: 1.9 } : undefined}>{quote}</p>
            <div className="tc-meta">
              <div className="tc-av" style={{ background: color }}>{initial}</div>
              <div>
                <div className="tc-name" dir={rtl ? 'rtl' : 'ltr'}>{name}</div>
                <div className="tc-role">{role}</div>
              </div>
            </div>
          </div>
        ))}
      </TestimonialsScroll>

      <div className="testi-swipe-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span>{t('swipeHint')}</span>
      </div>
    </section>
  )
}
