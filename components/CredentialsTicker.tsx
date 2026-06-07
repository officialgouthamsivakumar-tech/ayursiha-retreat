import { getSettings } from '@/lib/db'

export default async function CredentialsTicker() {
  const settings = getSettings()
  const items = settings.credentials.length ? settings.credentials : []
  const doubled = [...items, ...items]

  return (
    <div className="creds">
      <div className="creds-track">
        {doubled.map((item, i) => (
          <div key={i} className="creds-item">{item}</div>
        ))}
      </div>
    </div>
  )
}
