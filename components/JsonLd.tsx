const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalBusiness',
      '@id': 'https://ayursiha.com/#business',
      name: 'Ayursiha Retreat',
      alternateName: 'Ayursiha Ayurvedic Healing Centre',
      url: 'https://ayursiha.com',
      logo: 'https://ayursiha.com/logo.png',
      image: 'https://ayursiha.com/og-image.jpg',
      description:
        'Ministry of AYUSH registered Ayurvedic healing centre in Thrissur, Kerala. Authentic Panchakarma, Shirodhara, Abhyanga and personalised wellness programmes since 2002.',
      foundingDate: '2002',
      priceRange: '₹₹₹',
      telephone: '+914872440000',
      email: 'consult@ayursiha.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'CAS Group Holdings, 11/310, Thuruth, Aluva, Chowara',
        addressLocality: 'Aluva',
        addressRegion: 'Kerala',
        postalCode: '683101',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.5276,
        longitude: 76.2144,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '19:00',
        },
      ],
      sameAs: [
        'https://www.instagram.com/ayursiha',
        'https://www.facebook.com/ayursiha',
        'https://www.youtube.com/@ayursiha',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Ayurvedic Treatments',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'MedicalTherapy', name: 'Panchakarma' } },
          { '@type': 'Offer', itemOffered: { '@type': 'MedicalTherapy', name: 'Shirodhara' } },
          { '@type': 'Offer', itemOffered: { '@type': 'MedicalTherapy', name: 'Abhyanga' } },
          { '@type': 'Offer', itemOffered: { '@type': 'MedicalTherapy', name: 'Kizhi Therapy' } },
          { '@type': 'Offer', itemOffered: { '@type': 'MedicalTherapy', name: 'Rasayana Programme' } },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '4800',
        bestRating: '5',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ayursiha.com/#website',
      url: 'https://ayursiha.com',
      name: 'Ayursiha Retreat',
      publisher: { '@id': 'https://ayursiha.com/#business' },
    },
  ],
}

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
