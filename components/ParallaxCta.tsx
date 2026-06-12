import { getTranslations } from 'next-intl/server'
import { getSettings } from '@/lib/db'
import ParallaxCtaClient from './ParallaxCtaClient'

export default async function ParallaxCta() {
  const [t, settings] = await Promise.all([
    getTranslations('parallaxCta'),
    Promise.resolve(getSettings()),
  ])

  return (
    <ParallaxCtaClient
      label={t('label')}
      headingLine1={t('headingLine1')}
      headingLine2={t('headingLine2')}
      sub={t('sub')}
      bookFree={t('bookFree')}
      phone={settings.phone}
    />
  )
}
