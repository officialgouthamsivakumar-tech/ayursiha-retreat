'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SiteSettings, AboutPageContent, AboutPillar } from '@/lib/db'
import AdminToast from '../../../../_components/AdminToast'

const emptyContent: AboutPageContent = {
  heroLabel: '', heroHeading: '', heroSub: '',
  storyLabel: '', storyHeadingLine1: '', storyHeadingLine2: '',
  storyBody1: '', storyBody2: '', storyBody3: '',
  missionQuote: '',
  pillarsLabel: '', pillarsHeading: '',
  pillars: [
    { title: '', body: '' }, { title: '', body: '' },
    { title: '', body: '' }, { title: '', body: '' },
  ],
  teamLabel: '', teamHeading: '',
  ctaHeading: '', ctaSub: '',
}

type ApField = keyof Omit<AboutPageContent, 'pillars'>
type PillarErr = ({ title?: string; body?: string } | undefined)[]

interface Errors {
  fields: Partial<Record<ApField, string>>
  pillars: PillarErr
}

const MAX: Record<string, number> = {
  heroLabel: 30, heroHeading: 80, heroSub: 250,
  storyLabel: 30, storyHeadingLine1: 80, storyHeadingLine2: 80,
  storyBody1: 600, storyBody2: 600, storyBody3: 600,
  missionQuote: 300,
  pillarsLabel: 30, pillarsHeading: 80,
  teamLabel: 30, teamHeading: 80,
  ctaHeading: 80, ctaSub: 200,
  pillarTitle: 60, pillarBody: 300,
}

function CharCount({ val, field }: { val: string; field: string }) {
  const max = MAX[field]; if (!max) return null
  const len = val.length
  const color = len > max ? '#dc2626' : len > max * 0.85 ? '#d97706' : '#9ca3af'
  return <span style={{ fontSize: '0.72rem', color, marginLeft: 'auto', flexShrink: 0 }}>{len}/{max}</span>
}

function validate(ap: AboutPageContent): Errors {
  const fields: Partial<Record<ApField, string>> = {}
  const req: ApField[] = ['heroLabel', 'heroHeading', 'heroSub', 'storyLabel', 'storyHeadingLine1', 'storyHeadingLine2', 'storyBody1', 'storyBody2', 'storyBody3', 'missionQuote', 'pillarsLabel', 'pillarsHeading', 'teamLabel', 'teamHeading', 'ctaHeading', 'ctaSub']
  for (const k of req) {
    const v = ap[k] as string
    if (!v?.trim()) fields[k] = 'Required.'
    else if (MAX[k] && v.length > MAX[k]) fields[k] = `Max ${MAX[k]} characters.`
  }
  const pillars: PillarErr = ap.pillars.map(p => {
    const e: { title?: string; body?: string } = {}
    if (!p.title.trim()) e.title = 'Required.'
    else if (p.title.length > MAX.pillarTitle) e.title = `Max ${MAX.pillarTitle} characters.`
    if (!p.body.trim()) e.body = 'Required.'
    else if (p.body.length > MAX.pillarBody) e.body = `Max ${MAX.pillarBody} characters.`
    return Object.keys(e).length ? e : undefined
  })
  return { fields, pillars }
}

export default function AboutContentPage() {
  const [form, setForm] = useState<AboutPageContent>(emptyContent)
  const [errors, setErrors] = useState<Errors>({ fields: {}, pillars: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data.aboutPageContent ?? emptyContent); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function set(field: ApField, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    if (errors.fields[field]) setErrors(e => ({ ...e, fields: { ...e.fields, [field]: undefined } }))
  }

  function setPillar(i: number, key: keyof AboutPillar, val: string) {
    setForm(f => { const p = [...f.pillars]; p[i] = { ...p[i], [key]: val }; return { ...f, pillars: p } })
    if (errors.pillars[i]?.[key]) setErrors(e => { const p = [...e.pillars]; p[i] = { ...p[i], [key]: undefined }; return { ...e, pillars: p } })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    if (Object.keys(v.fields).length || v.pillars.some(Boolean)) {
      setErrors(v)
      setToast({ message: 'Please fix the errors below.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings')
    const current: SiteSettings = await res.json()
    const updated = { ...current, aboutPageContent: form }
    const saveRes = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    const data = await saveRes.json()
    if (!saveRes.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data.aboutPageContent); setErrors({ fields: {}, pillars: [] }); setToast({ message: 'About page saved.', type: 'success' }) }
    setSaving(false)
  }

  const f = form
  const inp = (field: ApField) => errors.fields[field] ? 'admin-input admin-input--error' : 'admin-input'
  const ta  = (field: ApField) => errors.fields[field] ? 'admin-textarea admin-input--error' : 'admin-textarea'

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">About Us Page</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">About Us Page Content</span>
        <Link href="/admin/settings/content" className="admin-btn admin-btn-ghost admin-btn-sm">← Homepage</Link>
      </div>
      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Hero */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Hero Banner</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Background image is set in Contact &amp; Media → About Page Hero Background Image.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.heroLabel} field="heroLabel" /></div>
                  <input className={inp('heroLabel')} value={f.heroLabel} onChange={e => set('heroLabel', e.target.value)} placeholder="Ayursiha Retreat" maxLength={MAX.heroLabel} />
                  {errors.fields.heroLabel && <span className="admin-field-error">{errors.fields.heroLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.heroHeading} field="heroHeading" /></div>
                  <input className={inp('heroHeading')} value={f.heroHeading} onChange={e => set('heroHeading', e.target.value)} placeholder="About Us" maxLength={MAX.heroHeading} />
                  {errors.fields.heroHeading && <span className="admin-field-error">{errors.fields.heroHeading}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-heading *</label><CharCount val={f.heroSub} field="heroSub" /></div>
                <textarea className={ta('heroSub')} value={f.heroSub} onChange={e => set('heroSub', e.target.value)} style={{ minHeight: 72 }} maxLength={MAX.heroSub} />
                {errors.fields.heroSub && <span className="admin-field-error">{errors.fields.heroSub}</span>}
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Our Story Section</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.storyLabel} field="storyLabel" /></div>
                  <input className={inp('storyLabel')} value={f.storyLabel} onChange={e => set('storyLabel', e.target.value)} placeholder="Our Story" maxLength={MAX.storyLabel} />
                  {errors.fields.storyLabel && <span className="admin-field-error">{errors.fields.storyLabel}</span>}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading Line 1 *</label><CharCount val={f.storyHeadingLine1} field="storyHeadingLine1" /></div>
                  <input className={inp('storyHeadingLine1')} value={f.storyHeadingLine1} onChange={e => set('storyHeadingLine1', e.target.value)} placeholder="Rooted in Kerala." maxLength={MAX.storyHeadingLine1} />
                  {errors.fields.storyHeadingLine1 && <span className="admin-field-error">{errors.fields.storyHeadingLine1}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading Line 2 (italic) *</label><CharCount val={f.storyHeadingLine2} field="storyHeadingLine2" /></div>
                  <input className={inp('storyHeadingLine2')} value={f.storyHeadingLine2} onChange={e => set('storyHeadingLine2', e.target.value)} placeholder="Built on science." maxLength={MAX.storyHeadingLine2} />
                  {errors.fields.storyHeadingLine2 && <span className="admin-field-error">{errors.fields.storyHeadingLine2}</span>}
                </div>
              </div>
              {(['storyBody1', 'storyBody2', 'storyBody3'] as const).map((fld, i) => (
                <div key={fld} className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Body Paragraph {i + 1} *</label><CharCount val={f[fld]} field={fld} /></div>
                  <textarea className={ta(fld)} value={f[fld]} onChange={e => set(fld, e.target.value)} style={{ minHeight: 90 }} maxLength={MAX[fld]} />
                  {errors.fields[fld] && <span className="admin-field-error">{errors.fields[fld]}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Mission Quote */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Mission Quote</span></div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Blockquote *</label><CharCount val={f.missionQuote} field="missionQuote" /></div>
                <textarea className={ta('missionQuote')} value={f.missionQuote} onChange={e => set('missionQuote', e.target.value)} style={{ minHeight: 80 }} maxLength={MAX.missionQuote} />
                {errors.fields.missionQuote && <span className="admin-field-error">{errors.fields.missionQuote}</span>}
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Guiding Principles (4 fixed)</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.pillarsLabel} field="pillarsLabel" /></div>
                  <input className={inp('pillarsLabel')} value={f.pillarsLabel} onChange={e => set('pillarsLabel', e.target.value)} placeholder="What We Stand For" maxLength={MAX.pillarsLabel} />
                  {errors.fields.pillarsLabel && <span className="admin-field-error">{errors.fields.pillarsLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.pillarsHeading} field="pillarsHeading" /></div>
                  <input className={inp('pillarsHeading')} value={f.pillarsHeading} onChange={e => set('pillarsHeading', e.target.value)} placeholder="Our guiding principles" maxLength={MAX.pillarsHeading} />
                  {errors.fields.pillarsHeading && <span className="admin-field-error">{errors.fields.pillarsHeading}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.25rem' }}>
                {f.pillars.map((p, i) => (
                  <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem' }}>
                    <p className="admin-label" style={{ marginBottom: '0.6rem', fontWeight: 600 }}>Pillar {i + 1}</p>
                    <div className="admin-form-group" style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label" style={{ fontSize: '0.7rem' }}>Title *</label><CharCount val={p.title} field="pillarTitle" /></div>
                      <input className={errors.pillars[i]?.title ? 'admin-input admin-input--error' : 'admin-input'} value={p.title} onChange={e => setPillar(i, 'title', e.target.value)} maxLength={MAX.pillarTitle} />
                      {errors.pillars[i]?.title && <span className="admin-field-error">{errors.pillars[i]?.title}</span>}
                    </div>
                    <div className="admin-form-group">
                      <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label" style={{ fontSize: '0.7rem' }}>Body *</label><CharCount val={p.body} field="pillarBody" /></div>
                      <textarea className={errors.pillars[i]?.body ? 'admin-textarea admin-input--error' : 'admin-textarea'} value={p.body} onChange={e => setPillar(i, 'body', e.target.value)} style={{ minHeight: 72 }} maxLength={MAX.pillarBody} />
                      {errors.pillars[i]?.body && <span className="admin-field-error">{errors.pillars[i]?.body}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section Labels */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Team Section — Labels</span></div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0, display: 'block', marginBottom: '0.9rem' }}>Individual physicians are managed under Physicians.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.teamLabel} field="teamLabel" /></div>
                  <input className={inp('teamLabel')} value={f.teamLabel} onChange={e => set('teamLabel', e.target.value)} placeholder="Our Physicians" maxLength={MAX.teamLabel} />
                  {errors.fields.teamLabel && <span className="admin-field-error">{errors.fields.teamLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.teamHeading} field="teamHeading" /></div>
                  <input className={inp('teamHeading')} value={f.teamHeading} onChange={e => set('teamHeading', e.target.value)} placeholder="The people behind your care" maxLength={MAX.teamHeading} />
                  {errors.fields.teamHeading && <span className="admin-field-error">{errors.fields.teamHeading}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Closing CTA</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.ctaHeading} field="ctaHeading" /></div>
                <input className={inp('ctaHeading')} value={f.ctaHeading} onChange={e => set('ctaHeading', e.target.value)} placeholder="Ready to begin your healing?" maxLength={MAX.ctaHeading} />
                {errors.fields.ctaHeading && <span className="admin-field-error">{errors.fields.ctaHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-text *</label><CharCount val={f.ctaSub} field="ctaSub" /></div>
                <textarea className={ta('ctaSub')} value={f.ctaSub} onChange={e => set('ctaSub', e.target.value)} placeholder="Speak with one of our physicians…" style={{ minHeight: 72 }} maxLength={MAX.ctaSub} />
                {errors.fields.ctaSub && <span className="admin-field-error">{errors.fields.ctaSub}</span>}
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
