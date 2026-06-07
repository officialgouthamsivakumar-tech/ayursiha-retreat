'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Overview',
    href: '/admin',
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
]

const contentItems = [
  {
    label: 'Treatments',
    href: '/admin/treatments',
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 2v12M2 8h12" /><circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 10a2 2 0 01-2 2H4l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v6z" />
      </svg>
    ),
  },
  {
    label: 'Physicians',
    href: '/admin/physicians',
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    label: 'FAQs',
    href: '/admin/faqs',
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" /><path d="M6.5 6a1.5 1.5 0 013 .5c0 1-1.5 1.5-1.5 2.5M8 12v.5" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-logo">
        <Image src="/logo.png" alt="Ayursiha" width={160} height={64} style={{ objectFit: 'contain', objectPosition: 'left', filter: 'brightness(0) invert(1)' }} />
        <span className="admin-logo-sub">Admin Panel</span>
      </Link>

      <nav className="admin-nav">
        <div className="admin-nav-section">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${isActive(item.href) ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="admin-nav-section">
          <p className="admin-nav-section-label">Content</p>
          {contentItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${isActive(item.href) ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="admin-nav-section">
          <p className="admin-nav-section-label">Configuration</p>
          <Link
            href="/admin/settings"
            className={`admin-nav-link${pathname === '/admin/settings' ? ' active' : ''}`}
          >
            <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 2h2.5l1 3-1.5 1a9 9 0 004 4l1-1.5 3 1V13a1 1 0 01-1 1C5.4 14 2 10.6 2 3a1 1 0 011-1z" />
            </svg>
            Contact &amp; Media
          </Link>
          <Link
            href="/admin/settings/content"
            className={`admin-nav-link${pathname.startsWith('/admin/settings/content') ? ' active' : ''}`}
          >
            <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4h12M2 8h8M2 12h10" />
            </svg>
            Homepage Content
          </Link>
        </div>

        <div className="admin-nav-section">
          <p className="admin-nav-section-label">Site</p>
          <a href="/" target="_blank" rel="noopener" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4v4M14 2L7 9" />
            </svg>
            View Website
          </a>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l4 3-4 3M14 8H6" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
