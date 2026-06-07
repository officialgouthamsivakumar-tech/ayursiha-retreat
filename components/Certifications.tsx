const certs = [
  {
    id: 'iso',
    label: 'ISO 9001:2015',
    badge: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M 16 45 A 46 46 0 0 1 104 45" fill="none" stroke="none"/>
        <text fontSize="8" fontWeight="600" letterSpacing="3" fill="currentColor" fontFamily="Arial">
          <textPath href="#iso-arc" startOffset="50%" textAnchor="middle">CERTIFIED</textPath>
        </text>
        <defs>
          <path id="iso-arc" d="M 18 52 A 44 44 0 0 1 102 52"/>
          <path id="iso-arc-b" d="M 102 72 A 44 44 0 0 1 18 72"/>
        </defs>
        <rect x="25" y="55" width="70" height="32" rx="3" fill="currentColor"/>
        <text x="60" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial">ISO</text>
        <text x="60" y="88" textAnchor="middle" fontSize="8" fontWeight="500" fill="#fff" fontFamily="Arial">9001:2015</text>
        <text fontSize="7.5" fontWeight="600" letterSpacing="2.5" fill="currentColor" fontFamily="Arial">
          <textPath href="#iso-arc-b" startOffset="50%" textAnchor="middle">COMPANY</textPath>
        </text>
      </svg>
    ),
  },
  {
    id: 'gmp',
    label: 'GMP Certified',
    badge: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <defs>
          <path id="gmp-top" d="M 16 50 A 46 46 0 0 1 104 50"/>
          <path id="gmp-bot" d="M 100 74 A 44 44 0 0 1 20 74"/>
        </defs>
        <text fontSize="6.5" fontWeight="600" letterSpacing="1.5" fill="currentColor" fontFamily="Arial">
          <textPath href="#gmp-top" startOffset="50%" textAnchor="middle">GOOD MANUFACTURING PRACTICE</textPath>
        </text>
        <rect x="24" y="54" width="72" height="32" rx="3" fill="currentColor"/>
        <text x="60" y="75" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff" fontFamily="Arial">GMP</text>
        <path d="M48 82 l5 5 9-9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <text fontSize="7" fontWeight="600" letterSpacing="1.5" fill="currentColor" fontFamily="Arial">
          <textPath href="#gmp-bot" startOffset="50%" textAnchor="middle">★ CERTIFIED ★</textPath>
        </text>
      </svg>
    ),
  },
  {
    id: 'nabh',
    label: 'NABH Accredited',
    badge: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <defs>
          <path id="nabh-top" d="M 16 50 A 46 46 0 0 1 104 50"/>
          <path id="nabh-bot" d="M 100 76 A 44 44 0 0 1 20 76"/>
        </defs>
        <text fontSize="6" fontWeight="500" letterSpacing="1.2" fill="currentColor" fontFamily="Arial">
          <textPath href="#nabh-top" startOffset="50%" textAnchor="middle">PATIENT SAFETY &amp; QUALITY OF CARE</textPath>
        </text>
        {/* Caduceus-style icon */}
        <ellipse cx="60" cy="52" rx="12" ry="17" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="60" y1="35" x2="60" y2="69" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="54" y1="48" x2="66" y2="48" stroke="currentColor" strokeWidth="1.5"/>
        <text x="60" y="84" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="2" fill="currentColor" fontFamily="Arial">NABH</text>
        <text fontSize="6.5" fontWeight="500" letterSpacing="1" fill="currentColor" fontFamily="Arial">
          <textPath href="#nabh-bot" startOffset="50%" textAnchor="middle">· ACCREDITED ·</textPath>
        </text>
      </svg>
    ),
  },
  {
    id: 'ayur',
    label: 'Ayur Diamond',
    badge: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <circle cx="60" cy="60" r="56" fill="currentColor"/>
        <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <text x="60" y="52" textAnchor="middle" fontSize="18" fontWeight="300" fontStyle="italic" fill="#fff" fontFamily="Georgia, serif">Ayur</text>
        <line x1="32" y1="58" x2="88" y2="58" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
        <text x="60" y="72" textAnchor="middle" fontSize="13" fontWeight="300" fontStyle="italic" fill="rgba(255,255,255,0.85)" fontFamily="Georgia, serif">Diamond</text>
        <polygon points="60,80 68,88 60,96 52,88" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      </svg>
    ),
  },
]

export default function Certifications() {
  return (
    <section className="certs-section">
      <div className="wrap">
        <div className="certs-hd">
          <p className="label r">Accreditations</p>
          <h2 className="certs-heading r">Certifications &amp; Standards</h2>
        </div>
        <div className="certs-grid">
          {certs.map(({ id, badge, label }) => (
            <div key={id} className="cert-item r">
              <div className="cert-badge">{badge}</div>
              <span className="cert-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
