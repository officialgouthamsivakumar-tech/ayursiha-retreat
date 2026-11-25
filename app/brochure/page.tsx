import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import FooterMinimal from '@/components/FooterMinimal'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import BrochureProgress, { BrochurePrintBtn } from '@/components/BrochureProgress'
import { getTreatments, getSettings } from '@/lib/db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Treatment Brochure',
  description:
    'The Ayursiha Retreat treatment brochure — every classical Ayurvedic therapy we offer, with benefits, duration and diet guidance.',
}

const isUpload = (src?: string) => !!src && src.startsWith('/api/')

function Leaf({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2C9 10 6 24 20 38 34 24 31 10 20 2Z" fill="currentColor" opacity=".9" />
      <path d="M20 6v30" stroke="rgba(255,255,255,.45)" strokeWidth="1" fill="none" />
    </svg>
  )
}

export default async function BrochurePage() {
  const [treatments, settings] = await Promise.all([getTreatments(), Promise.resolve(getSettings())])
  const total = String(treatments.length).padStart(2, '0')
  const cover = settings.treatmentsHeroImage || '/treatments-bg.jpg'
  const wa = (settings.whatsapp || '').replace(/[^\d]/g, '')

  return (
    <>
      <ClientAnimations />
      <BookingModal whatsapp={settings.whatsapp} />
      <BrochureProgress />
      <Nav />

      <main id="main-content" className="bro">
        {/* ── COVER ── */}
        <header className="bro-cover">
          <Image src={cover} alt="" fill priority className="bro-cover-img" sizes="100vw" unoptimized={isUpload(cover)} />
          <div className="bro-cover-overlay" />
          <Leaf className="bro-leaf bro-leaf--1" />
          <Leaf className="bro-leaf bro-leaf--2" />
          <Leaf className="bro-leaf bro-leaf--3" />
          <div className="bro-cover-content">
            <p className="label bro-cover-label r">Treatment Brochure</p>
            <h1 className="bro-cover-h ws">Classical Ayurvedic Therapies</h1>
            <span className="bro-cover-rule" />
            <p className="bro-cover-sub r">
              {treatments.length} healing treatments, prescribed after your personal Prakriti assessment
            </p>
          </div>
          <a href="#bro-index" className="bro-scroll" aria-label="Open the brochure">
            <span />
          </a>
        </header>

        {/* ── CONTENTS ── */}
        <section className="bro-index" id="bro-index">
          <div className="wrap--sm">
            <p className="label r" style={{ textAlign: 'center' }}>Inside this brochure</p>
            <ol className="bro-index-list stagger">
              {treatments.map((t, i) => (
                <li key={t.slug} className="r" style={{ '--i': i } as React.CSSProperties}>
                  <a href={`#${t.slug}`}>
                    <span className="bro-index-n">{t.idx || String(i + 1).padStart(2, '0')}</span>
                    <span className="bro-index-name">{t.name}</span>
                    <span className="bro-index-tag">{t.tag}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── TREATMENT PAGES ── */}
        {treatments.map((t, i) => {
          const n = t.idx || String(i + 1).padStart(2, '0')
          return (
            <article key={t.slug} id={t.slug} className={`bro-page${i % 2 ? ' bro-page--flip' : ''}`}>
              <div className="bro-page-inner wrap">
                <div className="bro-media rs">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="bro-media-img"
                    sizes="(max-width: 900px) 100vw, 50vw"
                    unoptimized={isUpload(t.image)}
                  />
                  <span className="bro-media-n" aria-hidden="true">{n}</span>
                  {t.tag && <span className="bro-media-tag">{t.tag}</span>}
                </div>

                <div className="bro-text">
                  <p className="bro-count r">
                    <span>{n}</span> / {total}
                  </p>
                  <h2 className="bro-name ws">{t.name}</h2>
                  <p className="bro-body r">{t.body || t.longDescription}</p>
                </div>
              </div>
            </article>
          )
        })}

        {/* ── CONTACT / BOOK ── */}
        <section className="bro-contact" id="cta">
          <div className="wrap bro-contact-inner">
            <div className="bro-contact-text">
              <p className="label r">Begin your healing</p>
              <h2 className="bro-contact-h ws">Book a consultation with our physician</h2>
              <ul className="bro-contact-list stagger">
                {settings.phone && (
                  <li className="r" style={{ '--i': 0 } as React.CSSProperties}>
                    <span>Call</span>
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                  </li>
                )}
                {wa && (
                  <li className="r" style={{ '--i': 1 } as React.CSSProperties}>
                    <span>WhatsApp</span>
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">Chat with us</a>
                  </li>
                )}
                {settings.address && (
                  <li className="r" style={{ '--i': 2 } as React.CSSProperties}>
                    <span>Visit</span>
                    <p>{settings.address}</p>
                  </li>
                )}
              </ul>
              <div className="bro-contact-actions r">
                <OpenBookingBtn />
                <BrochurePrintBtn />
              </div>
            </div>

            <figure className="bro-qr rs">
              <Image src="/brochure/qr" alt="QR code linking to this brochure" width={180} height={180} unoptimized />
              <figcaption>Scan to open this brochure on your phone</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <FooterMinimal />
    </>
  )
}
