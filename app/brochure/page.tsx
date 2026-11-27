import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import FooterMinimal from '@/components/FooterMinimal'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'
import BrochureProgress, { BrochurePrintBtn } from '@/components/BrochureProgress'
import { getSettings } from '@/lib/db'
import { spaMenu, formatInr } from '@/lib/spaMenu'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Spa & Wellness Brochure',
  description:
    'The Ayursiha Retreat spa and wellness menu — Abhyangam, Kizhi, Shirodhara, Thakradhara, Padabhyangam, Mukhalepam and head, face and skin care packages, with prices.',
}

const isUpload = (src?: string) => !!src && src.startsWith('/api/')

const slugify = (name: string) =>
  name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const items = spaMenu.flatMap(cat => cat.items).map(item => ({ ...item, id: slugify(item.name) }))

function Leaf({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2C9 10 6 24 20 38 34 24 31 10 20 2Z" fill="currentColor" opacity=".9" />
      <path d="M20 6v30" stroke="rgba(255,255,255,.45)" strokeWidth="1" fill="none" />
    </svg>
  )
}

export default function BrochurePage() {
  const settings = getSettings()
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
            <p className="label bro-cover-label r">Spa &amp; Wellness Brochure</p>
            <h1 className="bro-cover-h ws">Rituals to Restore</h1>
            <span className="bro-cover-rule" />
            <p className="bro-cover-sub r">
              Signature body rituals, rituals of tranquility and the beauty of natural care
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
              {items.map((item, i) => (
                <li key={item.id} className="r" style={{ '--i': i } as React.CSSProperties}>
                  <a href={`#${item.id}`}>
                    <span className="bro-index-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="bro-index-name">{item.name}</span>
                    <span className="bro-index-price">{formatInr(item.price)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SPA & WELLNESS MENU ── */}
        <section className="bro-menu" id="spa-menu">
          {spaMenu.map(cat => (
            <div key={cat.title} className="bro-menu-group wrap">
              <h2 className="bro-menu-cat r">
                <em>{cat.kicker}</em>
                {cat.title}
              </h2>
              <ul className="bro-menu-cards stagger">
                {cat.items.map((item, j) => (
                  <li
                    key={item.name}
                    id={slugify(item.name)}
                    className="bro-menu-card r"
                    style={{ '--i': j } as React.CSSProperties}
                  >
                    <div className="bro-menu-card-media">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 380px"
                        className="bro-menu-card-img"
                      />
                      <span className="bro-menu-price">{formatInr(item.price)}</span>
                    </div>
                    <div className="bro-menu-card-body">
                      <h3 className="bro-menu-name">{item.name}</h3>
                      {item.note && <p className="bro-menu-note">{item.note}</p>}
                      {item.description && <p className="bro-menu-desc">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

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
