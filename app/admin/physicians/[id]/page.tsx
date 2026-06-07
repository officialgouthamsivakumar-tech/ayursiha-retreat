'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type FormState = {
  name: string; title: string; qualification: string
  department: string; bio: string; image: string
}

const empty: FormState = { name: '', title: '', qualification: '', department: '', bio: '', image: '' }

export default function PhysicianFormPage() {
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
      fetch(`/api/admin/physicians/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({ name: data.name ?? '', title: data.title ?? '', qualification: data.qualification ?? '', department: data.department ?? '', bio: data.bio ?? '', image: data.image ?? '' })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    const res = await fetch(isNew ? '/api/admin/physicians' : `/api/admin/physicians/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to save.') }
    else { setSuccess('Saved successfully.'); if (isNew) router.push(`/admin/physicians/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this physician?')) return
    const res = await fetch(`/api/admin/physicians/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/physicians')
    else setError('Failed to delete.')
  }

  if (loading) return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">Physician</span></div>
      <div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div>
    </>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">{isNew ? 'New Physician' : 'Edit Physician'}</span>
      </div>
      <div className="admin-content">
        <Link href="/admin/physicians" className="admin-back">← Back to Physicians</Link>
        {error && <div className="admin-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="admin-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Full Name *</label>
              <input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Shaheen Siddique M" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Title</label>
              <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Chairman & Managing Director" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Qualification</label>
              <input className="admin-input" value={form.qualification} onChange={e => set('qualification', e.target.value)} placeholder="BAMS, MS Ayu" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Department</label>
              <input className="admin-input" value={form.department} onChange={e => set('department', e.target.value)} placeholder="Ayurveda" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Bio</label>
            <textarea className="admin-textarea" style={{ minHeight: 120 }} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Professional background and specialisation…" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Photo URL</label>
            <input className="admin-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://…" />
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="preview" style={{ marginTop: '0.5rem', height: 80, width: 80, objectFit: 'cover', borderRadius: 8 }} />
            )}
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create Physician' : 'Save Changes'}
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
