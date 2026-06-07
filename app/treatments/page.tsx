import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import { getTreatments } from '@/lib/db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Treatments — Ayursiha Retreat',
  description: 'Explore our classical Ayurvedic treatments — Panchakarma, Shirodhara, Abhyanga, Kizhi, Rasayana and more. Every therapy prescribed after a personalised Prakriti assessment.',
}

export default async function TreatmentsPage() {
  const treatments = await getTreatments()
  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* ── HERO ── */}
      <div className="au-hero">
        <Image src="/treatments-bg.jpg" alt="Ayursiha Treatments" fill className="au-hero-img" priority />
        <div className="au-hero-overlay" />
        <p className="label au-hero-label r">Classical Therapies</p>
        <div className="au-hero-content">
          <h1 className="au-hero-h ws">Our Treatments</h1>
          <p className="au-hero-rule r" />
          <p className="au-hero-sub r">
            Every treatment is prescribed after a thorough Prakriti assessment —<br />
            duration, oils, herbs, and technique all calibrated to you alone.
          </p>
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="ex-intro">
        <div className="wrap--sm ex-intro-inner">
          <p className="label r" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Our Approach</p>
          <h2 className="ex-intro-h ws r">Treatments that honour the tradition.</h2>
          <p className="ex-intro-body r">
            At Ayursiha, no treatment is administered without first understanding who you are.
            Every session begins with a comprehensive Prakriti and Vikriti assessment — a complete
            picture of your constitution, your current imbalances, and your health history.
            Only then does your physician prescribe the precise therapy, formulation, and duration
            that will bring you back to balance.
          </p>
        </div>
      </section>

      {/* ── TREATMENT CARDS ── */}
      <section className="tl-grid-section">
        <div className="wrap">
          <div className="tl-grid stagger">
            {treatments.map(({ idx, slug, tag, name, body, image, duration, ideal }, i) => (
              <div key={idx} className="tl-card r" style={{ '--i': i } as React.CSSProperties}>
                <div className="tl-card-img-wrap rs">
                  <Image src={image} alt={name} fill className="tl-card-img" />
                  <span className="tl-card-tag">{tag}</span>
                </div>
                <div className="tl-card-body">
                  <span className="tl-card-idx">{idx}</span>
                  <h3 className="tl-card-name">{name}</h3>
                  <p className="tl-card-desc">{body}</p>
                  <div className="tl-card-meta">
                    <span><strong>Duration:</strong> {duration}</span>
                    <span><strong>Ideal for:</strong> {ideal}</span>
                  </div>
                  <Link href={`/treatments/${slug}`} className="tl-card-link">
                    Learn More
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M2 7h10M8 3l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta" id="cta">
        <div className="wrap about-cta-inner">
          <h2 className="about-cta-h ws r">Begin with a consultation.</h2>
          <p className="about-cta-sub r">
            Our physicians will assess your constitution and recommend the treatments designed for you.
          </p>
          <div className="r"><OpenBookingBtn /></div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  )
}
