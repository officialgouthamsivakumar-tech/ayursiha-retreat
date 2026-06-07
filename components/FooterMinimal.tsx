import { getSettings } from '@/lib/db'

export default function FooterMinimal() {
  const settings = getSettings()
  const telHref = `tel:${settings.phone.replace(/\s/g, '')}`

  return (
    <footer className="ft-minimal">
      <div className="ft-minimal-inner">
        <div className="ft-minimal-contact">
          <a href={telHref}>{settings.phone}</a>
          <span className="ft-minimal-sep" />
          <a href="mailto:ayursihahospital@gmail.com">ayursihahospital@gmail.com</a>
        </div>
        <span className="ft-minimal-copy">&copy; 2026 Ayursiha Ayurvedic Healing Centre</span>
      </div>
    </footer>
  )
}
