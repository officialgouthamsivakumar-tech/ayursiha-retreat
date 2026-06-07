import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import FooterMinimal from '@/components/FooterMinimal'
import ClientAnimations from '@/components/ClientAnimations'
import BookingModal from '@/components/BookingModal'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import { getTreatments, getTreatmentBySlug } from '@/lib/db'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const treatments = await getTreatments()
  return treatments.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = await getTreatmentBySlug(slug)
  if (!t) return {}
  return {
    title: t.name,
    description: t.body,
  }
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params
  const t = await getTreatmentBySlug(slug)
  if (!t) notFound()

  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* Hero */}
      <div className="tp-hero">
        <Image
          src={t.image}
          alt={t.name}
          fill
          priority
          className="tp-hero-img rs"
          sizes="100vw"
        />
        <div className="tp-hero-overlay" />
        <div className="tp-hero-content">
          <h1 className="tp-h1 ws">{t.name}</h1>
        </div>
      </div>

      {/* Detail */}
      <section className="tp-detail wrap--sm">

        {/* Long description */}
        <div className="tp-section">
          <p className="label rl">About this treatment</p>
          <p className="tp-long rl">{t.longDescription}</p>
        </div>

        <div className="tp-divider rs" />

        {/* Benefits */}
        <div className="tp-section">
          <p className="label rl">What to expect</p>
          <ul className="tp-benefits stagger">
            {t.benefits.map((b: string, i: number) => (
              <li key={i} className="tp-benefit r" style={{ '--i': i } as React.CSSProperties}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="tp-divider rs" />

        {/* Diet Plan */}
        <div className="tp-section">
          <p className="label rl">Diet Plan</p>
          <ul className="tp-benefits stagger">
            {t.dietPlan.map((d: string, i: number) => (
              <li key={i} className="tp-benefit r" style={{ '--i': i } as React.CSSProperties}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="tp-divider rs" />

        {/* Meta row */}
        <div className="tp-meta-row r">
          <div className="tp-meta-item">
            <span className="tp-meta-label">Duration</span>
            <span className="tp-meta-value">{t.duration}</span>
          </div>
          <div className="tp-meta-sep" />
          <div className="tp-meta-item">
            <span className="tp-meta-label">Ideal for</span>
            <span className="tp-meta-value">{t.ideal}</span>
          </div>
        </div>

        <div className="tp-divider rs" />

        {/* CTA */}
        <div className="tp-cta r" id="cta">
          <p className="tp-cta-note">
            All treatments are prescribed after a thorough Prakriti assessment. Book a consultation to receive your personalised plan.
          </p>
          <OpenBookingBtn />
        </div>

      </section>
      </main>

      <FooterMinimal />
    </>
  )
}
