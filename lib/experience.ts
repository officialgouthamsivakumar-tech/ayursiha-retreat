import type { ExperienceCard } from '@/types'

export const experiences: ExperienceCard[] = [
  {
    label: 'Elemental Wellness',
    title: 'Panchakarma & Classical Healing',
    body: 'Immerse yourself in the oldest and most complete system of medicine in the world. Our Panchakarma programmes are meticulously designed by qualified physicians — combining Shodhana purification, Shaman balancing therapies, and classical herbal formulations to restore your body at a cellular level. Every session is unhurried, purposeful, and deeply personal.',
    link: '/#treatments',
    image: '/panchakarma.png',
    imageAlt: 'Panchakarma therapy at Ayursiha',
    reverse: false,
  },
  {
    label: 'Bespoke Programmes',
    title: 'Your Personalised Healing Plan',
    body: 'No two constitutions are the same — and no two treatment plans at Ayursiha are the same. Your stay begins with a comprehensive Prakriti assessment: pulse diagnosis, tongue analysis, and a full review of your medical history. From this, your physician designs a protocol entirely your own — specific therapies, herbal formulations, dietary guidelines, and a daily rhythm calibrated to your constitution.',
    link: '/about',
    image: '/consultation.png',
    imageAlt: 'Personalised Ayurvedic consultation',
    reverse: true,
  },
  {
    label: 'Mindful Movement',
    title: 'Yoga & Meditation Sessions',
    body: 'Practised at sunrise in our open-air pavilion, daily yoga and pranayama sessions are tailored to complement your Ayurvedic treatment plan and your unique Prakriti. Guided by experienced instructors, each session aligns your body with the natural rhythms of the day — amplifying the healing effect of every therapy and cultivating a stillness that extends far beyond your stay.',
    link: '/#yoga',
    image: '/yoga.png',
    imageAlt: 'Yoga session at Ayursiha',
    reverse: false,
  },
  {
    label: 'Lasting Restoration',
    title: 'Rasayana & Post-Stay Care',
    body: 'Healing at Ayursiha does not end at discharge. Before you leave, your physician prepares a complete post-stay protocol — classical Rasayana rejuvenation herbs, dietary recommendations, lifestyle adjustments, and scheduled follow-up consultations. Your take-home kit and ongoing physician access ensure that the restoration you began here continues to deepen long after you return home.',
    link: '/#treatments',
    image: '/rasayana.png',
    imageAlt: 'Rasayana herbal preparations',
    reverse: true,
  },
]
