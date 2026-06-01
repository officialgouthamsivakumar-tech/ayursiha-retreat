const treatments = [
  {
    idx: '01', tag: '90 min',
    name: 'Ayurvedic Consultation',
    body: 'Comprehensive Prakriti and Vikriti analysis with a senior physician. Pulse diagnosis, lifestyle review, and a personalised treatment roadmap.',
    image: '/consultation.png',
  },
  {
    idx: '02', tag: '7–21 days',
    name: 'Panchakarma',
    body: 'Five classical purification procedures administered in sequence to achieve deep cellular detoxification and metabolic reset.',
    image: '/panchakarma.png',
  },
  {
    idx: '03', tag: '60–90 min',
    name: 'Shirodhara',
    body: 'A continuous medicated oil stream poured over the Ajna chakra — proven to reduce cortisol and dissolve chronic anxiety and insomnia.',
    image: '/shirodhara.png',
  },
  {
    idx: '04', tag: '60 min',
    name: 'Abhyanga',
    body: 'Synchronised four-hand herbal oil massage. Nourishes all seven dhatus, stimulates lymphatic flow, and calms Vata.',
    image: '/abhyanga.jpg',
  },
  {
    idx: '05', tag: '45 min',
    name: 'Kizhi Therapy',
    body: 'Warm bolus massage using medicated rice, herbal powders, or leaves — highly effective for musculoskeletal conditions and joint inflammation.',
    image: '/kizhi.png',
  },
  {
    idx: '06', tag: 'Ongoing',
    name: 'Rasayana Programme',
    body: 'Post-treatment rejuvenation combining classical formulations and dietary protocols. Rebuilds ojas — the marker of deep vitality.',
    image: '/rasayana.png',
  },
]

export default function Treatments() {
  return (
    <section className="treatments" id="treatments">

      {/* Header */}
      <div className="treat-header-wrap">
        <p className="label r">Classical Therapies</p>
        <h2 className="display treat-heading ws r" id="treatH2">
          Treatments that honour the tradition
        </h2>
        <p className="treat-subhead r">
          Every treatment is prescribed after a thorough Prakriti and Vikriti assessment —
          duration, oils, herbs, and technique, all calibrated to your unique constitution.
        </p>
        <a href="#cta" className="btn btn-outline r">
          Book a Consultation
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 7h10M8 3l4 4-4 4" />
          </svg>
        </a>
      </div>

      {/* Cards */}
      <div className="treat-grid">
        {treatments.map(({ idx, tag, name, body, image }) => (
          <div
            key={idx}
            className="t-card r t-card--bg"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="t-card-bg-overlay" />
            <div className="t-card-inner">
              <div className="t-card-top">
                <span className="t-card-idx">{idx}</span>
                <span className="t-card-tag">{tag}</span>
              </div>
              <div className="t-card-bottom">
                <div className="t-card-name">{name}</div>
                <p className="t-card-body">{body}</p>
                <div className="t-card-action">Learn more</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
