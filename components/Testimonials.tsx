import TestimonialsScroll from '@/components/TestimonialsScroll'

const testimonials = [
  {
    quote: 'After years of chronic fatigue, the Panchakarma programme gave me my energy back within three weeks. The level of clinical detail — the way they explained each step — made me trust the process completely.',
    lang: 'English',
    name: 'Priya Nair',
    role: 'Yoga Instructor · Bangalore',
    initial: 'P',
    color: 'var(--moss)',
    rtl: false,
  },
  {
    quote: 'Después de años sufriendo dolores crónicos, el programa Panchakarma transformó mi vida en pocas semanas. Los médicos son excepcionalmente atentos y cada tratamiento fue personalizado para mí.',
    lang: 'Español',
    name: 'María González',
    role: 'Profesora · Madrid',
    initial: 'M',
    color: 'var(--gold)',
    rtl: false,
  },
  {
    quote: 'علاج شيروداهارا غيّر حياتي تمامًا. لسنوات عانيت من القلق والأرق، وفي غضون أسابيع قليلة شعرت بسلام داخلي لم أعرفه من قبل. الأطباء هنا متمكنون بشكل استثنائي.',
    lang: 'عربي',
    name: 'خالد المنصوري',
    role: 'رجل أعمال · دبي',
    initial: 'خ',
    color: 'var(--forest)',
    rtl: true,
  },
  {
    quote: 'ޕަންޗަކަރްމާ ފަރުވާއިން ތަޖުރިބާ ކުރި ލުއިކަން ހިތްހަމަޖެހެ. ޑޮކްޓަރުން ވަރަށް ހިތްހެޔޮ، ފަރވާ ވަރަށް ފުރިހަމަ. ހިތާމަތަކުން ދޫވި.',
    lang: 'Dhivehi',
    name: 'އާދަމް ރަޝީދު',
    role: 'ވިޔަފާރިވެރިޔާ · މާލެ',
    initial: 'އ',
    color: 'var(--bark)',
    rtl: true,
  },
  {
    quote: 'I came sceptical. I left a convert. The Shirodhara dissolved seven years of anxiety in a way that no medication had managed. The physicians here are the most knowledgeable Ayurvedic practitioners I have encountered.',
    lang: 'English',
    name: 'Sarah Mitchell',
    role: 'Wellness Coach · London',
    initial: 'S',
    color: 'var(--pine)',
    rtl: false,
  },
  {
    quote: 'El tratamiento Abhyanga con aceites medicinales fue una experiencia profundamente restauradora. Cada sesión estaba diseñada específicamente para mi constitución. Regresaré sin duda.',
    lang: 'Español',
    name: 'Carlos Rodríguez',
    role: 'Chef · Barcelona',
    initial: 'C',
    color: 'var(--fern)',
    rtl: false,
  },
]

export default function Testimonials() {
  return (
    <section className="testi" id="testi">
      <div className="wrap">
        <div className="testi-hd">
          <h2 className="display testi-heading ws r" id="testiH2">
            Stories of transformation
          </h2>
          <p className="testi-aside r">
            Over 4,800 patients have found their way back to health through Ayursiha —
            in their own words, in their own languages.
          </p>
        </div>
      </div>
      <TestimonialsScroll>
          {testimonials.map(({ quote, lang, name, role, initial, color, rtl }) => (
            <div key={name} className="tc">
              <div className="tc-top">
                <div className="tc-rating">★★★★★</div>
                <span className="tc-lang">{lang}</span>
              </div>
              <p className="tc-q" dir={rtl ? 'rtl' : 'ltr'} style={rtl ? { fontFamily: 'system-ui, sans-serif', lineHeight: 1.9 } : undefined}>{quote}</p>
              <div className="tc-meta">
                <div className="tc-av" style={{ background: color }}>{initial}</div>
                <div>
                  <div className="tc-name" dir={rtl ? 'rtl' : 'ltr'}>{name}</div>
                  <div className="tc-role">{role}</div>
                </div>
              </div>
            </div>
          ))}
      </TestimonialsScroll>
    </section>
  )
}
