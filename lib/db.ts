import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { treatments as staticTreatments } from './treatments'
import { testimonials as staticTestimonials } from './testimonials'
import type { Treatment } from './treatments'
import type { Testimonial, Physician, FaqCategory } from '@/types'

const DATA_DIR = join(process.cwd(), 'data')

type Row = Record<string, unknown>

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readData(name: string, seed: Row[]): Row[] {
  ensureDir()
  const file = join(DATA_DIR, `${name}.json`)
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(seed, null, 2))
    return seed
  }
  try {
    return JSON.parse(readFileSync(file, 'utf-8')) as Row[]
  } catch {
    return seed
  }
}

function writeData(name: string, data: Row[]): void {
  ensureDir()
  writeFileSync(join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2))
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const treatmentSeed: Row[] = staticTreatments.map(t => ({
  id: randomUUID(),
  idx: t.idx, slug: t.slug, tag: t.tag, name: t.name, body: t.body,
  image: t.image, long_description: t.longDescription, benefits: t.benefits,
  duration: t.duration, ideal: t.ideal, diet_plan: t.dietPlan,
  created_at: new Date().toISOString(),
}))

const testimonialSeed: Row[] = staticTestimonials.map(t => ({
  id: randomUUID(),
  quote: t.quote, lang: t.lang, name: t.name, role: t.role,
  initial: t.initial, color: t.color, rtl: t.rtl,
  created_at: new Date().toISOString(),
}))

const physicianSeed: Row[] = [
  { id: randomUUID(), name: 'Dr. Shaheen Siddique M', title: 'Chairman & Managing Director', qualification: 'BAMS, MS Ayu', department: 'Ayurveda', bio: 'Over a decade of clinical practice spanning government service, the National Research Institute for Panchakarma, and senior roles at leading Ayurvedic hospitals. Specialises in Panchakarma, neuro rehabilitation, stroke recovery, and lifestyle diseases.', image: 'https://ayursiha.com/wp-content/uploads/2020/11/Dr-1.webp', created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Dr. Razeena Muhammed', title: 'Ayurvedic Physician', qualification: 'BAMS, AYU', department: 'Ayurveda', bio: 'An excellent physician with an exemplary track record of more than a decade. Specialises in Panchakarma therapies, neuro rehabilitation, and the management of chronic and lifestyle disorders.', image: 'https://ayursiha.com/wp-content/uploads/2023/11/IMG_9894.jpg', created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Dr. Merin Jose', title: 'Ayurvedic Physician', qualification: 'BAMS, AYU', department: 'Ayurveda', bio: 'A compassionate and knowledgeable physician, deeply committed to providing personalised care and promoting holistic healing through classical Ayurvedic principles.', image: 'https://ayursiha.com/wp-content/uploads/2024/08/Dr.-Merin-Jose-e1723134988155.jpg', created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Dr. Muzzammil', title: 'Unani Physician', qualification: 'BUMS', department: 'Unani', bio: 'One of the best known Unani physicians in Kerala. Specialises in the prevention and treatment of lifestyle disorders, acute and chronic diseases through traditional Unani therapeutic methods.', image: 'https://ayursiha.com/wp-content/uploads/2020/11/Dr.Muzzammil.jpg', created_at: new Date().toISOString() },
]

const faqSeed: Row[] = [
  { id: randomUUID(), category: 'About Ayurveda', question: 'What is Ayurveda?', answer: "Ayurveda is the world's oldest complete medical system, originating in India over 5,000 years ago. It is based on the understanding that health is a state of balance between the body, mind, and spirit — governed by three fundamental bio-energies called doshas: Vata, Pitta, and Kapha.", sort_order: 0, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'About Ayurveda', question: 'Is Ayurveda scientifically validated?', answer: 'Yes. Many Ayurvedic formulations and practices have been studied extensively and are supported by peer-reviewed research. The Ministry of AYUSH, Government of India, oversees and certifies Ayurvedic practitioners and institutions. At Ayursiha, all treatments are administered by qualified physicians with formal Ayurvedic medical degrees (BAMS/MD).', sort_order: 1, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'About Ayurveda', question: 'Can Ayurveda be used alongside modern medicine?', answer: 'In most cases, yes — but this must be assessed individually. Our physicians will review your current medications and medical history during your consultation. We work in an integrative manner and will advise you transparently if any treatment is contraindicated alongside your existing care.', sort_order: 2, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Your First Visit', question: 'What happens during my first consultation?', answer: 'Your initial consultation lasts approximately 90 minutes. Our physician will conduct Nadi Pareeksha (pulse diagnosis), examine your tongue, eyes, and skin, and take a thorough history covering your diet, sleep, stress, and medical background. From this, your Prakriti (constitution) and Vikriti (current imbalance) are determined, and a personalised treatment plan is prescribed.', sort_order: 0, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Your First Visit', question: 'Do I need to prepare anything before my visit?', answer: 'Arrive with a light stomach — avoid heavy meals for at least two hours before your appointment. Bring any relevant medical reports, prescriptions, or test results. Wear comfortable, loose-fitting clothing. Avoid applying strong perfumes or oils on the day of treatment.', sort_order: 1, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Your First Visit', question: 'How long will my treatment programme last?', answer: 'This varies based on your condition and goals. A single therapy session may last 45–90 minutes. Panchakarma programmes typically run 7 to 21 days. Chronic conditions may require a structured programme of 4–8 weeks. Your physician will prescribe a specific timeline during your consultation.', sort_order: 2, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Treatments', question: 'Are the treatments painful?', answer: 'Ayurvedic therapies are generally deeply relaxing and non-invasive. Some procedures, such as Virechana (therapeutic purgation) or Nasya (nasal administration), may involve mild temporary discomfort, but are carefully managed by our physicians and therapists. You will be fully briefed before any procedure begins.', sort_order: 0, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Treatments', question: 'Can I choose my own treatments?', answer: 'We encourage you to share your goals and areas of concern. However, specific therapies are always prescribed by our physician based on your Prakriti assessment — not self-selected. Administering incorrect treatments can aggravate imbalances. Trust in the clinical process is central to the Ayursiha experience.', sort_order: 1, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Treatments', question: 'What oils and herbs are used?', answer: 'We use classical formulations prepared according to traditional Ayurvedic texts. Our in-house pharmacy prepares medicated oils (taila), ghee (ghrita), and herbal decoctions (kashaya) fresh for each patient. All ingredients are ethically sourced and free from synthetic additives.', sort_order: 2, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Practical Information', question: 'Where are you located?', answer: 'Ayursiha Retreat is located at 11/310 Thuruth, Aluva, Chowara, Kerala 683101. We are easily accessible from Aluva, Kochi, and Ernakulam. Detailed directions and transportation guidance will be shared upon booking.', sort_order: 0, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Practical Information', question: 'What are your operating hours?', answer: 'We are open Monday to Saturday, 8:00 am to 7:00 pm. Consultations and treatments are by appointment only. We are closed on Sundays and public holidays.', sort_order: 1, created_at: new Date().toISOString() },
  { id: randomUUID(), category: 'Practical Information', question: 'How do I book a consultation?', answer: 'You can book directly through our website by clicking "Book Consultation", calling us at +91 487 244 0000, or emailing ayursihahospital@gmail.com. Our team will confirm your appointment within 24 hours and share pre-visit guidance.', sort_order: 2, created_at: new Date().toISOString() },
]

function getSeed(entity: string): Row[] {
  switch (entity) {
    case 'treatments':   return treatmentSeed
    case 'testimonials': return testimonialSeed
    case 'physicians':   return physicianSeed
    case 'faqs':         return faqSeed
    default:             return []
  }
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export function getAllRecords(entity: string): Row[] {
  return readData(entity, getSeed(entity))
}

export function getRecord(entity: string, id: string): Row | null {
  return getAllRecords(entity).find(r => r.id === id) ?? null
}

export function createRecord(entity: string, data: Row): Row {
  const records = getAllRecords(entity)
  const record: Row = { ...data, id: randomUUID(), created_at: new Date().toISOString() }
  records.push(record)
  writeData(entity, records)
  return record
}

export function updateRecord(entity: string, id: string, data: Row): Row | null {
  const records = getAllRecords(entity)
  const i = records.findIndex(r => r.id === id)
  if (i === -1) return null
  records[i] = { ...records[i], ...data, id }
  writeData(entity, records)
  return records[i]
}

export function deleteRecord(entity: string, id: string): boolean {
  const records = getAllRecords(entity)
  const filtered = records.filter(r => r.id !== id)
  if (filtered.length === records.length) return false
  writeData(entity, filtered)
  return true
}

export function countRecords(entity: string): number {
  return getAllRecords(entity).length
}

// ─── Public queries (used by public site pages) ───────────────────────────────

export async function getTreatments(): Promise<Treatment[]> {
  const rows = getAllRecords('treatments')
  if (!rows.length) return staticTreatments
  return rows.map(mapTreatment)
}

export async function getTreatmentBySlug(slug: string): Promise<Treatment | undefined> {
  const rows = getAllRecords('treatments')
  const row = rows.find(r => r.slug === slug)
  if (!row) return staticTreatments.find(t => t.slug === slug)
  return mapTreatment(row)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = getAllRecords('testimonials')
  if (!rows.length) return staticTestimonials
  return rows.map(row => ({
    quote: String(row.quote ?? ''),
    lang: String(row.lang ?? 'en'),
    name: String(row.name ?? ''),
    role: String(row.role ?? ''),
    initial: String(row.initial ?? ''),
    color: String(row.color ?? '#2d7a4f'),
    rtl: Boolean(row.rtl),
  }))
}

export async function getPhysicians(): Promise<Physician[]> {
  const rows = getAllRecords('physicians')
  if (!rows.length) return []
  return rows.map(row => ({
    name: String(row.name ?? ''),
    title: String(row.title ?? ''),
    qualification: String(row.qualification ?? ''),
    department: String(row.department ?? ''),
    bio: String(row.bio ?? ''),
    image: String(row.image ?? ''),
  }))
}

export async function getFaqs(): Promise<FaqCategory[]> {
  const rows = getAllRecords('faqs').sort((a, b) =>
    String(a.category ?? '').localeCompare(String(b.category ?? '')) ||
    Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  )
  if (!rows.length) return []

  const grouped: Record<string, FaqCategory> = {}
  for (const row of rows) {
    const cat = String(row.category)
    if (!grouped[cat]) grouped[cat] = { category: cat, items: [] }
    grouped[cat].items.push({ q: String(row.question), a: String(row.answer) })
  }
  return Object.values(grouped)
}

function mapTreatment(row: Row): Treatment {
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
