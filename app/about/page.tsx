import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import { getPhysicians } from '@/lib/db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Us — Ayursiha Retreat',
  description: 'Learn about Ayursiha Retreat — a Ministry of AYUSH registered Ayurvedic healing centre in Aluva, Kerala, practising classical Ayurveda since 2002.',
}


const stats = [
  { value: '2002', label: 'Year Founded' },
  { value: '4,800+', label: 'Patients Healed' },
  { value: '22+', label: 'Years of Practice' },
  { value: '97%', label: 'Patient Satisfaction' },
]

const pillars = [
  {
    title: 'Classical Integrity',
    body: 'We follow the original Ayurvedic texts — Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam — without dilution or commercialisation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    title: 'Physician-Led Care',
    body: 'Every treatment plan is designed and supervised by qualified BAMS-degree physicians. No templates — only personalised protocols.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    title: 'Root-Cause Focus',
    body: 'We never suppress symptoms. Every therapy identifies and eliminates the underlying doshic imbalance at its source.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    title: 'Lasting Restoration',
    body: 'Healing does not end at discharge. Follow-up consultations, herbal protocols, and dietary guidance ensure continued wellbeing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/>
        <path d="M12 12C12 12 17 9.5 19 7"/>
        <path d="M12 12C12 12 7 9.5 5 7"/>
      </svg>
    ),
  },
]

export default async function AboutPage() {
  const physicians = await getPhysicians()
  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* ── HERO BANNER ── */}
      <div className="au-hero">
        <Image
          src="/abhyanga.jpg"
          alt="Ayursiha Retreat"
          fill
          className="au-hero-img"
          priority
        />
        <div className="au-hero-overlay" />
        <p className="label au-hero-label r">Ayursiha Retreat</p>
        <div className="au-hero-content">
          <h1 className="au-hero-h ws">About Us</h1>
          <p className="au-hero-rule r" />
          <p className="au-hero-sub r">
            A Ministry of AYUSH registered Ayurvedic healing centre<br />
            in Aluva, Kerala — since 2002.
          </p>
        </div>
      </div>

      {/* ── BRAND INTRO ── */}
      <section className="au-intro">
        <div className="wrap au-intro-inner">
          <div className="au-intro-text">
            <p className="label rl">Our Story</p>
            <h2 className="au-section-h ws rl">
              Rooted in Kerala.<br /><em>Built on science.</em>
            </h2>
            <p className="au-body rl">
              Ayursiha was founded in 2002 under the CAS Group Holdings with a single conviction:
              that authentic Ayurveda, practised with the rigour of a medical institution, can heal
              conditions that modern medicine struggles to address.
            </p>
            <p className="au-body rl">
              Over two decades and more than 4,800 patients later, that conviction has only deepened.
              Located in Aluva, Kerala — the heartland of classical Ayurvedic tradition — we remain
              one of the few centres in India where every treatment plan is designed by a qualified
              physician and rooted in the original texts.
            </p>
            <p className="au-body rl">
              We are registered with the Ministry of AYUSH, Government of India, and hold
              ISO 9001:2015, GMP, and NABH accreditations — not as marketing credentials,
              but as a commitment to our patients.
            </p>
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
          <blockquote className="au-mission-quote r">
            We treat the whole person — their constitution, their history, their life —
            not just the condition they walk in with.
          </blockquote>
          <div className="au-mission-line rs" />
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="au-pillars">
        <div className="wrap">
          <div className="au-section-hd">
            <p className="label r">What We Stand For</p>
            <h2 className="au-section-h ws r">Our guiding principles</h2>
          </div>
          <div className="au-pillars-grid stagger">
            {pillars.map(({ title, body, icon }, i) => (
              <div key={title} className="au-pillar r" style={{ '--i': i } as React.CSSProperties}>
                <div className="au-pillar-icon">{icon}</div>
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
            <p className="label r">Our Physicians</p>
            <h2 className="au-section-h ws r">The people behind your care</h2>
          </div>
          <div className="au-team-grid">
            {physicians.map(({ name, title, qualification, department, bio, image }, i) => (
              <div key={name} className="au-doctor r" style={{ '--i': i } as React.CSSProperties}>
                <div className="au-doctor-img-wrap rs">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="au-doctor-img"
                  />
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
          <h2 className="about-cta-h ws r">Ready to begin your healing?</h2>
          <p className="about-cta-sub r">
            Speak with one of our physicians and discover the treatment plan designed for you.
          </p>
          <div className="r"><OpenBookingBtn /></div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  )
}
