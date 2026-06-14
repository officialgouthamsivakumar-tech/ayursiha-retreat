import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import { getSettings } from '@/lib/db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Experience — Ayursiha Retreat',
  description: 'Discover the Ayursiha experience — classical Ayurvedic healing, personalised programmes, yoga, and lasting restoration in Kerala.',
}

const cardLinks  = ['/#treatments', '/about', '/#yoga', '/#treatments']
const cardAlts   = ['Panchakarma therapy at Ayursiha', 'Personalised Ayurvedic consultation', 'Yoga session at Ayursiha', 'Rasayana herbal preparations']
const cardReverse = [false, true, false, true]

export default async function ExperiencePage() {
  const settings  = getSettings()
  const ep        = settings.experiencePageContent
  const heroImg   = settings.experienceHeroImage || '/shirodhara.png'
  const pageImgs  = settings.experiencePageImages ?? ['/panchakarma.png', '/consultation.png', '/yoga.png', '/rasayana.png']

  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* ── HERO ── */}
      <div className="ex-hero">
        <Image src={heroImg} alt="The Ayursiha Experience" fill className="ex-hero-img" priority unoptimized={!heroImg.startsWith('/') || heroImg.startsWith('/api/')} />
        <div className="ex-hero-overlay" />
        <p className="label ex-hero-label ex-hi-0">{ep.heroLabel}</p>
        <div className="ex-hero-content">
          <h1 className="ex-hero-h ex-hi-1">{ep.heroHeading.split('\n').map((line, i, arr) => (
            <span key={i}>{i === arr.length - 1 ? <em>{line}</em> : line}{i < arr.length - 1 && <br />}</span>
          ))}</h1>
          <p className="ex-hero-rule ex-hi-2" />
          <p className="ex-hero-sub ex-hi-3">{ep.heroSub}</p>
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="ex-intro">
        <div className="wrap--sm ex-intro-inner">
          <p className="label r" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>{ep.introLabel}</p>
          <h2 className="ex-intro-h ws r">{ep.introHeading}</h2>
          <p className="ex-intro-body r">{ep.introBody1}</p>
          <p className="ex-intro-body r">{ep.introBody2}</p>
        </div>
      </section>

      {/* ── NARRATIVE ── */}
      <section className="ex-narrative">
        <div className="wrap--sm">
          <h2 className="ex-narrative-h ws r">
            {ep.narrativeHeadingLine1}<br /><em>{ep.narrativeHeadingLine2}</em>
          </h2>
          <p className="ex-narrative-body r">{ep.narrativeBody}</p>
        </div>
      </section>

      {/* ── EXPERIENCE CARDS ── */}
      <section className="ex-cards">
        {ep.cards.map(({ label, title, body }, i) => {
          const src = pageImgs[i] || '/panchakarma.png'
          const reverse = cardReverse[i]
          return (
            <div key={i} className={`ex-card${reverse ? ' ex-card--reverse' : ''}`}>
              <div className="ex-card-img-wrap rs">
                <Image src={src} alt={cardAlts[i]} fill className="ex-card-img" unoptimized={!src.startsWith('/') || src.startsWith('/api/')} />
              </div>
              <div className="ex-card-text">
                <p className={`label ex-card-label ${reverse ? 'rr' : 'rl'}`}>{label}</p>
                <h3 className={`ex-card-h ws ${reverse ? 'rr' : 'rl'}`}>{title}</h3>
                <p className={`ex-card-body ${reverse ? 'rr' : 'rl'}`}>{body}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="about-cta" id="cta">
        <div className="wrap about-cta-inner">
          <h2 className="about-cta-h ws r">{ep.ctaHeading}</h2>
          <p className="about-cta-sub r">{ep.ctaSub}</p>
          <div className="r"><OpenBookingBtn /></div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  )
}
