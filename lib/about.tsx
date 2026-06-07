import type { Physician, AboutStat } from '@/types'

export const physicians: Physician[] = [
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

export const aboutStats: AboutStat[] = [
  { value: '2002', label: 'Year Founded' },
  { value: '4,800+', label: 'Patients Healed' },
  { value: '22+', label: 'Years of Practice' },
  { value: '97%', label: 'Patient Satisfaction' },
]

export const aboutPillars = [
  {
    title: 'Classical Integrity',
    body: 'We follow the original Ayurvedic texts — Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam — without dilution or commercialisation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    title: 'Physician-Led Care',
    body: 'Every treatment plan is designed and supervised by qualified BAMS-degree physicians. No templates — only personalised protocols.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    title: 'Root-Cause Focus',
    body: 'We never suppress symptoms. Every therapy identifies and eliminates the underlying doshic imbalance at its source.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    title: 'Lasting Restoration',
    body: 'Healing does not end at discharge. Follow-up consultations, herbal protocols, and dietary guidance ensure continued wellbeing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/>
        <path d="M12 12C12 12 17 9.5 19 7"/>
        <path d="M12 12C12 12 7 9.5 5 7"/>
      </svg>
    ),
  },
]
