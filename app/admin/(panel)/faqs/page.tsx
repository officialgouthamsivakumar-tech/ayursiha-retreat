import Link from 'next/link'
import { getAllRecords } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default function FaqsListPage() {
  const faqs = getAllRecords('faqs').sort((a, b) =>
    String(a.category ?? '').localeCompare(String(b.category ?? '')) ||
    Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  ) as Record<string, string>[]

  const categories = [...new Set(faqs.map(f => f.category))]

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">FAQs</span></div>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">FAQs</h1>
            <p className="admin-page-subtitle">{faqs.length} question{faqs.length !== 1 ? 's' : ''} across {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <Link href="/admin/faqs/new" className="admin-btn admin-btn-primary">+ New FAQ</Link>
        </div>

        {faqs.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty">No FAQs yet. <Link href="/admin/faqs/new" style={{ color: '#2d7a4f' }}>Add the first one.</Link></div>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat} className="admin-card" style={{ marginBottom: '1.25rem' }}>
              <div className="admin-card-header"><span className="admin-card-title">{cat}</span></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Question</th><th>Answer</th><th></th></tr></thead>
                  <tbody>
                    {faqs.filter(f => f.category === cat).map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 500, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.question}</td>
                        <td style={{ color: '#6b7280', maxWidth: 360, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.answer}</td>
                        <td><Link href={`/admin/faqs/${f.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
