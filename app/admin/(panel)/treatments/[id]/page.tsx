'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type FormState = {
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
  idx: '', slug: '', tag: '', name: '', body: '', image: '',
  long_description: '', benefits: [''], duration: '', ideal: '', diet_plan: [''],
}

export default function TreatmentFormPage() {
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
      fetch(`/api/admin/treatments/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({
            idx: data.idx ?? '',
            slug: data.slug ?? '',
            tag: data.tag ?? '',
            name: data.name ?? '',
            body: data.body ?? '',
            image: data.image ?? '',
            long_description: data.long_description ?? '',
            benefits: data.benefits?.length ? data.benefits : [''],
            duration: data.duration ?? '',
            ideal: data.ideal ?? '',
            diet_plan: data.diet_plan?.length ? data.diet_plan : [''],
          })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id, isNew])

  function set(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setArr(key: 'benefits' | 'diet_plan', i: number, value: string) {
    setForm(f => {
      const arr = [...f[key]]
      arr[i] = value
      return { ...f, [key]: arr }
    })
  }

  function addArr(key: 'benefits' | 'diet_plan') {
    setForm(f => ({ ...f, [key]: [...f[key], ''] }))
  }

  function removeArr(key: 'benefits' | 'diet_plan', i: number) {
    setForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      benefits: form.benefits.filter(Boolean),
      diet_plan: form.diet_plan.filter(Boolean),
    }

    const url = isNew ? '/api/admin/treatments' : `/api/admin/treatments/${id}`
    const method = isNew ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to save.')
    } else {
      setSuccess('Saved successfully.')
      if (isNew) router.push(`/admin/treatments/${data.id}`)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this treatment? This cannot be undone.')) return
    const res = await fetch(`/api/admin/treatments/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/treatments')
    else setError('Failed to delete.')
  }

  if (loading) return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">Treatment</span></div>
      <div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div>
    </>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">{isNew ? 'New Treatment' : 'Edit Treatment'}</span>
      </div>
      <div className="admin-content">
        <Link href="/admin/treatments" className="admin-back">← Back to Treatments</Link>

        {error && <div className="admin-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="admin-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Index (#)</label>
              <input className="admin-input" value={form.idx} onChange={e => set('idx', e.target.value)} placeholder="01" />
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
              <label className="admin-label">Duration</label>
              <input className="admin-input" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="90 minutes" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Image Path</label>
              <input className="admin-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="/consultation.png" />
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
            <label className="admin-label">Ideal For</label>
            <input className="admin-input" value={form.ideal} onChange={e => set('ideal', e.target.value)} placeholder="First-time visitors, those seeking a personalised wellness plan…" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Benefits</label>
            <div className="admin-array-field">
              {form.benefits.map((b, i) => (
                <div key={i} className="admin-array-item">
                  <input className="admin-input" value={b} onChange={e => setArr('benefits', i, e.target.value)} placeholder={`Benefit ${i + 1}`} />
                  {form.benefits.length > 1 && (
                    <button type="button" className="admin-array-remove" onClick={() => removeArr('benefits', i)}>×</button>
                  )}
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
                  {form.diet_plan.length > 1 && (
                    <button type="button" className="admin-array-remove" onClick={() => removeArr('diet_plan', i)}>×</button>
                  )}
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={() => addArr('diet_plan')}>+ Add guideline</button>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create Treatment' : 'Save Changes'}
            </button>
            {!isNew && (
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
