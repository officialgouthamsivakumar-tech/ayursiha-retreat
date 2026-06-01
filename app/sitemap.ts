import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ayursiha.com'
  const now = new Date()

  return [
    { url: base,                      lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/#philosophy`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${base}/#treatments`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/#process`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${base}/#testi`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
