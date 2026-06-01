import React from 'react'

const steps = [
  {
    n: '01', title: 'Consultation',
    body: 'A 60-minute session with your physician. Pulse diagnosis, tongue analysis, and a thorough review of your health history and lifestyle.',
  },
  {
    n: '02', title: 'Diagnosis',
    body: 'A personalised plan: specific therapies, herbal formulations, dietary guidance, and a realistic timeline. Nothing generic.',
  },
  {
    n: '03', title: 'Treatment',
    body: 'Classical therapies administered by certified practitioners in our purpose-built suites. Unhurried, immersive, and deeply restorative.',
  },
  {
    n: '04', title: 'Restoration',
    body: 'Ongoing support: herbal protocols, dietary plans, and follow-up consultations so the healing continues long after you leave.',
  },
]

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="process-hd">
          <p className="label r">Your Healing Journey</p>
          <h2 className="display r ws" id="procH2">Four steps to lasting wellness</h2>
        </div>
        <div className="process-steps stagger">
          {steps.map(({ n, title, body }, i) => (
            <div key={n} className="ps r" style={{ '--i': i } as React.CSSProperties}>
              <div className="ps-dot">{n}</div>
              <div className="ps-title">{title}</div>
              <p className="ps-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
