import Link from 'next/link'
import { countRecords } from '@/lib/db'

export default function AdminDashboard() {
  const counts = {
    treatments:  countRecords('treatments'),
    testimonials: countRecords('testimonials'),
    physicians:  countRecords('physicians'),
    faqs:        countRecords('faqs'),
  }

  const stats = [
    {
      label: 'Treatments', count: counts.treatments, href: '/admin/treatments', newHref: '/admin/treatments/new',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="10"/></svg>,
      color: '#2d7a4f', bg: '#dcfce7',
    },
    {
      label: 'Testimonials', count: counts.testimonials, href: '/admin/testimonials', newHref: '/admin/testimonials/new',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
      color: '#1d6fa8', bg: '#dbeafe',
    },
    {
      label: 'Physicians', count: counts.physicians, href: '/admin/physicians', newHref: '/admin/physicians/new',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0114 0v2"/></svg>,
      color: '#7c3aed', bg: '#ede9fe',
    },
    {
      label: 'FAQs', count: counts.faqs, href: '/admin/faqs', newHref: '/admin/faqs/new',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/></svg>,
      color: '#b45309', bg: '#fef3c7',
    },
  ]

  const modules = [
    {
      label: 'Treatments',
      desc: 'Manage therapy cards, descriptions, benefits and diet plans.',
      href: '/admin/treatments',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="10"/></svg>,
      accent: '#2d7a4f',
    },
    {
      label: 'Testimonials',
      desc: 'Add and edit patient reviews shown on the homepage.',
      href: '/admin/testimonials',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
      accent: '#1d6fa8',
    },
    {
      label: 'Physicians',
      desc: 'Update doctor profiles, qualifications and portraits.',
      href: '/admin/physicians',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0114 0v2"/></svg>,
      accent: '#7c3aed',
    },
    {
      label: 'FAQs',
      desc: 'Manage frequently asked questions by category.',
      href: '/admin/faqs',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/></svg>,
      accent: '#b45309',
    },
    {
      label: 'Site Settings',
      desc: 'Contact info, videos, credentials, stats and about page.',
      href: '/admin/settings',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      accent: '#0f2419',
    },
    {
      label: 'View Live Site',
      desc: 'Open the public-facing website in a new tab.',
      href: '/',
      external: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
      accent: '#6b7280',
    },
  ]

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Dashboard</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20"/></svg>
          View Site
        </a>
      </div>

      <div className="admin-content">

        {/* Welcome banner */}
        <div className="dash-welcome">
          <div className="dash-welcome-leaf" aria-hidden="true">
            <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 150 C20 120 0 80 10 30 C40 10 90 20 110 60 C130 100 100 140 60 150Z" fill="rgba(45,122,79,0.18)"/>
              <path d="M60 150 C60 150 60 80 60 30" stroke="rgba(45,122,79,0.3)" strokeWidth="1.5"/>
              <path d="M60 80 C40 65 25 55 10 30" stroke="rgba(45,122,79,0.2)" strokeWidth="1"/>
              <path d="M60 100 C80 85 95 70 110 60" stroke="rgba(45,122,79,0.2)" strokeWidth="1"/>
            </svg>
          </div>
          <div>
            <p className="dash-welcome-eyebrow">Ayursiha Admin</p>
            <h1 className="dash-welcome-title">Welcome back</h1>
            <p className="dash-welcome-sub">Manage your website content — treatments, testimonials, physicians, FAQs, and site settings.</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="dash-stats">
          {stats.map(s => (
            <Link key={s.label} href={s.href} className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="dash-stat-number">{s.count}</div>
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-arrow" style={{ color: s.color }}>
                Manage
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick add */}
        <div className="dash-quick">
          <p className="dash-section-label">Quick Add</p>
          <div className="dash-quick-row">
            {stats.map(s => (
              <Link key={s.newHref} href={s.newHref} className="dash-quick-btn" style={{ '--accent': s.color } as React.CSSProperties}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 2v10M2 7h10" strokeLinecap="round"/></svg>
                New {s.label.replace(/s$/, '')}
              </Link>
            ))}
          </div>
        </div>

        {/* Content modules */}
        <p className="dash-section-label" style={{ marginTop: '2rem' }}>Content Sections</p>
        <div className="dash-modules">
          {modules.map(m => (
            <Link
              key={m.label}
              href={m.href}
              className="dash-module-card"
              {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <div className="dash-module-icon" style={{ color: m.accent }}>{m.icon}</div>
              <div className="dash-module-label">{m.label}</div>
              <div className="dash-module-desc">{m.desc}</div>
              <div className="dash-module-go" style={{ color: m.accent }}>
                {m.external ? 'Open' : 'Edit'}
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </>
  )
}
