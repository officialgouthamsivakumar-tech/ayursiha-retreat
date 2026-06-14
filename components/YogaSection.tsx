import { getSettings } from '@/lib/db'
import YogaSectionClient from './YogaSectionClient'

export default async function YogaSection() {
  const settings = getSettings()
  const hc = settings.homeContent

  return (
    <YogaSectionClient
      label={hc.yogaLabel}
      heading={hc.yogaHeading}
      body={hc.yogaBody}
      cta={hc.yogaCta}
      bgImage={hc.yogaBgImage}
      highlights={hc.yogaHighlights}
    />
  )
}
