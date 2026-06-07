export interface Testimonial {
  quote: string
  lang: string
  name: string
  role: string
  initial: string
  color: string
  rtl: boolean
}

export interface Pillar {
  step: string
  name: string
  body: string
}

export interface Stat {
  n: string
  l: string
}

export interface Physician {
  name: string
  title: string
  qualification: string
  department: string
  bio: string
  image: string
}

export interface AboutStat {
  value: string
  label: string
}

export interface AboutPillar {
  title: string
  body: string
  icon: React.ReactNode
}

export interface ExperienceCard {
  label: string
  title: string
  body: string
  link: string
  image: string
  imageAlt: string
  reverse: boolean
}

export interface FaqItem {
  q: string
  a: string
}

export interface FaqCategory {
  category: string
  items: FaqItem[]
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  treatment: string
  date: string
  message: string
}

export interface YogaHighlight {
  value: string
  label: string
}
