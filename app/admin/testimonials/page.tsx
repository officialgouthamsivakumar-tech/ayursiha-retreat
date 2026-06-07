import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TestimonialsListPage() {
  let testimonials: Record<string, string>[] = []
  try {
    const { data } = await supabaseAdmin.from('testimonials').select('id,name,role,lang,quote').order('created_at')
    testimonials = data ?? []
  } catch {}

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Testimonials</span>
      </div>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Testimonials</h1>
            <p className="admin-page-subtitle">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/admin/testimonials/new" className="admin-btn admin-btn-primary">+ New Testimonial</Link>
        </div>

        <div className="admin-card">
          {testimonials.length === 0 ? (
            <div className="admin-empty">
              No testimonials yet. <Link href="/admin/testimonials/new" style={{ color: '#2d7a4f' }}>Add the first one.</Link>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Lang</th><th>Quote</th><th></th></tr>
                </thead>
                <tbody>
                  {testimonials.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500 }}>{t.name}</td>
                      <td>{t.role}</td>
                      <td><span className="admin-badge admin-badge-gray">{t.lang}</span></td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280' }}>
                        {t.quote}
                      </td>
                      <td>
                        <Link href={`/admin/testimonials/${t.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
