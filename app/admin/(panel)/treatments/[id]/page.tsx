'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminToast from '../../../_components/AdminToast'

type FormState = {
  sort_order: number
  idx: string
  slug: string
  tag: string
  name: string
  body: string
  image: string
  long_description: string
  benefits: string[]
  duration: string
  ideal: string
  diet_plan: string[]
}

const empty: FormState = {
  sort_order: 0, idx: '01', slug: '', tag: '', name: '', body: '', image: '',
  long_description: '', benefits: [''], duration: '', ideal: '', diet_plan: [''],
}

export default function TreatmentFormPage() {
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
  const [durationError, setDurationError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const prevImageRef = useRef('')

  useEffect(() => {
    if (isNew) {
      fetch('/api/admin/treatments').then(r => r.json()).then((list: unknown[]) => {
        setEntityCount(list.length)
        setForm(f => ({ ...f, sort_order: list.length, idx: String(list.length + 1).padStart(2, '0') }))
      }).catch(() => {})
    } else {
      Promise.all([fetch(`/api/admin/treatments/${id}`).then(r => r.json()), fetch('/api/admin/treatments').then(r => r.json())])
        .then(([data, list]: [Record<string, unknown>, unknown[]]) => {
          setEntityCount(list.length)
          setForm({
            sort_order: Number(data.sort_order ?? 0),
            idx: String(data.idx ?? '01'),
            slug: String(data.slug ?? ''),
            tag: String(data.tag ?? ''),
            name: String(data.name ?? ''),
            body: String(data.body ?? ''),
            image: String(data.image ?? ''),
            long_description: String(data.long_description ?? ''),
            benefits: Array.isArray(data.benefits) && (data.benefits as string[]).length ? data.benefits as string[] : [''],
            duration: String(data.duration ?? ''),
            ideal: String(data.ideal ?? ''),
            diet_plan: Array.isArray(data.diet_plan) && (data.diet_plan as string[]).length ? data.diet_plan as string[] : [''],
          })
          prevImageRef.current = String(data.image ?? '')
          setLoading(false)
        }).catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) { setForm(f => ({ ...f, [key]: value })) }

  function setArr(key: 'benefits' | 'diet_plan', i: number, value: string) {
    setForm(f => { const arr = [...f[key]]; arr[i] = value; return { ...f, [key]: arr } })
  }
  function addArr(key: 'benefits' | 'diet_plan') { setForm(f => ({ ...f, [key]: [...f[key], ''] })) }
  function removeArr(key: 'benefits' | 'diet_plan', i: number) { setForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== i) })) }

  function handleSortChange(pos: number) {
    setForm(f => ({ ...f, sort_order: pos, idx: String(pos + 1).padStart(2, '0') }))
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setDimError('')
    if (file.size > 5 * 1024 * 1024) { setDimError('Image must be under 5 MB.'); return }
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.src = url
    await new Promise(res => { img.onload = res; img.onerror = res })
    URL.revokeObjectURL(url)
    if (img.naturalWidth < 400 || img.naturalHeight < 300) { setDimError('Image must be at least 400×300 px.'); return }
    if (img.naturalWidth > 4000 || img.naturalHeight > 4000) { setDimError('Image must not exceed 4000×4000 px.'); return }
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) { setDimError(data.error || 'Upload failed.'); setUploading(false); return }
    const oldPath = prevImageRef.current
    if (oldPath.startsWith('/uploads/')) { fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: oldPath }) }).catch(() => {}) }
    set('image', data.url)
    prevImageRef.current = data.url
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (form.duration && (isNaN(Number(form.duration)) || Number(form.duration) < 1)) {
      setDurationError('Duration must be a positive number.')
      return
    }
    setDurationError('')
    setSaving(true)
    const payload = { ...form, benefits: form.benefits.filter(Boolean), diet_plan: form.diet_plan.filter(Boolean) }
    const res = await fetch(isNew ? '/api/admin/treatments' : `/api/admin/treatments/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setToast({ message: isNew ? 'Treatment created.' : 'Changes saved.', type: 'success' }); if (isNew) router.push(`/admin/treatments/${data.id}`) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this treatment? This cannot be undone.')) return
    if (form.image.startsWith('/uploads/')) { fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: form.image }) }).catch(() => {}) }
    const res = await fetch(`/api/admin/treatments/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/treatments')
    else setToast({ message: 'Failed to delete.', type: 'error' })
  }

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Treatment</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">{isNew ? 'New Treatment' : 'Edit Treatment'}</span></div>
      <div className="admin-content">
        <Link href="/admin/treatments" className="admin-back">← Back to Treatments</Link>
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Image upload */}
          <div className="admin-form-group">
            <label className="admin-label">Treatment Image</label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {form.image ? (
                <div style={{ width: 200, height: 130, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                  <Image src={form.image} alt="Treatment preview" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              ) : (
                <div style={{ width: 200, height: 130, borderRadius: 10, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : form.image ? 'Replace Image' : 'Upload Image'}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageChange} />
                <span className="admin-form-hint">JPEG/PNG/WebP · min 400×300 px · max 5 MB</span>
                {dimError && <span className="admin-field-error">{dimError}</span>}
              </div>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Sort Order *</label>
              <select className="admin-select" value={form.sort_order} onChange={e => handleSortChange(Number(e.target.value))} required>
                {Array.from({ length: isNew ? entityCount + 1 : entityCount }, (_, i) => (
                  <option key={i} value={i}>Position {i + 1}</option>
                ))}
              </select>
              <span className="admin-form-hint">Controls card order and the displayed number.</span>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Slug *</label>
              <input className="admin-input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="ayurvedic-consultation" required />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ayurvedic Consultation" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Tag</label>
              <input className="admin-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="90 min" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Duration (minutes)</label>
              <input
                type="number"
                className={durationError ? 'admin-input admin-input--error' : 'admin-input'}
                value={form.duration}
                onChange={e => { set('duration', e.target.value); if (durationError) setDurationError('') }}
                placeholder="90"
                min="1"
              />
              {durationError
                ? <span className="admin-field-error">{durationError}</span>
                : <span className="admin-form-hint">Enter a number in minutes, e.g. 60</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Ideal For</label>
              <input className="admin-input" value={form.ideal} onChange={e => set('ideal', e.target.value)} placeholder="First-time visitors, those seeking a wellness plan…" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Short Description</label>
            <textarea className="admin-textarea" value={form.body} onChange={e => set('body', e.target.value)} placeholder="Brief description shown on the treatments list page…" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Full Description</label>
            <textarea className="admin-textarea" style={{ minHeight: 140 }} value={form.long_description} onChange={e => set('long_description', e.target.value)} placeholder="Detailed description shown on the treatment detail page…" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Benefits</label>
            <div className="admin-array-field">
              {form.benefits.map((b, i) => (
                <div key={i} className="admin-array-item">
                  <input className="admin-input" value={b} onChange={e => setArr('benefits', i, e.target.value)} placeholder={`Benefit ${i + 1}`} />
                  {form.benefits.length > 1 && <button type="button" className="admin-array-remove" onClick={() => removeArr('benefits', i)}>×</button>}
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={() => addArr('benefits')}>+ Add benefit</button>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Diet Plan</label>
            <div className="admin-array-field">
              {form.diet_plan.map((d, i) => (
                <div key={i} className="admin-array-item">
                  <input className="admin-input" value={d} onChange={e => setArr('diet_plan', i, e.target.value)} placeholder={`Diet guideline ${i + 1}`} />
                  {form.diet_plan.length > 1 && <button type="button" className="admin-array-remove" onClick={() => removeArr('diet_plan', i)}>×</button>}
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={() => addArr('diet_plan')}>+ Add guideline</button>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || uploading}>{saving ? 'Saving…' : isNew ? 'Create Treatment' : 'Save Changes'}</button>
            {!isNew && <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>}
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
