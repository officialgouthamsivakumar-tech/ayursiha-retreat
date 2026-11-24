'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SiteSettings, ExperiencePageContent, ExperienceCard } from '@/lib/db'
import AdminToast from '../../../../_components/AdminToast'

const emptyCard: ExperienceCard = { label: '', title: '', body: '' }

const emptyContent: ExperiencePageContent = {
  heroLabel: '', heroHeading: '', heroSub: '',
  introLabel: '', introHeading: '', introBody1: '', introBody2: '',
  narrativeHeadingLine1: '', narrativeHeadingLine2: '', narrativeBody: '',
  cards: [{ ...emptyCard }, { ...emptyCard }, { ...emptyCard }, { ...emptyCard }],
  ctaHeading: '', ctaSub: '',
}

type EpField = keyof Omit<ExperiencePageContent, 'cards'>
type CardErr = ({ label?: string; title?: string; body?: string } | undefined)[]

interface Errors {
  fields: Partial<Record<EpField, string>>
  cards: CardErr
}

const MAX: Record<string, number> = {
  heroLabel: 30, heroHeading: 80, heroSub: 250,
  introLabel: 30, introHeading: 80, introBody1: 600, introBody2: 600,
  narrativeHeadingLine1: 80, narrativeHeadingLine2: 80, narrativeBody: 700,
  ctaHeading: 80, ctaSub: 200,
  cardLabel: 30, cardTitle: 80, cardBody: 700,
}

function CharCount({ val, field }: { val: string; field: string }) {
  const max = MAX[field]; if (!max) return null
  const len = val.length
  const color = len > max ? '#dc2626' : len > max * 0.85 ? '#d97706' : '#9ca3af'
  return <span style={{ fontSize: '0.72rem', color, marginLeft: 'auto', flexShrink: 0 }}>{len}/{max}</span>
}

function validate(ep: ExperiencePageContent): Errors {
  const fields: Partial<Record<EpField, string>> = {}
  const req: EpField[] = ['heroLabel', 'heroHeading', 'heroSub', 'introLabel', 'introHeading', 'introBody1', 'introBody2', 'narrativeHeadingLine1', 'narrativeHeadingLine2', 'narrativeBody', 'ctaHeading', 'ctaSub']
  for (const k of req) {
    const v = ep[k] as string
    if (!v?.trim()) fields[k] = 'Required.'
    else if (MAX[k] && v.length > MAX[k]) fields[k] = `Max ${MAX[k]} characters.`
  }
  const cards: CardErr = ep.cards.map(c => {
    const e: { label?: string; title?: string; body?: string } = {}
    if (!c.label.trim()) e.label = 'Required.'
    if (!c.title.trim()) e.title = 'Required.'
    if (!c.body.trim())  e.body  = 'Required.'
    else if (c.body.length > MAX.cardBody) e.body = `Max ${MAX.cardBody} characters.`
    return Object.keys(e).length ? e : undefined
  })
  return { fields, cards }
}

export default function ExperienceContentPage() {
  const [form, setForm] = useState<ExperiencePageContent>(emptyContent)
  const [errors, setErrors] = useState<Errors>({ fields: {}, cards: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data.experiencePageContent ?? emptyContent); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function set(field: EpField, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    if (errors.fields[field]) setErrors(e => ({ ...e, fields: { ...e.fields, [field]: undefined } }))
  }

  function setCard(i: number, key: keyof ExperienceCard, val: string) {
    setForm(f => { const c = [...f.cards]; c[i] = { ...c[i], [key]: val }; return { ...f, cards: c } })
    if (errors.cards[i]?.[key]) setErrors(e => { const c = [...e.cards]; c[i] = { ...c[i], [key]: undefined }; return { ...e, cards: c } })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    if (Object.keys(v.fields).length || v.cards.some(Boolean)) {
      setErrors(v)
      setToast({ message: 'Please fix the errors below.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings')
    const current: SiteSettings = await res.json()
    const updated = { ...current, experiencePageContent: form }
    const saveRes = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    const data = await saveRes.json()
    if (!saveRes.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data.experiencePageContent); setErrors({ fields: {}, cards: [] }); setToast({ message: 'Experience page saved.', type: 'success' }) }
    setSaving(false)
  }

  const f = form
  const inp = (field: EpField) => errors.fields[field] ? 'admin-input admin-input--error' : 'admin-input'
  const ta  = (field: EpField) => errors.fields[field] ? 'admin-textarea admin-input--error' : 'admin-textarea'

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Experience Page</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Experience Page Content</span>
        <Link href="/admin/settings/content" className="admin-btn admin-btn-ghost admin-btn-sm">← Homepage</Link>
      </div>
      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Hero */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Hero Banner</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The full-width hero at the top of the Experience page. Background image is set in Contact &amp; Media.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Label (pill) *</label><CharCount val={f.heroLabel} field="heroLabel" /></div>
                  <input className={inp('heroLabel')} value={f.heroLabel} onChange={e => set('heroLabel', e.target.value)} placeholder="Ayursiha Retreat" maxLength={MAX.heroLabel} />
                  {errors.fields.heroLabel && <span className="admin-field-error">{errors.fields.heroLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.heroHeading} field="heroHeading" /></div>
                  <input className={inp('heroHeading')} value={f.heroHeading} onChange={e => set('heroHeading', e.target.value)} placeholder="The Ayursiha Experience" maxLength={MAX.heroHeading} />
                  {errors.fields.heroHeading && <span className="admin-field-error">{errors.fields.heroHeading}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-heading *</label><CharCount val={f.heroSub} field="heroSub" /></div>
                <textarea className={ta('heroSub')} value={f.heroSub} onChange={e => set('heroSub', e.target.value)} placeholder="Escape the hurried pace…" style={{ minHeight: 72 }} maxLength={MAX.heroSub} />
                {errors.fields.heroSub && <span className="admin-field-error">{errors.fields.heroSub}</span>}
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
                  <input className={inp('introLabel')} value={f.introLabel} onChange={e => set('introLabel', e.target.value)} placeholder="Our Philosophy" maxLength={MAX.introLabel} />
                  {errors.fields.introLabel && <span className="admin-field-error">{errors.fields.introLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.introHeading} field="introHeading" /></div>
                  <input className={inp('introHeading')} value={f.introHeading} onChange={e => set('introHeading', e.target.value)} placeholder="Discover. Heal. Restore." maxLength={MAX.introHeading} />
                  {errors.fields.introHeading && <span className="admin-field-error">{errors.fields.introHeading}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Body Paragraph 1 *</label><CharCount val={f.introBody1} field="introBody1" /></div>
                <textarea className={ta('introBody1')} value={f.introBody1} onChange={e => set('introBody1', e.target.value)} style={{ minHeight: 100 }} maxLength={MAX.introBody1} />
                {errors.fields.introBody1 && <span className="admin-field-error">{errors.fields.introBody1}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Body Paragraph 2 *</label><CharCount val={f.introBody2} field="introBody2" /></div>
                <textarea className={ta('introBody2')} value={f.introBody2} onChange={e => set('introBody2', e.target.value)} style={{ minHeight: 100 }} maxLength={MAX.introBody2} />
                {errors.fields.introBody2 && <span className="admin-field-error">{errors.fields.introBody2}</span>}
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Narrative Section</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading Line 1 *</label><CharCount val={f.narrativeHeadingLine1} field="narrativeHeadingLine1" /></div>
                  <input className={inp('narrativeHeadingLine1')} value={f.narrativeHeadingLine1} onChange={e => set('narrativeHeadingLine1', e.target.value)} placeholder="Practised for 5,000 years." maxLength={MAX.narrativeHeadingLine1} />
                  {errors.fields.narrativeHeadingLine1 && <span className="admin-field-error">{errors.fields.narrativeHeadingLine1}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading Line 2 (italic) *</label><CharCount val={f.narrativeHeadingLine2} field="narrativeHeadingLine2" /></div>
                  <input className={inp('narrativeHeadingLine2')} value={f.narrativeHeadingLine2} onChange={e => set('narrativeHeadingLine2', e.target.value)} placeholder="Personalised for you." maxLength={MAX.narrativeHeadingLine2} />
                  {errors.fields.narrativeHeadingLine2 && <span className="admin-field-error">{errors.fields.narrativeHeadingLine2}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Body Text *</label><CharCount val={f.narrativeBody} field="narrativeBody" /></div>
                <textarea className={ta('narrativeBody')} value={f.narrativeBody} onChange={e => set('narrativeBody', e.target.value)} style={{ minHeight: 120 }} maxLength={MAX.narrativeBody} />
                {errors.fields.narrativeBody && <span className="admin-field-error">{errors.fields.narrativeBody}</span>}
              </div>
            </div>
          </div>

          {/* Experience Cards */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Experience Cards (4 fixed)</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The 4 alternating content blocks. Card images are managed in Contact &amp; Media → Experience Page Section Images.</span>
              {f.cards.map((card, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem' }}>
                  <p className="admin-label" style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Card {i + 1}</p>
                  <div className="admin-form-row" style={{ marginBottom: '0.6rem' }}>
                    <div className="admin-form-group">
                      <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label" style={{ fontSize: '0.7rem' }}>Label (pill) *</label><CharCount val={card.label} field="cardLabel" /></div>
                      <input className={errors.cards[i]?.label ? 'admin-input admin-input--error' : 'admin-input'} value={card.label} onChange={e => setCard(i, 'label', e.target.value)} placeholder="Elemental Wellness" maxLength={MAX.cardLabel} />
                      {errors.cards[i]?.label && <span className="admin-field-error">{errors.cards[i]?.label}</span>}
                    </div>
                    <div className="admin-form-group">
                      <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label" style={{ fontSize: '0.7rem' }}>Title *</label><CharCount val={card.title} field="cardTitle" /></div>
                      <input className={errors.cards[i]?.title ? 'admin-input admin-input--error' : 'admin-input'} value={card.title} onChange={e => setCard(i, 'title', e.target.value)} placeholder="Panchakarma & Classical Healing" maxLength={MAX.cardTitle} />
                      {errors.cards[i]?.title && <span className="admin-field-error">{errors.cards[i]?.title}</span>}
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label" style={{ fontSize: '0.7rem' }}>Body *</label><CharCount val={card.body} field="cardBody" /></div>
                    <textarea className={errors.cards[i]?.body ? 'admin-textarea admin-input--error' : 'admin-textarea'} value={card.body} onChange={e => setCard(i, 'body', e.target.value)} style={{ minHeight: 110 }} maxLength={MAX.cardBody} />
                    {errors.cards[i]?.body && <span className="admin-field-error">{errors.cards[i]?.body}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header"><span className="admin-card-title">Closing CTA</span></div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Heading *</label><CharCount val={f.ctaHeading} field="ctaHeading" /></div>
                <input className={inp('ctaHeading')} value={f.ctaHeading} onChange={e => set('ctaHeading', e.target.value)} placeholder="Embrace the Ayursiha Life." maxLength={MAX.ctaHeading} />
                {errors.fields.ctaHeading && <span className="admin-field-error">{errors.fields.ctaHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}><label className="admin-label">Sub-text *</label><CharCount val={f.ctaSub} field="ctaSub" /></div>
                <textarea className={ta('ctaSub')} value={f.ctaSub} onChange={e => set('ctaSub', e.target.value)} placeholder="Begin your journey…" style={{ minHeight: 72 }} maxLength={MAX.ctaSub} />
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
