import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import { getPhysicians, getSettings } from '@/lib/db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Us — Ayursiha Retreat',
  description: 'Learn about Ayursiha Retreat — a Ministry of AYUSH registered Ayurvedic healing centre in Aluva, Kerala, practising classical Ayurveda since 2002.',
}

const pillarIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12"/>
    <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/>
    <path d="M12 12C12 12 17 9.5 19 7"/>
    <path d="M12 12C12 12 7 9.5 5 7"/>
  </svg>,
]

export default async function AboutPage() {
  const [physicians, settings] = await Promise.all([getPhysicians(), Promise.resolve(getSettings())])
  const ap    = settings.aboutPageContent
  const stats = settings.aboutStats.map(s => ({ value: s.n, label: s.l }))

  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* ── HERO BANNER ── */}
      <div className="au-hero">
        <Image
          src={settings.aboutHeroImage || '/abhyanga.jpg'}
          alt="Ayursiha Retreat"
          fill
          className="au-hero-img"
          priority
          unoptimized={settings.aboutHeroImage?.startsWith('/api/')}
        />
        <div className="au-hero-overlay" />
        <p className="label au-hero-label r">{ap.heroLabel}</p>
        <div className="au-hero-content">
          <h1 className="au-hero-h ws">{ap.heroHeading}</h1>
          <p className="au-hero-rule r" />
          <p className="au-hero-sub r">{ap.heroSub}</p>
        </div>
      </div>

      {/* ── BRAND INTRO ── */}
      <section className="au-intro">
        <div className="wrap au-intro-inner">
          <div className="au-intro-text">
            <p className="label rl">{ap.storyLabel}</p>
            <h2 className="au-section-h ws rl">
              {ap.storyHeadingLine1}<br /><em>{ap.storyHeadingLine2}</em>
            </h2>
            <p className="au-body rl">{ap.storyBody1}</p>
            <p className="au-body rl">{ap.storyBody2}</p>
            <p className="au-body rl">{ap.storyBody3}</p>
            <div className="au-intro-stats stagger">
              {stats.map(({ value, label }, i) => (
                <div key={label} className="au-stat r" style={{ '--i': i } as React.CSSProperties}>
                  <span className="au-stat-value">{value}</span>
                  <span className="au-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION QUOTE ── */}
      <section className="au-mission">
        <div className="au-mission-inner wrap--sm">
          <div className="au-mission-line rs" />
          <blockquote className="au-mission-quote r">{ap.missionQuote}</blockquote>
          <div className="au-mission-line rs" />
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="au-pillars">
        <div className="wrap">
          <div className="au-section-hd">
            <p className="label r">{ap.pillarsLabel}</p>
            <h2 className="au-section-h ws r">{ap.pillarsHeading}</h2>
          </div>
          <div className="au-pillars-grid stagger">
            {ap.pillars.map(({ title, body }, i) => (
              <div key={i} className="au-pillar r" style={{ '--i': i } as React.CSSProperties}>
                <div className="au-pillar-icon">{pillarIcons[i]}</div>
                <h3 className="au-pillar-title">{title}</h3>
                <p className="au-pillar-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="au-team">
        <div className="wrap">
          <div className="au-section-hd au-team-hd">
            <p className="label r">{ap.teamLabel}</p>
            <h2 className="au-section-h ws r">{ap.teamHeading}</h2>
          </div>
          <div className="au-team-grid">
            {physicians.map(({ name, title, qualification, department, bio, image }, i) => (
              <div key={name} className="au-doctor r" style={{ '--i': i } as React.CSSProperties}>
                <div className="au-doctor-img-wrap rs">
                  <Image src={image} alt={name} fill className="au-doctor-img" />
                </div>
                <div className="au-doctor-info">
                  <span className="au-doctor-dept">{department} · {qualification}</span>
                  <h3 className="au-doctor-name">{name}</h3>
                  <p className="au-doctor-title">{title}</p>
                  <p className="au-doctor-bio">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta" id="cta">
        <div className="wrap about-cta-inner">
          <h2 className="about-cta-h ws r">{ap.ctaHeading}</h2>
          <p className="about-cta-sub r">{ap.ctaSub}</p>
          <div className="r"><OpenBookingBtn /></div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  )
}
