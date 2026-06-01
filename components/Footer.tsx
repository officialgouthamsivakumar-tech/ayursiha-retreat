const treatments = [
  'Ayurvedic Consultation', 'Panchakarma', 'Shirodhara',
  'Abhyanga', 'Kizhi Therapy', 'Rasayana Programme',
]
const centre = [
  'About Ayursiha', 'Our Physicians', 'Philosophy',
  'Certifications', 'Patient Stories', 'Blog',
]
const visit   = ['Getting Here', 'Accommodation', 'FAQs']
const social  = ['Instagram', 'Facebook', 'YouTube']

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft-top">
          <div>
            <div className="ft-brand-name">Ayursiha</div>
            <div className="ft-brand-rule" />
            <p className="ft-brand-p">
              A Ministry of AYUSH registered Ayurvedic healing centre in Thrissur, Kerala —
              practising classical Ayurveda with clinical rigour since 2002.
            </p>
            <div className="ft-brand-contacts">
              <a href="tel:+914872440000">+91 487 244 0000</a>
              <a href="mailto:consult@ayursiha.com">consult@ayursiha.com</a>
              <a href="#">CAS Group Holdings, 11/310, Thuruth, Aluva, Chowara, Kerala 683101</a>
              <a href="#">Mon – Sat · 8:00 am – 7:00 pm</a>
            </div>
          </div>

          <div>
            <div className="ft-col-h">Treatments</div>
            <ul className="ft-links">
              {treatments.map(t => <li key={t}><a href="#">{t}</a></li>)}
            </ul>
          </div>

          <div>
            <div className="ft-col-h">Centre</div>
            <ul className="ft-links">
              {centre.map(t => <li key={t}><a href="#">{t}</a></li>)}
            </ul>
          </div>

          <div>
            <div className="ft-col-h">Visit</div>
            <ul className="ft-links">
              {visit.map(t => <li key={t}><a href="#">{t}</a></li>)}
            </ul>
            <div className="ft-col-h" style={{ marginTop: '2rem' }}>Follow</div>
            <ul className="ft-links">
              {social.map(t => <li key={t}><a href="#">{t}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="ft-bottom">
          <span>&copy; 2026 Ayursiha Ayurvedic Healing Centre, Thrissur</span>
          <span>Designed with intention and care.</span>
        </div>
      </div>
    </footer>
  )
}
