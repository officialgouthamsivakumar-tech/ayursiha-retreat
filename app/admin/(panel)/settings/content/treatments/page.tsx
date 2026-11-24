'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SiteSettings, TreatmentsPageContent } from '@/lib/db'
import AdminToast from '../../../../_components/AdminToast'

const emptyContent: TreatmentsPageContent = {
  heroLabel: '', heroHeading: '', heroSub: '',
  introLabel: '', introHeading: '', introBody: '',
  ctaHeading: '', ctaSub: '',
}

type TpField = keyof TreatmentsPageContent

const MAX: Record<TpField, number> = {
  heroLabel: 30, heroHeading: 80, heroSub: 250,
  introLabel: 30, introHeading: 80, introBody: 600,
  ctaHeading: 80, ctaSub: 200,
}

function CharCount({ val, field }: { val: string; field: string }) {
  const max = MAX[field as TpField]; if (!max) return null
  const len = val.length
  const color = len > max ? '#dc2626' : len > max * 0.85 ? '#d97706' : '#9ca3af'
  return <span style={{ fontSize: '0.72rem', color, marginLeft: 'auto', flexShrink: 0 }}>{len}/{max}</span>
}

function validate(tp: TreatmentsPageContent): Partial<Record<TpField, string>> {
  const e: Partial<Record<TpField, string>> = {}
  const keys = Object.keys(MAX) as TpField[]
  for (const k of keys) {
    const v = tp[k]
    if (!v.trim()) e[k] = 'Required.'
    else if (v.length > MAX[k]) e[k] = `Max ${MAX[k]} characters.`
  }
  return e
}

export default function TreatmentsContentPage() {
  const [form, setForm] = useState<TreatmentsPageContent>(emptyContent)
  const [errors, setErrors] = useState<Partial<Record<TpField, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data.treatmentsPageContent ?? emptyContent); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function set(field: TpField, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    if (Object.keys(v).length) { setErrors(v); setToast({ message: 'Please fix the errors below.', type: 'error' }); return }
    setSaving(true)
    const res = await fetch('/api/admin/settings')
    const current: SiteSettings = await res.json()
    const updated = { ...current, treatmentsPageContent: form }
    const saveRes = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    const data = await saveRes.json()
    if (!saveRes.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data.treatmentsPageContent); setErrors({}); setToast({ message: 'Treatments page saved.', type: 'success' }) }
    setSaving(false)
  }

  const f = form
  const inp = (field: TpField) => errors[field] ? 'admin-input admin-input--error' : 'admin-input'
  const ta  = (field: TpField) => errors[field] ? 'admin-textarea admin-input--error' : 'admin-textarea'

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Treatments Page</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Treatments Page Content</span>
        <Link href="/admin/settings/content" className="admin-btn admin-btn-ghost admin-btn-sm">← Homepage</Link>
      </div>
      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Hero */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Hero Banner</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Background image is set in Contact &amp; Media → Treatments Page Hero Background Image.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.heroLabel} field="heroLabel" /></div>
                  <input className={inp('heroLabel')} value={f.heroLabel} onChange={e => set('heroLabel', e.target.value)} placeholder="Classical Therapies" maxLength={MAX.heroLabel} />
                  {errors.heroLabel && <span className="admin-field-error">{errors.heroLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.heroHeading} field="heroHeading" /></div>
                  <input className={inp('heroHeading')} value={f.heroHeading} onChange={e => set('heroHeading', e.target.value)} placeholder="Our Treatments" maxLength={MAX.heroHeading} />
                  {errors.heroHeading && <span className="admin-field-error">{errors.heroHeading}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-heading *</label><CharCount val={f.heroSub} field="heroSub" /></div>
                <textarea className={ta('heroSub')} value={f.heroSub} onChange={e => set('heroSub', e.target.value)} style={{ minHeight: 72 }} maxLength={MAX.heroSub} />
                {errors.heroSub && <span className="admin-field-error">{errors.heroSub}</span>}
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Intro Section</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.introLabel} field="introLabel" /></div>
                  <input className={inp('introLabel')} value={f.introLabel} onChange={e => set('introLabel', e.target.value)} placeholder="Our Approach" maxLength={MAX.introLabel} />
                  {errors.introLabel && <span className="admin-field-error">{errors.introLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.introHeading} field="introHeading" /></div>
                  <input className={inp('introHeading')} value={f.introHeading} onChange={e => set('introHeading', e.target.value)} placeholder="Treatments that honour the tradition." maxLength={MAX.introHeading} />
                  {errors.introHeading && <span className="admin-field-error">{errors.introHeading}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Body Text *</label><CharCount val={f.introBody} field="introBody" /></div>
                <textarea className={ta('introBody')} value={f.introBody} onChange={e => set('introBody', e.target.value)} style={{ minHeight: 110 }} maxLength={MAX.introBody} />
                {errors.introBody && <span className="admin-field-error">{errors.introBody}</span>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Closing CTA</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Individual treatment cards are managed under Treatments.</span>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.ctaHeading} field="ctaHeading" /></div>
                <input className={inp('ctaHeading')} value={f.ctaHeading} onChange={e => set('ctaHeading', e.target.value)} placeholder="Begin with a consultation." maxLength={MAX.ctaHeading} />
                {errors.ctaHeading && <span className="admin-field-error">{errors.ctaHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-text *</label><CharCount val={f.ctaSub} field="ctaSub" /></div>
                <textarea className={ta('ctaSub')} value={f.ctaSub} onChange={e => set('ctaSub', e.target.value)} placeholder="Our physicians will assess…" style={{ minHeight: 72 }} maxLength={MAX.ctaSub} />
                {errors.ctaSub && <span className="admin-field-error">{errors.ctaSub}</span>}
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
