'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminToast from '../../../_components/AdminToast'

type FormState = { sort_order: number; quote: string; lang: string; name: string; role: string; initial: string; color: string; rtl: boolean }
const empty: FormState = { sort_order: 0, quote: '', lang: 'en', name: '', role: '', initial: '', color: '#2d7a4f', rtl: false }

export default function TestimonialFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [entityCount, setEntityCount] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (isNew) {
      fetch('/api/admin/testimonials').then(r => r.json()).then((list: unknown[]) => { setEntityCount(list.length); setForm(f => ({ ...f, sort_order: list.length })) }).catch(() => {})
    } else {
      Promise.all([fetch(`/api/admin/testimonials/${id}`).then(r => r.json()), fetch('/api/admin/testimonials').then(r => r.json())])
        .then(([data, list]: [Record<string, unknown>, unknown[]]) => {
          setEntityCount(list.length)
          setForm({ sort_order: Number(data.sort_order ?? 0), quote: String(data.quote ?? ''), lang: String(data.lang ?? 'en'), name: String(data.name ?? ''), role: String(data.role ?? ''), initial: String(data.initial ?? ''), color: String(data.color ?? '#2d7a4f'), rtl: Boolean(data.rtl) })
          setLoading(false)
        }).catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setToast({ message: isNew ? 'Testimonial created.' : 'Changes saved.', type: 'success' }); if (isNew) router.push(`/admin/testimonials/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/testimonials')
    else setToast({ message: 'Failed to delete.', type: 'error' })
  }

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Testimonial</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">{isNew ? 'New Testimonial' : 'Edit Testimonial'}</span></div>
      <div className="admin-content">
        <Link href="/admin/testimonials" className="admin-back">← Back to Testimonials</Link>
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>
          <div className="admin-form-group">
            <label className="admin-label">Quote *</label>
            <textarea className="admin-textarea" value={form.quote} onChange={e => set('quote', e.target.value)} placeholder="Patient testimonial…" required />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Patient Name *</label>
              <input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Sarah M." required />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Role / Location</label>
              <input className="admin-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Patient from London" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Initial (avatar)</label>
              <input className="admin-input" value={form.initial} onChange={e => set('initial', e.target.value)} placeholder="S" maxLength={2} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Avatar Color</label>
              <input className="admin-input" value={form.color} onChange={e => set('color', e.target.value)} placeholder="#2d7a4f" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Sort Order *</label>
              <select className="admin-select" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} required>
                {Array.from({ length: isNew ? entityCount + 1 : entityCount }, (_, i) => (
                  <option key={i} value={i}>Position {i + 1}</option>
                ))}
              </select>
              <span className="admin-form-hint">Controls display order on the site.</span>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Language Code</label>
              <input className="admin-input" value={form.lang} onChange={e => set('lang', e.target.value)} placeholder="en" />
              <span className="admin-form-hint">e.g. en, ar, es, dv</span>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ justifyContent: 'flex-end', paddingBottom: '0.5rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={form.rtl} onChange={e => set('rtl', e.target.checked)} />
                Right-to-left language (RTL)
              </label>
            </div>
            <div className="admin-form-group" />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : isNew ? 'Create Testimonial' : 'Save Changes'}</button>
            {!isNew && <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>}
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
