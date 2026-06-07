import type { FaqCategory } from '@/types'

export const faqs: FaqCategory[] = [
  {
    category: 'About Ayurveda',
    items: [
      {
        q: 'What is Ayurveda?',
        a: 'Ayurveda is the world\'s oldest complete medical system, originating in India over 5,000 years ago. It is based on the understanding that health is a state of balance between the body, mind, and spirit — governed by three fundamental bio-energies called doshas: Vata, Pitta, and Kapha.',
      },
      {
        q: 'Is Ayurveda scientifically validated?',
        a: 'Yes. Many Ayurvedic formulations and practices have been studied extensively and are supported by peer-reviewed research. The Ministry of AYUSH, Government of India, oversees and certifies Ayurvedic practitioners and institutions. At Ayursiha, all treatments are administered by qualified physicians with formal Ayurvedic medical degrees (BAMS/MD).',
      },
      {
        q: 'Can Ayurveda be used alongside modern medicine?',
        a: 'In most cases, yes — but this must be assessed individually. Our physicians will review your current medications and medical history during your consultation. We work in an integrative manner and will advise you transparently if any treatment is contraindicated alongside your existing care.',
      },
    ],
  },
  {
    category: 'Your First Visit',
    items: [
      {
        q: 'What happens during my first consultation?',
        a: 'Your initial consultation lasts approximately 90 minutes. Our physician will conduct Nadi Pareeksha (pulse diagnosis), examine your tongue, eyes, and skin, and take a thorough history covering your diet, sleep, stress, and medical background. From this, your Prakriti (constitution) and Vikriti (current imbalance) are determined, and a personalised treatment plan is prescribed.',
      },
      {
        q: 'Do I need to prepare anything before my visit?',
        a: 'Arrive with a light stomach — avoid heavy meals for at least two hours before your appointment. Bring any relevant medical reports, prescriptions, or test results. Wear comfortable, loose-fitting clothing. Avoid applying strong perfumes or oils on the day of treatment.',
      },
      {
        q: 'How long will my treatment programme last?',
        a: 'This varies based on your condition and goals. A single therapy session may last 45–90 minutes. Panchakarma programmes typically run 7 to 21 days. Chronic conditions may require a structured programme of 4–8 weeks. Your physician will prescribe a specific timeline during your consultation.',
      },
    ],
  },
  {
    category: 'Treatments',
    items: [
      {
        q: 'Are the treatments painful?',
        a: 'Ayurvedic therapies are generally deeply relaxing and non-invasive. Some procedures, such as Virechana (therapeutic purgation) or Nasya (nasal administration), may involve mild temporary discomfort, but are carefully managed by our physicians and therapists. You will be fully briefed before any procedure begins.',
      },
      {
        q: 'Can I choose my own treatments?',
        a: 'We encourage you to share your goals and areas of concern. However, specific therapies are always prescribed by our physician based on your Prakriti assessment — not self-selected. Administering incorrect treatments can aggravate imbalances. Trust in the clinical process is central to the Ayursiha experience.',
      },
      {
        q: 'What oils and herbs are used?',
        a: 'We use classical formulations prepared according to traditional Ayurvedic texts. Our in-house pharmacy prepares medicated oils (taila), ghee (ghrita), and herbal decoctions (kashaya) fresh for each patient. All ingredients are ethically sourced and free from synthetic additives.',
      },
    ],
  },
  {
    category: 'Practical Information',
    items: [
      {
        q: 'Where are you located?',
        a: 'Ayursiha Retreat is located at 11/310 Thuruth, Aluva, Chowara, Kerala 683101. We are easily accessible from Aluva, Kochi, and Ernakulam. Detailed directions and transportation guidance will be shared upon booking.',
      },
      {
        q: 'What are your operating hours?',
        a: 'We are open Monday to Saturday, 8:00 am to 7:00 pm. Consultations and treatments are by appointment only. We are closed on Sundays and public holidays.',
      },
      {
        q: 'How do I book a consultation?',
        a: 'You can book directly through our website by clicking "Book Consultation", calling us at +91 487 244 0000, or emailing ayursihahospital@gmail.com. Our team will confirm your appointment within 24 hours and share pre-visit guidance.',
      },
    ],
  },
]
