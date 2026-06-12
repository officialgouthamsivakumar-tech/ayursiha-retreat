import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ayursiha.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/uploads/:filename',
        destination: '/api/uploads/:filename',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
