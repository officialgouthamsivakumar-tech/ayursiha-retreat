import { supabaseAdmin } from './supabase'
import { treatments as staticTreatments } from './treatments'
import type { Treatment } from './treatments'
import type { Testimonial, Physician, FaqCategory } from '@/types'

// Treatments
export async function getTreatments(): Promise<Treatment[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('treatments')
      .select('*')
      .order('idx')
    if (error || !data?.length) return staticTreatments
    return data.map(mapTreatment)
  } catch {
    return staticTreatments
  }
}

export async function getTreatmentBySlug(slug: string): Promise<Treatment | undefined> {
  try {
    const { data, error } = await supabaseAdmin
      .from('treatments')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error || !data) return staticTreatments.find(t => t.slug === slug)
    return mapTreatment(data)
  } catch {
    return staticTreatments.find(t => t.slug === slug)
  }
}

function mapTreatment(row: Record<string, unknown>): Treatment {
  return {
    idx: String(row.idx ?? ''),
    slug: String(row.slug ?? ''),
    tag: String(row.tag ?? ''),
    name: String(row.name ?? ''),
    body: String(row.body ?? ''),
    image: String(row.image ?? ''),
    longDescription: String(row.long_description ?? ''),
    benefits: (row.benefits as string[]) || [],
    duration: String(row.duration ?? ''),
    ideal: String(row.ideal ?? ''),
    dietPlan: (row.diet_plan as string[]) || [],
  }
}

// Testimonials
import { testimonials as staticTestimonials } from './testimonials'

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at')
    if (error || !data?.length) return staticTestimonials
    return data.map(row => ({
      quote: String(row.quote ?? ''),
      lang: String(row.lang ?? 'en'),
      name: String(row.name ?? ''),
      role: String(row.role ?? ''),
      initial: String(row.initial ?? ''),
      color: String(row.color ?? '#2d7a4f'),
      rtl: Boolean(row.rtl),
    }))
  } catch {
    return staticTestimonials
  }
}

// Physicians
const staticPhysicians: Physician[] = [
  {
    name: 'Dr. Shaheen Siddique M',
    title: 'Chairman & Managing Director',
    qualification: 'BAMS, MS Ayu',
    department: 'Ayurveda',
    bio: 'Over a decade of clinical practice spanning government service, the National Research Institute for Panchakarma, and senior roles at leading Ayurvedic hospitals. Specialises in Panchakarma, neuro rehabilitation, stroke recovery, and lifestyle diseases.',
    image: 'https://ayursiha.com/wp-content/uploads/2020/11/Dr-1.webp',
  },
  {
    name: 'Dr. Razeena Muhammed',
    title: 'Ayurvedic Physician',
    qualification: 'BAMS, AYU',
    department: 'Ayurveda',
    bio: 'An excellent physician with an exemplary track record of more than a decade. Specialises in Panchakarma therapies, neuro rehabilitation, and the management of chronic and lifestyle disorders.',
    image: 'https://ayursiha.com/wp-content/uploads/2023/11/IMG_9894.jpg',
  },
  {
    name: 'Dr. Merin Jose',
    title: 'Ayurvedic Physician',
    qualification: 'BAMS, AYU',
    department: 'Ayurveda',
    bio: 'A compassionate and knowledgeable physician, deeply committed to providing personalised care and promoting holistic healing through classical Ayurvedic principles.',
    image: 'https://ayursiha.com/wp-content/uploads/2024/08/Dr.-Merin-Jose-e1723134988155.jpg',
  },
  {
    name: 'Dr. Muzzammil',
    title: 'Unani Physician',
    qualification: 'BUMS',
    department: 'Unani',
    bio: 'One of the best known Unani physicians in Kerala. Specialises in the prevention and treatment of lifestyle disorders, acute and chronic diseases through traditional Unani therapeutic methods.',
    image: 'https://ayursiha.com/wp-content/uploads/2020/11/Dr.Muzzammil.jpg',
  },
]

export async function getPhysicians(): Promise<Physician[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('physicians')
      .select('*')
      .order('created_at')
    if (error || !data?.length) return staticPhysicians
    return data.map(row => ({
      name: String(row.name ?? ''),
      title: String(row.title ?? ''),
      qualification: String(row.qualification ?? ''),
      department: String(row.department ?? ''),
      bio: String(row.bio ?? ''),
      image: String(row.image ?? ''),
    }))
  } catch {
    return staticPhysicians
  }
}

// FAQs
const staticFaqs: FaqCategory[] = [
  {
    category: 'About Ayurveda',
    items: [
      { q: 'What is Ayurveda?', a: "Ayurveda is the world's oldest complete medical system, originating in India over 5,000 years ago. It is based on the understanding that health is a state of balance between the body, mind, and spirit — governed by three fundamental bio-energies called doshas: Vata, Pitta, and Kapha." },
      { q: 'Is Ayurveda scientifically validated?', a: 'Yes. Many Ayurvedic formulations and practices have been studied extensively and are supported by peer-reviewed research. The Ministry of AYUSH, Government of India, oversees and certifies Ayurvedic practitioners and institutions. At Ayursiha, all treatments are administered by qualified physicians with formal Ayurvedic medical degrees (BAMS/MD).' },
      { q: 'Can Ayurveda be used alongside modern medicine?', a: 'In most cases, yes — but this must be assessed individually. Our physicians will review your current medications and medical history during your consultation. We work in an integrative manner and will advise you transparently if any treatment is contraindicated alongside your existing care.' },
    ],
  },
  {
    category: 'Your First Visit',
    items: [
      { q: 'What happens during my first consultation?', a: 'Your initial consultation lasts approximately 90 minutes. Our physician will conduct Nadi Pareeksha (pulse diagnosis), examine your tongue, eyes, and skin, and take a thorough history covering your diet, sleep, stress, and medical background. From this, your Prakriti (constitution) and Vikriti (current imbalance) are determined, and a personalised treatment plan is prescribed.' },
      { q: 'Do I need to prepare anything before my visit?', a: 'Arrive with a light stomach — avoid heavy meals for at least two hours before your appointment. Bring any relevant medical reports, prescriptions, or test results. Wear comfortable, loose-fitting clothing. Avoid applying strong perfumes or oils on the day of treatment.' },
      { q: 'How long will my treatment programme last?', a: 'This varies based on your condition and goals. A single therapy session may last 45–90 minutes. Panchakarma programmes typically run 7 to 21 days. Chronic conditions may require a structured programme of 4–8 weeks. Your physician will prescribe a specific timeline during your consultation.' },
    ],
  },
  {
    category: 'Treatments',
    items: [
      { q: 'Are the treatments painful?', a: 'Ayurvedic therapies are generally deeply relaxing and non-invasive. Some procedures, such as Virechana (therapeutic purgation) or Nasya (nasal administration), may involve mild temporary discomfort, but are carefully managed by our physicians and therapists. You will be fully briefed before any procedure begins.' },
      { q: 'Can I choose my own treatments?', a: 'We encourage you to share your goals and areas of concern. However, specific therapies are always prescribed by our physician based on your Prakriti assessment — not self-selected. Administering incorrect treatments can aggravate imbalances. Trust in the clinical process is central to the Ayursiha experience.' },
      { q: 'What oils and herbs are used?', a: 'We use classical formulations prepared according to traditional Ayurvedic texts. Our in-house pharmacy prepares medicated oils (taila), ghee (ghrita), and herbal decoctions (kashaya) fresh for each patient. All ingredients are ethically sourced and free from synthetic additives.' },
    ],
  },
  {
    category: 'Practical Information',
    items: [
      { q: 'Where are you located?', a: 'Ayursiha Retreat is located at 11/310 Thuruth, Aluva, Chowara, Kerala 683101. We are easily accessible from Aluva, Kochi, and Ernakulam. Detailed directions and transportation guidance will be shared upon booking.' },
      { q: 'What are your operating hours?', a: 'We are open Monday to Saturday, 8:00 am to 7:00 pm. Consultations and treatments are by appointment only. We are closed on Sundays and public holidays.' },
      { q: 'How do I book a consultation?', a: 'You can book directly through our website by clicking "Book Consultation", calling us at +91 487 244 0000, or emailing ayursihahospital@gmail.com. Our team will confirm your appointment within 24 hours and share pre-visit guidance.' },
    ],
  },
]

export async function getFaqs(): Promise<FaqCategory[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .order('category')
      .order('sort_order')
    if (error || !data?.length) return staticFaqs

    const grouped: Record<string, FaqCategory> = {}
    for (const row of data) {
      const cat = String(row.category)
      if (!grouped[cat]) grouped[cat] = { category: cat, items: [] }
      grouped[cat].items.push({ q: String(row.question), a: String(row.answer) })
    }
    return Object.values(grouped)
  } catch {
    return staticFaqs
  }
}
