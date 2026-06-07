import Link from 'next/link'
import { countRecords } from '@/lib/db'

export default function AdminDashboard() {
  const sections = [
    {
      label: 'Treatments', count: countRecords('treatments'), href: '/admin/treatments',
      icon: <svg className="admin-stat-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3v14M3 10h14" /><circle cx="10" cy="10" r="8" /></svg>,
    },
    {
      label: 'Testimonials', count: countRecords('testimonials'), href: '/admin/testimonials',
      icon: <svg className="admin-stat-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 12a2 2 0 01-2 2H5l-3 3V5a2 2 0 012-2h11a2 2 0 012 2v7z" /></svg>,
    },
    {
      label: 'Physicians', count: countRecords('physicians'), href: '/admin/physicians',
      icon: <svg className="admin-stat-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="6" r="4" /><path d="M2 18c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>,
    },
    {
      label: 'FAQs', count: countRecords('faqs'), href: '/admin/faqs',
      icon: <svg className="admin-stat-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="8" /><path d="M8 8a2 2 0 114 0c0 1.5-2 2-2 3M10 15v.5" /></svg>,
    },
  ]

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">Dashboard</span></div>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Welcome back</h1>
            <p className="admin-page-subtitle">Manage your website content from here.</p>
          </div>
        </div>

        <div className="admin-stats-grid">
          {sections.map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
              <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
                {s.icon}
                <div className="admin-stat-number">{s.count}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Quick Actions</span></div>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: '+ New Treatment', href: '/admin/treatments/new' },
              { label: '+ New Testimonial', href: '/admin/testimonials/new' },
              { label: '+ New Physician', href: '/admin/physicians/new' },
              { label: '+ New FAQ', href: '/admin/faqs/new' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="admin-btn admin-btn-ghost">{a.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
