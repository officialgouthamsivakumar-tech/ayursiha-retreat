'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type FormState = {
  quote: string; lang: string; name: string; role: string
  initial: string; color: string; rtl: boolean
}

const empty: FormState = { quote: '', lang: 'en', name: '', role: '', initial: '', color: '#2d7a4f', rtl: false }

export default function TestimonialFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/testimonials/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({ quote: data.quote ?? '', lang: data.lang ?? 'en', name: data.name ?? '', role: data.role ?? '', initial: data.initial ?? '', color: data.color ?? '#2d7a4f', rtl: data.rtl ?? false })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    const res = await fetch(isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to save.') }
    else { setSuccess('Saved successfully.'); if (isNew) router.push(`/admin/testimonials/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/testimonials')
    else setError('Failed to delete.')
  }

  if (loading) return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">Testimonial</span></div>
      <div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div>
    </>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">{isNew ? 'New Testimonial' : 'Edit Testimonial'}</span>
      </div>
      <div className="admin-content">
        <Link href="/admin/testimonials" className="admin-back">← Back to Testimonials</Link>
        {error && <div className="admin-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="admin-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="admin-form" onSubmit={handleSave}>
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
              <label className="admin-label">Language Code</label>
              <input className="admin-input" value={form.lang} onChange={e => set('lang', e.target.value)} placeholder="en" />
              <span className="admin-form-hint">e.g. en, ar, es, dv</span>
            </div>
            <div className="admin-form-group" style={{ justifyContent: 'flex-end', paddingBottom: '0.5rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={form.rtl} onChange={e => set('rtl', e.target.checked)} />
                Right-to-left language (RTL)
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create Testimonial' : 'Save Changes'}
            </button>
            {!isNew && (
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
