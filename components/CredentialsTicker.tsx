const items = [
  'Ministry of AYUSH Registered',
  'Classical Kerala Ayurveda',
  'Panchakarma Certified',
  '22 Years of Clinical Practice',
  '18 Specialist Physicians',
  'Authentic Kottakkal Formulations',
  'ISO 9001 Certified Centre',
  '4,800+ Patients Healed',
]

export default function CredentialsTicker() {
  const doubled = [...items, ...items]
  return (
    <div className="creds">
      <div className="creds-track">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="creds-item"
            style={item === '22 Years of Clinical Practice' ? { fontFamily: 'Arial, sans-serif' } : undefined}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
