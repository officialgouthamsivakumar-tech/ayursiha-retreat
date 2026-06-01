import React from 'react'
import StatCounter from '@/components/StatCounter'

const pillars = [
  { step: 'Step 1', name: 'Nidan Parivarjan',  body: 'Remove the root cause. Ayurveda never suppresses symptoms — it eliminates the source.' },
  { step: 'Step 2', name: 'Shodhan Chikitsa',  body: 'Classical purification through Panchakarma — cellular-level detoxification.' },
  { step: 'Step 3', name: 'Shaman Chikitsa',   body: 'Restore doshic balance with targeted herbal formulations and dietary protocols.' },
  { step: 'Step 4', name: 'Rasayana',           body: 'Rebuild tissue quality and long-term vitality through Ayurvedic rejuvenation.' },
]

const stats = [
  { n: '4,800+', l: 'Patients healed' },
  { n: '22',     l: 'Years of practice' },
  { n: '97%',    l: 'Patient satisfaction' },
]

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="wrap">
        <div className="phil-inner">

          <div className="phil-left">
            <p className="label rl">Our Approach</p>
            <blockquote className="phil-quote rl" style={{ marginTop: '1rem' }}>
              We treat the whole person — their constitution, their history, their life — not just the condition they walk in with.
            </blockquote>
            <div className="phil-stats stagger">
              {stats.map(({ n, l }, i) => (
                <div key={l} className="phil-stat rl" style={{ '--i': i } as React.CSSProperties}>
                  <StatCounter value={n} />
                  <span className="phil-stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="phil-right">
            <p className="label rr">Classical Ayurveda</p>
            <h2 className="display phil-heading ws rr" id="philH2">
              Healing rooted in 5,000 years of science
            </h2>
            <p className="phil-body rr">
              Ayurveda is not alternative medicine — it is the world&apos;s oldest complete medical
              system. At Ayursiha, we practice it as it was intended: rigorously, personally, and
              with deep respect for the texts from which it came.
            </p>
            <p className="phil-body rr">
              Every consultation begins with a comprehensive Prakriti assessment — your unique
              doshic constitution. From there, every therapy, every herb, every dietary
              recommendation is calibrated to you alone. There are no templates here.
            </p>
            <div className="phil-pillars">
              {pillars.map(({ step, name, body }) => (
                <div key={step} className="pillar rr">
                  <div className="pillar-en">{step}</div>
                  <div className="pillar-sa">{name}</div>
                  <p className="pillar-body">{body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
