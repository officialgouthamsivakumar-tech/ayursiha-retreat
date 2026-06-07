'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminToast from '../../../_components/AdminToast'

type FormState = { category: string; question: string; answer: string; sort_order: number }
const empty: FormState = { category: '', question: '', answer: '', sort_order: 0 }
const CATEGORIES = ['About Ayurveda', 'Your First Visit', 'Treatments', 'Practical Information']

export default function FaqFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/faqs/${id}`)
        .then(r => r.json())
        .then(data => { setForm({ category: data.category ?? '', question: data.question ?? '', answer: data.answer ?? '', sort_order: data.sort_order ?? 0 }); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(isNew ? '/api/admin/faqs' : `/api/admin/faqs/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setToast({ message: isNew ? 'FAQ created.' : 'Changes saved.', type: 'success' }); if (isNew) router.push(`/admin/faqs/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this FAQ?')) return
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/faqs')
    else setToast({ message: 'Failed to delete.', type: 'error' })
  }

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">FAQ</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">{isNew ? 'New FAQ' : 'Edit FAQ'}</span></div>
      <div className="admin-content">
        <Link href="/admin/faqs" className="admin-back">← Back to FAQs</Link>
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select className="admin-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__custom">+ Custom category</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Sort Order</label>
              <input type="number" className="admin-input" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
              <span className="admin-form-hint">Lower numbers appear first within a category.</span>
            </div>
          </div>
          {form.category === '__custom' && (
            <div className="admin-form-group">
              <label className="admin-label">Custom Category Name *</label>
              <input className="admin-input" placeholder="Enter category name…" onChange={e => set('category', e.target.value)} required />
            </div>
          )}
          <div className="admin-form-group">
            <label className="admin-label">Question *</label>
            <input className="admin-input" value={form.question} onChange={e => set('question', e.target.value)} placeholder="What is Ayurveda?" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Answer *</label>
            <textarea className="admin-textarea" style={{ minHeight: 140 }} value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="Write the answer here…" required />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : isNew ? 'Create FAQ' : 'Save Changes'}</button>
            {!isNew && <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>}
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
