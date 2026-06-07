import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CredentialsTicker from '@/components/CredentialsTicker'
import Philosophy from '@/components/Philosophy'
import Treatments from '@/components/Treatments'
import YogaSection from '@/components/YogaSection'
import VideoSection from '@/components/VideoSection'
import Testimonials from '@/components/Testimonials'
import ParallaxCta from '@/components/ParallaxCta'
import Footer from '@/components/Footer'
import ClientAnimations from '@/components/ClientAnimations'
import BookingModal from '@/components/BookingModal'
import Fab from '@/components/Fab'
import MapSection from '@/components/MapSection'

export default function Home() {
  return (
    <>
      <ClientAnimations />
      <BookingModal />
      <Nav />
      <main id="main-content">
        <Hero />
        <CredentialsTicker />
        <Philosophy />
        <YogaSection />
        <Treatments />
        <VideoSection />
        <Testimonials />
        <ParallaxCta />
        <MapSection />
      </main>
      <Footer />
      <Fab />
    </>
  )
}
