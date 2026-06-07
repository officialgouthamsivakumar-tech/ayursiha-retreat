import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import JsonLd from '@/components/JsonLd'
import LoadingScreen from '@/components/LoadingScreen'
import './styles/base.css'
import './styles/nav.css'
import './styles/hero.css'
import './styles/philosophy.css'
import './styles/treatments.css'
import './styles/feature.css'
import './styles/testimonials.css'
import './styles/parallax.css'
import './styles/yoga.css'
import './styles/experience.css'
import './styles/about.css'
import './styles/faq.css'
import './styles/footer.css'
import './styles/modals.css'
import './styles/responsive.css'

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
    default: 'Ayursiha Retreat — Ayurveda & Wellness, Aluva Kerala',
    template: '%s | Ayursiha Retreat',
  },
  description:
    'Ayursiha Retreat is a Ministry of AYUSH registered Ayurvedic healing centre in Aluva, Kerala. Authentic Panchakarma, Shirodhara, Abhyanga & personalised wellness programmes since 2002.',
  keywords: [
    'Ayurveda Aluva', 'Panchakarma Kerala', 'Ayurvedic retreat Kerala',
    'Shirodhara treatment', 'Ayurveda wellness centre', 'AYUSH registered clinic',
    'classical Ayurveda', 'Abhyanga massage', 'Kerala Ayurveda hospital',
    'holistic healing Aluva',
  ],

  // Open Graph — controls how the page looks when shared on WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Ayursiha Retreat',
    title: 'Ayursiha Retreat — Ayurveda & Wellness, Aluva Kerala',
    description:
      'Ministry of AYUSH registered Ayurvedic healing centre in Aluva, Kerala. Authentic Panchakarma, Shirodhara & personalised wellness programmes since 2002.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ayursiha Retreat' }],
    locale: 'en_IN',
  },

  // Twitter / X card
  twitter: {
    card: 'summary_large_image',
    title: 'Ayursiha Retreat — Ayurveda & Wellness, Aluva Kerala',
    description: 'Authentic Panchakarma & Ayurvedic healing in Aluva, Kerala. AYUSH registered since 2002.',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){function s(){var p=location.pathname;if(sessionStorage.getItem('visited:'+p)){document.documentElement.classList.add('is-returning');}else{document.documentElement.classList.remove('is-returning');}}s();window.addEventListener('popstate',s);})();` }} />
        <JsonLd />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LoadingScreen />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
