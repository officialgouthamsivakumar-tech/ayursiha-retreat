import Nav from '@/components/Nav'
import FooterMinimal from '@/components/FooterMinimal'
import BookingModal from '@/components/BookingModal'
import ClientAnimations from '@/components/ClientAnimations'
import { getFaqs } from '@/lib/db'
import FaqClient from './FaqClient'

export const revalidate = 60

export default async function FaqPage() {
  const faqs = await getFaqs()

  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />

      <div className="faq-hero">
        <p className="label" style={{ color: 'var(--amber)' }}>Ayursiha Retreat</p>
        <h1 className="faq-hero-h">Frequently Asked Questions</h1>
        <p className="faq-hero-sub">Everything you need to know before your visit.</p>
      </div>

      <main className="faq-main wrap--sm">
        <FaqClient faqs={faqs} />
      </main>

      <FooterMinimal />
    </>
  )
}
