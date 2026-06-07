'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminToast from '../../../_components/AdminToast'

type FormState = {
  sort_order: number
  name: string
  title: string
  qualification: string
  department: string
  bio: string
  photo: string
}

const empty: FormState = { sort_order: 0, name: '', title: '', qualification: '', department: '', bio: '', photo: '' }

export default function PhysicianFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [entityCount, setEntityCount] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [dimError, setDimError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const prevPhotoRef = useRef('')

  useEffect(() => {
    if (isNew) {
      fetch('/api/admin/physicians').then(r => r.json()).then((list: unknown[]) => { setEntityCount(list.length); setForm(f => ({ ...f, sort_order: list.length })) }).catch(() => {})
    } else {
      Promise.all([fetch(`/api/admin/physicians/${id}`).then(r => r.json()), fetch('/api/admin/physicians').then(r => r.json())])
        .then(([data, list]: [Record<string, unknown>, unknown[]]) => {
          setEntityCount(list.length)
          const photo = String(data.image ?? data.photo ?? '')
          setForm({ sort_order: Number(data.sort_order ?? 0), name: String(data.name ?? ''), title: String(data.title ?? ''), qualification: String(data.qualification ?? ''), department: String(data.department ?? ''), bio: String(data.bio ?? ''), photo })
          prevPhotoRef.current = photo
          setLoading(false)
        }).catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) { setForm(f => ({ ...f, [key]: value })) }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setDimError('')
    if (file.size > 5 * 1024 * 1024) { setDimError('Image must be under 5 MB.'); return }
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.src = url
    await new Promise(res => { img.onload = res; img.onerror = res })
    URL.revokeObjectURL(url)
    if (img.naturalWidth < 300 || img.naturalHeight < 300) { setDimError('Image must be at least 300×300 px.'); return }
    if (img.naturalWidth > 4000 || img.naturalHeight > 4000) { setDimError('Image must not exceed 4000×4000 px.'); return }
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) { setDimError(data.error || 'Upload failed.'); setUploading(false); return }
    const oldPath = prevPhotoRef.current
    if (oldPath.startsWith('/uploads/')) { fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: oldPath }) }).catch(() => {}) }
    set('photo', data.url)
    prevPhotoRef.current = data.url
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, image: form.photo }
    const res = await fetch(isNew ? '/api/admin/physicians' : `/api/admin/physicians/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setToast({ message: isNew ? 'Physician created.' : 'Changes saved.', type: 'success' }); if (isNew) router.push(`/admin/physicians/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this physician?')) return
    if (form.photo.startsWith('/uploads/')) { fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: form.photo }) }).catch(() => {}) }
    const res = await fetch(`/api/admin/physicians/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/physicians')
    else setToast({ message: 'Failed to delete.', type: 'error' })
  }

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Physician</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">{isNew ? 'New Physician' : 'Edit Physician'}</span></div>
      <div className="admin-content">
        <Link href="/admin/physicians" className="admin-back">← Back to Physicians</Link>
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Portrait photo upload */}
          <div className="admin-form-group">
            <label className="admin-label">Portrait Photo</label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {form.photo ? (
                <div style={{ width: 100, height: 120, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                  <Image src={form.photo} alt="Portrait preview" fill style={{ objectFit: 'cover', objectPosition: 'top' }} unoptimized />
                </div>
              ) : (
                <div style={{ width: 100, height: 120, borderRadius: 10, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : form.photo ? 'Replace Photo' : 'Upload Photo'}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handlePhotoChange} />
                <span className="admin-form-hint">JPEG/PNG/WebP · min 300×300 px · max 5 MB</span>
                {dimError && <span className="admin-field-error">{dimError}</span>}
                {form.photo && (
                  <input className="admin-input" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }} value={form.photo} onChange={e => set('photo', e.target.value)} placeholder="/uploads/photo.jpg" />
                )}
              </div>
            </div>
          </div>

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

          <div className="admin-form-group" style={{ maxWidth: 240 }}>
            <label className="admin-label">Sort Order *</label>
            <select className="admin-select" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} required>
              {Array.from({ length: isNew ? entityCount + 1 : entityCount }, (_, i) => (
                <option key={i} value={i}>Position {i + 1}</option>
              ))}
            </select>
            <span className="admin-form-hint">Controls display order on the site.</span>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || uploading}>{saving ? 'Saving…' : isNew ? 'Create Physician' : 'Save Changes'}</button>
            {!isNew && <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>}
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
