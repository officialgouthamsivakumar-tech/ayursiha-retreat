import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import JsonLd from '@/components/JsonLd'
import LoadingScreen from '@/components/LoadingScreen'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://ayursiha.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Ayursiha Retreat — Ayurveda & Wellness, Thrissur Kerala',
    template: '%s | Ayursiha Retreat',
  },
  description:
    'Ayursiha Retreat is a Ministry of AYUSH registered Ayurvedic healing centre in Thrissur, Kerala. Authentic Panchakarma, Shirodhara, Abhyanga & personalised wellness programmes since 2002.',
  keywords: [
    'Ayurveda Thrissur', 'Panchakarma Kerala', 'Ayurvedic retreat Kerala',
    'Shirodhara treatment', 'Ayurveda wellness centre', 'AYUSH registered clinic',
    'classical Ayurveda', 'Abhyanga massage', 'Kerala Ayurveda hospital',
    'holistic healing Thrissur',
  ],

  // Open Graph — controls how the page looks when shared on WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Ayursiha Retreat',
    title: 'Ayursiha Retreat — Ayurveda & Wellness, Thrissur Kerala',
    description:
      'Ministry of AYUSH registered Ayurvedic healing centre in Thrissur, Kerala. Authentic Panchakarma, Shirodhara & personalised wellness programmes since 2002.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ayursiha Retreat' }],
    locale: 'en_IN',
  },

  // Twitter / X card
  twitter: {
    card: 'summary_large_image',
    title: 'Ayursiha Retreat — Ayurveda & Wellness, Thrissur Kerala',
    description: 'Authentic Panchakarma & Ayurvedic healing in Thrissur, Kerala. AYUSH registered since 2002.',
    images: ['/og-image.jpg'],
  },

  // Canonical URL — prevents duplicate-content penalties
  alternates: { canonical: SITE_URL },

  // Robots directive — tells Google to index and follow all links
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },

  // Google Search Console verification — replace with your actual token
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}
