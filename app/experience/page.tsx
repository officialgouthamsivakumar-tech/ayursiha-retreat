import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import OpenBookingBtn from '@/components/OpenBookingBtn'

export const metadata: Metadata = {
  title: 'The Experience — Ayursiha Retreat',
  description: 'Discover the Ayursiha experience — classical Ayurvedic healing, personalised programmes, yoga, and lasting restoration in Kerala.',
}

const experiences = [
  {
    label: 'Elemental Wellness',
    title: 'Panchakarma & Classical Healing',
    body: 'Immerse yourself in the oldest and most complete system of medicine in the world. Our Panchakarma programmes are meticulously designed by qualified physicians — combining Shodhana purification, Shaman balancing therapies, and classical herbal formulations to restore your body at a cellular level. Every session is unhurried, purposeful, and deeply personal.',
    link: '/#treatments',
    image: '/panchakarma.png',
    imageAlt: 'Panchakarma therapy at Ayursiha',
    reverse: false,
  },
  {
    label: 'Bespoke Programmes',
    title: 'Your Personalised Healing Plan',
    body: 'No two constitutions are the same — and no two treatment plans at Ayursiha are the same. Your stay begins with a comprehensive Prakriti assessment: pulse diagnosis, tongue analysis, and a full review of your medical history. From this, your physician designs a protocol entirely your own — specific therapies, herbal formulations, dietary guidelines, and a daily rhythm calibrated to your constitution.',
    link: '/about',
    image: '/consultation.png',
    imageAlt: 'Personalised Ayurvedic consultation',
    reverse: true,
  },
  {
    label: 'Mindful Movement',
    title: 'Yoga & Meditation Sessions',
    body: 'Practised at sunrise in our open-air pavilion, daily yoga and pranayama sessions are tailored to complement your Ayurvedic treatment plan and your unique Prakriti. Guided by experienced instructors, each session aligns your body with the natural rhythms of the day — amplifying the healing effect of every therapy and cultivating a stillness that extends far beyond your stay.',
    link: '/#yoga',
    image: '/yoga.png',
    imageAlt: 'Yoga session at Ayursiha',
    reverse: false,
  },
  {
    label: 'Lasting Restoration',
    title: 'Rasayana & Post-Stay Care',
    body: 'Healing at Ayursiha does not end at discharge. Before you leave, your physician prepares a complete post-stay protocol — classical Rasayana rejuvenation herbs, dietary recommendations, lifestyle adjustments, and scheduled follow-up consultations. Your take-home kit and ongoing physician access ensure that the restoration you began here continues to deepen long after you return home.',
    link: '/#treatments',
    image: '/rasayana.png',
    imageAlt: 'Rasayana herbal preparations',
    reverse: true,
  },
]

export default function ExperiencePage() {
  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <main id="main-content">
      {/* ── HERO ── */}
      <div className="ex-hero">
        <Image src="/shirodhara.png" alt="The Ayursiha Experience" fill className="ex-hero-img" priority />
        <div className="ex-hero-overlay" />
        <p className="label ex-hero-label ex-hi-0">Ayursiha Retreat</p>
        <div className="ex-hero-content">
          <h1 className="ex-hero-h ex-hi-1">The Ayursiha<br /><em>Experience</em></h1>
          <p className="ex-hero-rule ex-hi-2" />
          <p className="ex-hero-sub ex-hi-3">
            Escape the hurried pace. Transform your mind, body, and soul<br />
            through classical Ayurveda in the heart of Kerala.
          </p>
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="ex-intro">
        <div className="wrap--sm ex-intro-inner">
          <p className="label r" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Our Philosophy</p>
          <h2 className="ex-intro-h ws r">Discover. Heal. Restore.</h2>
          <p className="ex-intro-body r">
            At Ayursiha, guests leave the demands of daily life behind to embark on a journey of genuine
            transformation. Walk through our open-air corridors. Rest in our treatment suites. Practise
            yoga as the sun rises over Kerala. Every detail of your stay — your meals, your therapies,
            your daily rhythm — is designed with a single purpose: to return you to yourself.
          </p>
          <p className="ex-intro-body r">
            We are one of the few Ayurvedic centres in India where every programme is built from scratch
            by a qualified physician and rooted in the original texts. No templates. No compromises.
            Only classical medicine, practised with rigour and care.
          </p>
        </div>
      </section>

      {/* ── NARRATIVE ── */}
      <section className="ex-narrative">
        <div className="wrap--sm">
          <h2 className="ex-narrative-h ws r">Practised for 5,000 years.<br /><em>Personalised for you.</em></h2>
          <p className="ex-narrative-body r">
            The healing traditions of Kerala Ayurveda have been handed down through generations of
            physicians — refined, tested, and deepened over millennia. At Ayursiha, we carry this
            lineage with humility and precision. Our centre in Aluva sits in the heartland of this
            tradition, where the rivers, the climate, and the herbs themselves are part of the medicine.
            Every stay here is an invitation to step into that story and write your own chapter of healing.
          </p>
        </div>
      </section>

      {/* ── EXPERIENCE CARDS ── */}
      <section className="ex-cards">
        {experiences.map(({ label, title, body, link, image, imageAlt, reverse }) => (
          <div key={title} className={`ex-card${reverse ? ' ex-card--reverse' : ''}`}>
            <div className="ex-card-img-wrap rs">
              <Image src={image} alt={imageAlt} fill className="ex-card-img" />
            </div>
            <div className="ex-card-text">
              <p className={`label ex-card-label ${reverse ? 'rr' : 'rl'}`}>{label}</p>
              <h3 className={`ex-card-h ws ${reverse ? 'rr' : 'rl'}`}>{title}</h3>
              <p className={`ex-card-body ${reverse ? 'rr' : 'rl'}`}>{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="about-cta" id="cta">
        <div className="wrap about-cta-inner">
          <h2 className="about-cta-h ws r">Embrace the Ayursiha Life.</h2>
          <p className="about-cta-sub r">
            Begin your journey with a physician consultation and discover the programme designed for you.
          </p>
          <div className="r"><OpenBookingBtn /></div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  )
}
