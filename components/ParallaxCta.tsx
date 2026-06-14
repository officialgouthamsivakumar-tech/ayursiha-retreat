import { getSettings } from '@/lib/db'
import ParallaxCtaClient from './ParallaxCtaClient'

export default async function ParallaxCta() {
  const settings = getSettings()
  const hc = settings.homeContent

  return (
    <ParallaxCtaClient
      label={hc.parallaxLabel}
      headingLine1={hc.parallaxHeadingLine1}
      headingLine2={hc.parallaxHeadingLine2}
      sub={hc.parallaxSub}
      bookFree={hc.parallaxBookFree}
      phone={settings.phone}
    />
  )
}
