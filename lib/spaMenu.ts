export interface SpaMenuItem {
  name: string
  note?: string
  description?: string
  price: number
  /** Photo under /public, cropped from the printed spa brochure */
  image: string
}

export interface SpaMenuCategory {
  kicker: string
  title: string
  items: SpaMenuItem[]
}

export const spaMenu: SpaMenuCategory[] = [
  {
    kicker: 'Signature',
    title: 'Body Rituals',
    items: [
      {
        name: 'Abhyangam & Steam',
        image: '/spa/abhyangam.jpg',
        description: 'Full-body Ayurvedic oil massage followed by steam therapy.',
        price: 3000,
      },
      {
        name: 'Kizhi Therapies',
        image: '/spa/kizhi.jpg',
        description: 'Traditional warm herbal poultice treatment.',
        price: 4500,
      },
    ],
  },
  {
    kicker: 'Rituals of',
    title: 'Tranquility',
    items: [
      {
        name: 'Shirodhara & Head and Face Massage',
        image: '/spa/shirodhara.jpg',
        description: 'Shirodhara with a relaxing head and face massage.',
        price: 4500,
      },
      {
        name: 'Thakradhara & Head Massage',
        image: '/spa/thakradhara.jpg',
        description: 'Traditional Thakradhara with head massage.',
        price: 4500,
      },
      {
        name: 'Padabhyangam',
        image: '/spa/padabhyangam.jpg',
        note: 'Lower Limb & Foot Massage',
        description:
          'Traditional Ayurvedic lower-limb and foot massage for relaxation and rejuvenation.',
        price: 1800,
      },
    ],
  },
  {
    kicker: 'The Beauty of',
    title: 'Natural Care',
    items: [
      {
        name: 'Mukhalepam',
        image: '/spa/mukhalepam.jpg',
        note: 'Herbal Face Pack',
        price: 3000,
      },
      {
        name: 'Head & Face Care Package',
        image: '/spa/head-face.jpg',
        description: 'Head Massage · Hair Care · Face Massage · Face Steam · Face Scrub · Face Pack',
        price: 4500,
      },
      {
        name: 'Beauty & Skin Care Package',
        image: '/spa/head-face.jpg',
        description: 'Head Massage · Face Massage · Face Steam · Face Scrub · Face Pack',
        price: 4500,
      },
    ],
  },
]

export const formatInr = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN')}`
