import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TreatmentsListPage() {
  let treatments: Record<string, string>[] = []
  try {
    const { data } = await supabaseAdmin.from('treatments').select('id,idx,name,slug,tag,duration').order('idx')
    treatments = data ?? []
  } catch {}

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Treatments</span>
      </div>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Treatments</h1>
            <p className="admin-page-subtitle">{treatments.length} treatment{treatments.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/admin/treatments/new" className="admin-btn admin-btn-primary">
            + New Treatment
          </Link>
        </div>

        <div className="admin-card">
          {treatments.length === 0 ? (
            <div className="admin-empty">
              No treatments yet. <Link href="/admin/treatments/new" style={{ color: '#2d7a4f' }}>Add the first one.</Link>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Tag</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: '#9ca3af' }}>{t.idx}</td>
                      <td style={{ fontWeight: 500 }}>{t.name}</td>
                      <td><code style={{ fontSize: '0.8rem', background: '#f3f4f6', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{t.slug}</code></td>
                      <td>{t.tag}</td>
                      <td>{t.duration}</td>
                      <td>
                        <Link href={`/admin/treatments/${t.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                          Edit
                        </Link>
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
