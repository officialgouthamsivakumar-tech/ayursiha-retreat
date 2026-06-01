import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CredentialsTicker from '@/components/CredentialsTicker'
import Philosophy from '@/components/Philosophy'
import Treatments from '@/components/Treatments'
import FeatureSection from '@/components/FeatureSection'
import StatsBar from '@/components/StatsBar'
import VideoSection from '@/components/VideoSection'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import ParallaxCta from '@/components/ParallaxCta'
import Footer from '@/components/Footer'
import ClientAnimations from '@/components/ClientAnimations'
import Fab from '@/components/Fab'
import MapSection from '@/components/MapSection'

export default function Home() {
  return (
    <>
      <ClientAnimations />
      <Nav />
      <Hero />
      <CredentialsTicker />
      <Philosophy />
      <Treatments />
      <FeatureSection />
      <StatsBar />
      <VideoSection />
      <Process />
      <Testimonials />
      <ParallaxCta />
      <MapSection />
      <Footer />
      <Fab />
    </>
  )
}
