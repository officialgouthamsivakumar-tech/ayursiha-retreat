import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function PhysiciansListPage() {
  let physicians: Record<string, string>[] = []
  try {
    const { data } = await supabaseAdmin.from('physicians').select('id,name,title,qualification,department').order('created_at')
    physicians = data ?? []
  } catch {}

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Physicians</span>
      </div>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Physicians</h1>
            <p className="admin-page-subtitle">{physicians.length} physician{physicians.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/admin/physicians/new" className="admin-btn admin-btn-primary">+ New Physician</Link>
        </div>

        <div className="admin-card">
          {physicians.length === 0 ? (
            <div className="admin-empty">
              No physicians yet. <Link href="/admin/physicians/new" style={{ color: '#2d7a4f' }}>Add the first one.</Link>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Title</th><th>Department</th><th>Qualification</th><th></th></tr>
                </thead>
                <tbody>
                  {physicians.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>{p.title}</td>
                      <td><span className="admin-badge admin-badge-green">{p.department}</span></td>
                      <td>{p.qualification}</td>
                      <td>
                        <Link href={`/admin/physicians/${p.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</Link>
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
