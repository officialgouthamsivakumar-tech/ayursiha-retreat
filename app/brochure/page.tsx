import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTreatments, getSettings } from '@/lib/db'
import BrochureReveal from '@/components/BrochureReveal'
import './brochure.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Brochure — Ayursiha Retreat',
  description:
    'An animated guide to Ayursiha’s classical Ayurvedic treatments — Panchakarma, Shirodhara, Abhyanga, Kizhi, Rasayana and more.',
}

export default async function BrochurePage() {
  const treatments = await getTreatments()
  const settings = getSettings()
  const telHref = `tel:${settings.phone.replace(/\s/g, '')}`
  const waHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`

  return (
    <div className="bro">
      <BrochureReveal />

      {/* ── COVER ── */}
      <header className="bro-cover">
        <div className="bro-cover-bg" aria-hidden="true" />
        <div className="bro-cover-grad" aria-hidden="true" />
        <div className="bro-cover-inner">
          <img src="/logo.png" alt="Ayursiha" className="bro-logo" />
          <p className="bro-kicker">Treatment Brochure</p>
          <h1 className="bro-title">
            Classical healing,<br /><em>made for you.</em>
          </h1>
          <div className="bro-rule" />
          <p className="bro-sub">
            Every therapy at Ayursiha is prescribed after a Prakriti assessment.
            Explore each treatment below.
          </p>
        </div>
        <div className="bro-scroll" aria-hidden="true">
          Scroll
          <span />
        </div>
      </header>

      {/* ── INTRO ── */}
      <section className="bro-intro">
        <p className="bro-label" data-reveal="fade">Our Approach</p>
        <h2 className="bro-intro-h" data-reveal="fade" style={{ '--d': '120ms' } as React.CSSProperties}>
          No treatment begins before we understand who you are.
        </h2>
        <p className="bro-intro-p" data-reveal="fade" style={{ '--d': '240ms' } as React.CSSProperties}>
          Each session starts with a comprehensive Prakriti and Vikriti assessment. Only then does the
          physician prescribe the therapy, formulation and duration suited to you.
        </p>
      </section>

      {/* ── CONTENTS ── */}
      <nav className="bro-toc" aria-label="Treatments">
        <ul className="bro-toc-list">
          {treatments.map(t => (
            <li key={t.idx} data-reveal="fade">
              <a href={`#${t.slug}`}>
                <span className="bro-toc-idx">{t.idx}</span>
                {t.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── TREATMENT CHAPTERS ── */}
      {treatments.map((t, i) => {
        const flip = i % 2 === 1
        return (
          <section
            key={t.idx}
            id={t.slug}
            className={`bro-chapter${flip ? ' bro-chapter--flip' : ''}`}
          >
            <div className="bro-chapter-inner">
              <div className="bro-chapter-media" data-reveal={flip ? 'right' : 'left'}>
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width: 860px) 100vw, 520px"
                  className="bro-chapter-img"
                />
                <span className="bro-chapter-num">{t.idx}</span>
              </div>

              <div className="bro-chapter-text" data-reveal={flip ? 'left' : 'right'} style={{ '--d': '150ms' } as React.CSSProperties}>
                <span className="bro-chapter-tag">{t.tag}</span>
                <h3 className="bro-chapter-name">{t.name}</h3>
                <p className="bro-chapter-body">{t.longDescription}</p>

                <div className="bro-chapter-meta">
                  <div>
                    <span>Duration</span>
                    {t.duration}
                  </div>
                  <div>
                    <span>Ideal for</span>
                    {t.ideal}
                  </div>
                </div>

                <h4 className="bro-diet-h">What to expect</h4>
                <ul className="bro-points" data-reveal="fade">
                  {t.benefits.map((b, j) => (
                    <li key={j} style={{ '--d': `${j * 110}ms` } as React.CSSProperties}>{b}</li>
                  ))}
                </ul>

                <h4 className="bro-diet-h">Diet plan</h4>
                <ul className="bro-points" data-reveal="fade">
                  {t.dietPlan.map((d, j) => (
                    <li key={j} style={{ '--d': `${j * 110}ms` } as React.CSSProperties}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── CLOSING ── */}
      <section className="bro-close">
        <p className="label" data-reveal="fade">Begin with a consultation</p>
        <h2 className="bro-close-h" data-reveal="fade" style={{ '--d': '120ms' } as React.CSSProperties}>
          Your personalised plan starts with a conversation.
        </h2>
        <p className="bro-close-p" data-reveal="fade" style={{ '--d': '240ms' } as React.CSSProperties}>
          Our physicians will assess your constitution and recommend the treatments designed for you.
        </p>
        <div data-reveal="fade" style={{ '--d': '360ms' } as React.CSSProperties}>
          <a className="bro-btn" href={waHref}>Book on WhatsApp</a>
        </div>
        <div className="bro-close-contact">
          <a href={telHref}>{settings.phone}</a>
          <span>{settings.address}</span>
        </div>
      </section>
    </div>
  )
}
