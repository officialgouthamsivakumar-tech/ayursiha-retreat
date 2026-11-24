'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings, PillarEntry, StatEntry, HomeContent } from '@/lib/db'
import AdminToast from '../../../_components/AdminToast'

const emptyHomeContent: HomeContent = {
  heroHeadingLine1: '', heroHeadingLine2: '', heroHeadingLine3: '',
  heroSub: '', heroCta: '',
  philosophyLabel: '', philosophyQuote: '', philosophySectionLabel: '',
  philosophyHeading: '', philosophyBody1: '',
  yogaLabel: '', yogaHeading: '', yogaBody: '', yogaCta: '', yogaBgImage: '',
  yogaHighlights: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
  treatmentsLabel: '', treatmentsHeading: '', treatmentsSubhead: '', treatmentsViewAll: '',
  videoLabel: '', videoHeading: '', videoDescription: '', videoViewMore: '',
  testimonialsHeading: '', testimonialsAside: '',
  parallaxLabel: '', parallaxHeadingLine1: '', parallaxHeadingLine2: '',
  parallaxSub: '', parallaxBookFree: '',
}

const emptyExperience: SiteSettings['experiencePageContent'] = { heroLabel: '', heroHeading: '', heroSub: '', introLabel: '', introHeading: '', introBody1: '', introBody2: '', narrativeHeadingLine1: '', narrativeHeadingLine2: '', narrativeBody: '', cards: [{ label: '', title: '', body: '' }, { label: '', title: '', body: '' }, { label: '', title: '', body: '' }, { label: '', title: '', body: '' }], ctaHeading: '', ctaSub: '' }
const emptyAbout: SiteSettings['aboutPageContent'] = { heroLabel: '', heroHeading: '', heroSub: '', storyLabel: '', storyHeadingLine1: '', storyHeadingLine2: '', storyBody1: '', storyBody2: '', storyBody3: '', missionQuote: '', pillarsLabel: '', pillarsHeading: '', pillars: [{ title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }], teamLabel: '', teamHeading: '', ctaHeading: '', ctaSub: '' }
const emptyTreatments: SiteSettings['treatmentsPageContent'] = { heroLabel: '', heroHeading: '', heroSub: '', introLabel: '', introHeading: '', introBody: '', ctaHeading: '', ctaSub: '' }

const empty: SiteSettings = {
  phone: '', whatsapp: '', instagram: '', youtube: '', address: '',
  heroVideo: '', aboutHeroImage: '', treatmentsHeroImage: '',
  experienceImages: ['', '', '', ''], experienceHeroImage: '',
  experiencePageImages: ['', '', '', ''], videos: [], credentials: [],
  pillars: [], stats: [], aboutStats: [],
  homeContent: emptyHomeContent,
  experiencePageContent: emptyExperience,
  aboutPageContent: emptyAbout,
  treatmentsPageContent: emptyTreatments,
}

type CredentialErrors = (string | undefined)[]
type PillarErrors = ({ step?: string; name?: string; body?: string } | undefined)[]
type StatErrors = ({ n?: string; l?: string } | undefined)[]

interface ArrayErrors {
  credentials: CredentialErrors
  pillars: PillarErrors
  stats: StatErrors
  aboutStats: StatErrors
}

type HcField = keyof HomeContent

const MAX: Record<string, number> = {
  heroHeadingLine1: 60, heroHeadingLine2: 60, heroHeadingLine3: 60,
  heroSub: 250, heroCta: 40,
  philosophyLabel: 30, philosophyQuote: 220, philosophySectionLabel: 30,
  philosophyHeading: 90, philosophyBody1: 500,
  yogaLabel: 30, yogaHeading: 90, yogaBody: 450, yogaCta: 40,
  treatmentsLabel: 30, treatmentsHeading: 90, treatmentsSubhead: 350, treatmentsViewAll: 40,
  videoLabel: 30, videoHeading: 90, videoDescription: 300, videoViewMore: 40,
  testimonialsHeading: 90, testimonialsAside: 220,
  parallaxLabel: 30, parallaxHeadingLine1: 70, parallaxHeadingLine2: 70,
  parallaxSub: 300, parallaxBookFree: 40,
  yogaHighlightValue: 25, yogaHighlightLabel: 35,
}

function CharCount({ val, field }: { val: string; field: string }) {
  const max = MAX[field]
  if (!max) return null
  const len = val.length
  const color = len > max ? '#dc2626' : len > max * 0.85 ? '#d97706' : '#9ca3af'
  return <span style={{ fontSize: '0.72rem', color, marginLeft: 'auto', flexShrink: 0 }}>{len}/{max}</span>
}

function validateArrays(data: SiteSettings): ArrayErrors {
  const credentials: CredentialErrors = data.credentials.map(c => !c.trim() ? 'Credential text is required.' : c.trim().length < 3 ? 'Too short.' : undefined)
  const pillars: PillarErrors = data.pillars.map(p => {
    const e: { step?: string; name?: string; body?: string } = {}
    if (!p.step.trim()) e.step = 'Step label is required.'
    if (!p.name.trim()) e.name = 'Name is required.'
    if (!p.body.trim()) e.body = 'Description is required.'
    else if (p.body.trim().length < 10) e.body = 'Too short (min 10 characters).'
    return Object.keys(e).length ? e : undefined
  })
  const mapStats = (arr: StatEntry[]): StatErrors => arr.map(s => {
    const e: { n?: string; l?: string } = {}
    if (!s.n.trim()) e.n = 'Value is required.'
    if (!s.l.trim()) e.l = 'Label is required.'
    return Object.keys(e).length ? e : undefined
  })
  return { credentials, pillars, stats: mapStats(data.stats), aboutStats: mapStats(data.aboutStats) }
}

function validateHomeContent(hc: HomeContent): Partial<Record<HcField, string>> {
  const e: Partial<Record<HcField, string>> = {}
  const req: HcField[] = ['heroHeadingLine1', 'heroSub', 'heroCta', 'philosophyLabel', 'philosophyQuote', 'philosophySectionLabel', 'philosophyHeading', 'philosophyBody1', 'yogaLabel', 'yogaHeading', 'yogaBody', 'yogaCta', 'treatmentsLabel', 'treatmentsHeading', 'treatmentsSubhead', 'treatmentsViewAll', 'videoLabel', 'videoHeading', 'videoDescription', 'videoViewMore', 'testimonialsHeading', 'testimonialsAside', 'parallaxLabel', 'parallaxHeadingLine1', 'parallaxHeadingLine2', 'parallaxSub', 'parallaxBookFree']
  for (const k of req) {
    const val = hc[k]
    if (typeof val === 'string' && !val.trim()) e[k] = 'This field is required.'
    else if (typeof val === 'string' && MAX[k] && val.length > MAX[k]) e[k] = `Max ${MAX[k]} characters.`
  }
  return e
}

export default function ContentSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty)
  const [arrayErrors, setArrayErrors] = useState<ArrayErrors>({ credentials: [], pillars: [], stats: [], aboutStats: [] })
  const [hcErrors, setHcErrors] = useState<Partial<Record<HcField, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const yogaImgRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  /* ── homeContent field setter ── */
  function setHc(field: HcField, val: string) {
    setForm(f => ({ ...f, homeContent: { ...f.homeContent, [field]: val } }))
    if (hcErrors[field]) setHcErrors(e => ({ ...e, [field]: undefined }))
  }

  function setYogaHighlight(i: number, key: 'value' | 'label', val: string) {
    setForm(f => {
      const hl = [...(f.homeContent.yogaHighlights ?? [])]
      hl[i] = { ...hl[i], [key]: val }
      return { ...f, homeContent: { ...f.homeContent, yogaHighlights: hl } }
    })
  }

  /* ── yoga background image upload ── */
  async function handleYogaImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image must be smaller than 5 MB.', type: 'error' })
      return
    }
    setImgUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        const old = form.homeContent.yogaBgImage
        setForm(f => ({ ...f, homeContent: { ...f.homeContent, yogaBgImage: data.url } }))
        if (old?.startsWith('/api/uploads/')) {
          fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: old }) }).catch(() => {})
        }
        setToast({ message: 'Yoga background image uploaded.', type: 'success' })
      } else {
        setToast({ message: data.error || 'Upload failed.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' })
    }
    setImgUploading(false)
  }

  /* ── credentials ── */
  function setCredential(i: number, val: string) {
    setForm(f => { const c = [...f.credentials]; c[i] = val; return { ...f, credentials: c } })
    if (arrayErrors.credentials[i]) setArrayErrors(e => { const c = [...e.credentials]; c[i] = undefined; return { ...e, credentials: c } })
  }
  function addCredential() { setForm(f => ({ ...f, credentials: [...f.credentials, ''] })) }
  function removeCredential(i: number) {
    setForm(f => ({ ...f, credentials: f.credentials.filter((_, j) => j !== i) }))
    setArrayErrors(e => ({ ...e, credentials: e.credentials.filter((_, j) => j !== i) }))
  }

  /* ── pillars ── */
  function setPillar(i: number, field: keyof PillarEntry, val: string) {
    setForm(f => { const p = [...f.pillars]; p[i] = { ...p[i], [field]: val }; return { ...f, pillars: p } })
    if (arrayErrors.pillars[i]?.[field]) setArrayErrors(e => { const p = [...e.pillars]; p[i] = { ...p[i], [field]: undefined }; return { ...e, pillars: p } })
  }
  function addPillar() { setForm(f => ({ ...f, pillars: [...f.pillars, { step: '', name: '', body: '' }] })) }
  function removePillar(i: number) {
    setForm(f => ({ ...f, pillars: f.pillars.filter((_, j) => j !== i) }))
    setArrayErrors(e => ({ ...e, pillars: e.pillars.filter((_, j) => j !== i) }))
  }

  /* ── stats helper ── */
  function makeStatSetters(key: 'stats' | 'aboutStats') {
    return {
      setStat: (i: number, field: keyof StatEntry, val: string) => {
        setForm(f => { const s = [...f[key]]; s[i] = { ...s[i], [field]: val }; return { ...f, [key]: s } })
        if (arrayErrors[key][i]?.[field]) setArrayErrors(e => { const s = [...e[key]]; s[i] = { ...s[i], [field]: undefined }; return { ...e, [key]: s } })
      },
      addStat: () => setForm(f => ({ ...f, [key]: [...f[key], { n: '', l: '' }] })),
      removeStat: (i: number) => {
        setForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }))
        setArrayErrors(e => ({ ...e, [key]: e[key].filter((_, j) => j !== i) }))
      },
    }
  }
  const philo = makeStatSetters('stats')
  const about = makeStatSetters('aboutStats')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const ae = validateArrays(form)
    const he = validateHomeContent(form.homeContent)
    const hasArrayErr = ae.credentials.some(Boolean) || ae.pillars.some(Boolean) || ae.stats.some(Boolean) || ae.aboutStats.some(Boolean)
    const hasHcErr = Object.keys(he).length > 0
    if (hasArrayErr || hasHcErr) {
      setArrayErrors(ae)
      setHcErrors(he)
      setToast({ message: 'Please fix the errors below before saving.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data); setArrayErrors({ credentials: [], pillars: [], stats: [], aboutStats: [] }); setHcErrors({}); setToast({ message: 'Settings saved.', type: 'success' }) }
    setSaving(false)
  }

  const hc = form.homeContent ?? emptyHomeContent

  function hcInp(field: HcField) {
    return hcErrors[field] ? 'admin-input admin-input--error' : 'admin-input'
  }
  function hcTa(field: HcField) {
    return hcErrors[field] ? 'admin-textarea admin-input--error' : 'admin-textarea'
  }

  const imgSvg = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Homepage Content</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Homepage Content</span>
        <Link href="/admin/settings" className="admin-btn admin-btn-ghost admin-btn-sm">← Contact &amp; Media</Link>
      </div>
      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* ── Hero Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="1" y="1" width="14" height="14" rx="2"/><path d="M4 10h8M4 7h5"/></svg>
                Hero Section
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The full-screen opening section with the video background.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Heading Line 1 *</label>
                    <CharCount val={hc.heroHeadingLine1 ?? ''} field="heroHeadingLine1" />
                  </div>
                  <input className={hcInp('heroHeadingLine1')} value={hc.heroHeadingLine1 ?? ''} onChange={e => setHc('heroHeadingLine1', e.target.value)} placeholder="Where ancient" maxLength={MAX.heroHeadingLine1} />
                  {hcErrors.heroHeadingLine1 && <span className="admin-field-error">{hcErrors.heroHeadingLine1}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Heading Line 2 *</label>
                    <CharCount val={hc.heroHeadingLine2 ?? ''} field="heroHeadingLine2" />
                  </div>
                  <input className={hcInp('heroHeadingLine2')} value={hc.heroHeadingLine2 ?? ''} onChange={e => setHc('heroHeadingLine2', e.target.value)} placeholder="medicine" maxLength={MAX.heroHeadingLine2} />
                  {hcErrors.heroHeadingLine2 && <span className="admin-field-error">{hcErrors.heroHeadingLine2}</span>}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Heading Line 3 (italic) *</label>
                    <CharCount val={hc.heroHeadingLine3 ?? ''} field="heroHeadingLine3" />
                  </div>
                  <input className={hcInp('heroHeadingLine3')} value={hc.heroHeadingLine3 ?? ''} onChange={e => setHc('heroHeadingLine3', e.target.value)} placeholder="meets you." maxLength={MAX.heroHeadingLine3} />
                  {hcErrors.heroHeadingLine3 && <span className="admin-field-error">{hcErrors.heroHeadingLine3}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">CTA Button Label *</label>
                    <CharCount val={hc.heroCta ?? ''} field="heroCta" />
                  </div>
                  <input className={hcInp('heroCta')} value={hc.heroCta ?? ''} onChange={e => setHc('heroCta', e.target.value)} placeholder="Explore Treatments" maxLength={MAX.heroCta} />
                  {hcErrors.heroCta && <span className="admin-field-error">{hcErrors.heroCta}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Sub-heading *</label>
                  <CharCount val={hc.heroSub ?? ''} field="heroSub" />
                </div>
                <textarea className={hcTa('heroSub')} value={hc.heroSub ?? ''} onChange={e => setHc('heroSub', e.target.value)} placeholder="Personalised Ayurvedic care…" style={{ minHeight: 80 }} maxLength={MAX.heroSub} />
                {hcErrors.heroSub && <span className="admin-field-error">{hcErrors.heroSub}</span>}
              </div>
            </div>
          </div>

          {/* ── Philosophy Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/></svg>
                Philosophy Section
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The &quot;Our Approach&quot; section with the quote and body text.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Left Label (pill) *</label>
                    <CharCount val={hc.philosophyLabel ?? ''} field="philosophyLabel" />
                  </div>
                  <input className={hcInp('philosophyLabel')} value={hc.philosophyLabel ?? ''} onChange={e => setHc('philosophyLabel', e.target.value)} placeholder="Our Approach" maxLength={MAX.philosophyLabel} />
                  {hcErrors.philosophyLabel && <span className="admin-field-error">{hcErrors.philosophyLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Right Label (pill) *</label>
                    <CharCount val={hc.philosophySectionLabel ?? ''} field="philosophySectionLabel" />
                  </div>
                  <input className={hcInp('philosophySectionLabel')} value={hc.philosophySectionLabel ?? ''} onChange={e => setHc('philosophySectionLabel', e.target.value)} placeholder="Classical Ayurveda" maxLength={MAX.philosophySectionLabel} />
                  {hcErrors.philosophySectionLabel && <span className="admin-field-error">{hcErrors.philosophySectionLabel}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Blockquote *</label>
                  <CharCount val={hc.philosophyQuote ?? ''} field="philosophyQuote" />
                </div>
                <textarea className={hcTa('philosophyQuote')} value={hc.philosophyQuote ?? ''} onChange={e => setHc('philosophyQuote', e.target.value)} placeholder="We treat the whole person…" style={{ minHeight: 80 }} maxLength={MAX.philosophyQuote} />
                {hcErrors.philosophyQuote && <span className="admin-field-error">{hcErrors.philosophyQuote}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Heading *</label>
                  <CharCount val={hc.philosophyHeading ?? ''} field="philosophyHeading" />
                </div>
                <input className={hcInp('philosophyHeading')} value={hc.philosophyHeading ?? ''} onChange={e => setHc('philosophyHeading', e.target.value)} placeholder="Healing rooted in 5,000 years of science" maxLength={MAX.philosophyHeading} />
                {hcErrors.philosophyHeading && <span className="admin-field-error">{hcErrors.philosophyHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Body Paragraph *</label>
                  <CharCount val={hc.philosophyBody1 ?? ''} field="philosophyBody1" />
                </div>
                <textarea className={hcTa('philosophyBody1')} value={hc.philosophyBody1 ?? ''} onChange={e => setHc('philosophyBody1', e.target.value)} placeholder="Ayurveda is not alternative medicine…" style={{ minHeight: 100 }} maxLength={MAX.philosophyBody1} />
                {hcErrors.philosophyBody1 && <span className="admin-field-error">{hcErrors.philosophyBody1}</span>}
              </div>
            </div>
          </div>

          {/* ── Yoga Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M8 2c0 0-4 2-4 6s4 6 4 6 4-2 4-6-4-6-4-6z"/></svg>
                Yoga &amp; Meditation Section
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The full-width yoga section with background image and highlights.</span>

              {/* Background Image */}
              <div>
                <label className="admin-label">Background Image</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginTop: '0.4rem' }}>
                  {hc.yogaBgImage ? (
                    <div style={{ width: 200, height: 110, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                      <Image src={hc.yogaBgImage} alt="Yoga background" fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  ) : (
                    <div style={{ width: 200, height: 110, borderRadius: 8, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                      {imgSvg}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={() => yogaImgRef.current?.click()} disabled={imgUploading}>
                      {imgUploading ? 'Uploading…' : hc.yogaBgImage ? 'Replace Image' : 'Upload Image'}
                    </button>
                    <input ref={yogaImgRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleYogaImageUpload} />
                    <span className="admin-form-hint">JPEG/PNG/WebP · min 1920×580 px recommended</span>
                  </div>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Label (pill) *</label>
                    <CharCount val={hc.yogaLabel ?? ''} field="yogaLabel" />
                  </div>
                  <input className={hcInp('yogaLabel')} value={hc.yogaLabel ?? ''} onChange={e => setHc('yogaLabel', e.target.value)} placeholder="Wellness Practice" maxLength={MAX.yogaLabel} />
                  {hcErrors.yogaLabel && <span className="admin-field-error">{hcErrors.yogaLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">CTA Button Label *</label>
                    <CharCount val={hc.yogaCta ?? ''} field="yogaCta" />
                  </div>
                  <input className={hcInp('yogaCta')} value={hc.yogaCta ?? ''} onChange={e => setHc('yogaCta', e.target.value)} placeholder="Join a Session" maxLength={MAX.yogaCta} />
                  {hcErrors.yogaCta && <span className="admin-field-error">{hcErrors.yogaCta}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Heading *</label>
                  <CharCount val={hc.yogaHeading ?? ''} field="yogaHeading" />
                </div>
                <input className={hcInp('yogaHeading')} value={hc.yogaHeading ?? ''} onChange={e => setHc('yogaHeading', e.target.value)} placeholder="Yoga & Meditation Sessions" maxLength={MAX.yogaHeading} />
                {hcErrors.yogaHeading && <span className="admin-field-error">{hcErrors.yogaHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Body Text *</label>
                  <CharCount val={hc.yogaBody ?? ''} field="yogaBody" />
                </div>
                <textarea className={hcTa('yogaBody')} value={hc.yogaBody ?? ''} onChange={e => setHc('yogaBody', e.target.value)} placeholder="Guided daily yoga and pranayama…" style={{ minHeight: 90 }} maxLength={MAX.yogaBody} />
                {hcErrors.yogaBody && <span className="admin-field-error">{hcErrors.yogaBody}</span>}
              </div>

              {/* Yoga Highlights */}
              <div>
                <label className="admin-label">Highlights (3 fixed stats)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                  {(hc.yogaHighlights ?? [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }]).map((hl, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: '0 0 160px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <label className="admin-label" style={{ fontSize: '0.7rem' }}>Value {i + 1}</label>
                          <CharCount val={hl.value ?? ''} field="yogaHighlightValue" />
                        </div>
                        <input className="admin-input" value={hl.value ?? ''} onChange={e => setYogaHighlight(i, 'value', e.target.value)} placeholder="Daily" maxLength={MAX.yogaHighlightValue} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <label className="admin-label" style={{ fontSize: '0.7rem' }}>Label {i + 1}</label>
                          <CharCount val={hl.label ?? ''} field="yogaHighlightLabel" />
                        </div>
                        <input className="admin-input" value={hl.label ?? ''} onChange={e => setYogaHighlight(i, 'label', e.target.value)} placeholder="Morning Sessions" maxLength={MAX.yogaHighlightLabel} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Treatments Section Labels ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M8 2v12M2 8h12"/><circle cx="8" cy="8" r="6"/></svg>
                Treatments Section — Labels
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Section headings only — individual treatments are managed under Treatments.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Label (pill) *</label>
                    <CharCount val={hc.treatmentsLabel ?? ''} field="treatmentsLabel" />
                  </div>
                  <input className={hcInp('treatmentsLabel')} value={hc.treatmentsLabel ?? ''} onChange={e => setHc('treatmentsLabel', e.target.value)} placeholder="Classical Therapies" maxLength={MAX.treatmentsLabel} />
                  {hcErrors.treatmentsLabel && <span className="admin-field-error">{hcErrors.treatmentsLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">View All Button Label *</label>
                    <CharCount val={hc.treatmentsViewAll ?? ''} field="treatmentsViewAll" />
                  </div>
                  <input className={hcInp('treatmentsViewAll')} value={hc.treatmentsViewAll ?? ''} onChange={e => setHc('treatmentsViewAll', e.target.value)} placeholder="View All Treatments" maxLength={MAX.treatmentsViewAll} />
                  {hcErrors.treatmentsViewAll && <span className="admin-field-error">{hcErrors.treatmentsViewAll}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Heading *</label>
                  <CharCount val={hc.treatmentsHeading ?? ''} field="treatmentsHeading" />
                </div>
                <input className={hcInp('treatmentsHeading')} value={hc.treatmentsHeading ?? ''} onChange={e => setHc('treatmentsHeading', e.target.value)} placeholder="Treatments that honour the tradition" maxLength={MAX.treatmentsHeading} />
                {hcErrors.treatmentsHeading && <span className="admin-field-error">{hcErrors.treatmentsHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Sub-heading *</label>
                  <CharCount val={hc.treatmentsSubhead ?? ''} field="treatmentsSubhead" />
                </div>
                <textarea className={hcTa('treatmentsSubhead')} value={hc.treatmentsSubhead ?? ''} onChange={e => setHc('treatmentsSubhead', e.target.value)} placeholder="Every treatment is prescribed after…" style={{ minHeight: 80 }} maxLength={MAX.treatmentsSubhead} />
                {hcErrors.treatmentsSubhead && <span className="admin-field-error">{hcErrors.treatmentsSubhead}</span>}
              </div>
            </div>
          </div>

          {/* ── Video Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
                Video Section — Labels
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Section headings and description — YouTube videos are managed under Contact &amp; Media.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Label (pill) *</label>
                    <CharCount val={hc.videoLabel ?? ''} field="videoLabel" />
                  </div>
                  <input className={hcInp('videoLabel')} value={hc.videoLabel ?? ''} onChange={e => setHc('videoLabel', e.target.value)} placeholder="Inside Ayursiha" maxLength={MAX.videoLabel} />
                  {hcErrors.videoLabel && <span className="admin-field-error">{hcErrors.videoLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">View More Button *</label>
                    <CharCount val={hc.videoViewMore ?? ''} field="videoViewMore" />
                  </div>
                  <input className={hcInp('videoViewMore')} value={hc.videoViewMore ?? ''} onChange={e => setHc('videoViewMore', e.target.value)} placeholder="View More on YouTube" maxLength={MAX.videoViewMore} />
                  {hcErrors.videoViewMore && <span className="admin-field-error">{hcErrors.videoViewMore}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Heading *</label>
                  <CharCount val={hc.videoHeading ?? ''} field="videoHeading" />
                </div>
                <input className={hcInp('videoHeading')} value={hc.videoHeading ?? ''} onChange={e => setHc('videoHeading', e.target.value)} placeholder="Experience the healing environment" maxLength={MAX.videoHeading} />
                {hcErrors.videoHeading && <span className="admin-field-error">{hcErrors.videoHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Description *</label>
                  <CharCount val={hc.videoDescription ?? ''} field="videoDescription" />
                </div>
                <textarea className={hcTa('videoDescription')} value={hc.videoDescription ?? ''} onChange={e => setHc('videoDescription', e.target.value)} placeholder="A glimpse into the treatments…" style={{ minHeight: 72 }} maxLength={MAX.videoDescription} />
                {hcErrors.videoDescription && <span className="admin-field-error">{hcErrors.videoDescription}</span>}
              </div>
            </div>
          </div>

          {/* ── Testimonials Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M14 10a2 2 0 01-2 2H4l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v6z"/></svg>
                Testimonials Section — Labels
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Section heading and aside text — individual testimonials are managed under Testimonials.</span>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Heading *</label>
                  <CharCount val={hc.testimonialsHeading ?? ''} field="testimonialsHeading" />
                </div>
                <input className={hcInp('testimonialsHeading')} value={hc.testimonialsHeading ?? ''} onChange={e => setHc('testimonialsHeading', e.target.value)} placeholder="Stories of transformation" maxLength={MAX.testimonialsHeading} />
                {hcErrors.testimonialsHeading && <span className="admin-field-error">{hcErrors.testimonialsHeading}</span>}
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Aside Text *</label>
                  <CharCount val={hc.testimonialsAside ?? ''} field="testimonialsAside" />
                </div>
                <textarea className={hcTa('testimonialsAside')} value={hc.testimonialsAside ?? ''} onChange={e => setHc('testimonialsAside', e.target.value)} placeholder="Over 4,800 patients have found their way back to health…" style={{ minHeight: 72 }} maxLength={MAX.testimonialsAside} />
                {hcErrors.testimonialsAside && <span className="admin-field-error">{hcErrors.testimonialsAside}</span>}
              </div>
            </div>
          </div>

          {/* ── Parallax CTA Section ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M8 1v14M4 5l4-4 4 4M4 11l4 4 4-4"/></svg>
                Parallax CTA Section
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The dark full-width call-to-action section before the map.</span>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Label (pill) *</label>
                    <CharCount val={hc.parallaxLabel ?? ''} field="parallaxLabel" />
                  </div>
                  <input className={hcInp('parallaxLabel')} value={hc.parallaxLabel ?? ''} onChange={e => setHc('parallaxLabel', e.target.value)} placeholder="Begin Your Journey" maxLength={MAX.parallaxLabel} />
                  {hcErrors.parallaxLabel && <span className="admin-field-error">{hcErrors.parallaxLabel}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Book Free CTA *</label>
                    <CharCount val={hc.parallaxBookFree ?? ''} field="parallaxBookFree" />
                  </div>
                  <input className={hcInp('parallaxBookFree')} value={hc.parallaxBookFree ?? ''} onChange={e => setHc('parallaxBookFree', e.target.value)} placeholder="Book Free Consultation" maxLength={MAX.parallaxBookFree} />
                  {hcErrors.parallaxBookFree && <span className="admin-field-error">{hcErrors.parallaxBookFree}</span>}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Heading Line 1 *</label>
                    <CharCount val={hc.parallaxHeadingLine1 ?? ''} field="parallaxHeadingLine1" />
                  </div>
                  <input className={hcInp('parallaxHeadingLine1')} value={hc.parallaxHeadingLine1 ?? ''} onChange={e => setHc('parallaxHeadingLine1', e.target.value)} placeholder="Your body already" maxLength={MAX.parallaxHeadingLine1} />
                  {hcErrors.parallaxHeadingLine1 && <span className="admin-field-error">{hcErrors.parallaxHeadingLine1}</span>}
                </div>
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="admin-label">Heading Line 2 (italic) *</label>
                    <CharCount val={hc.parallaxHeadingLine2 ?? ''} field="parallaxHeadingLine2" />
                  </div>
                  <input className={hcInp('parallaxHeadingLine2')} value={hc.parallaxHeadingLine2 ?? ''} onChange={e => setHc('parallaxHeadingLine2', e.target.value)} placeholder="knows how to heal." maxLength={MAX.parallaxHeadingLine2} />
                  {hcErrors.parallaxHeadingLine2 && <span className="admin-field-error">{hcErrors.parallaxHeadingLine2}</span>}
                </div>
              </div>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-label">Sub-text *</label>
                  <CharCount val={hc.parallaxSub ?? ''} field="parallaxSub" />
                </div>
                <textarea className={hcTa('parallaxSub')} value={hc.parallaxSub ?? ''} onChange={e => setHc('parallaxSub', e.target.value)} placeholder="Book a complimentary 30-minute introductory call…" style={{ minHeight: 80 }} maxLength={MAX.parallaxSub} />
                {hcErrors.parallaxSub && <span className="admin-field-error">{hcErrors.parallaxSub}</span>}
              </div>
            </div>
          </div>

          {/* ── Credentials Ticker ── */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M1 8h14M4 4l4-3 4 3M4 12l4 3 4-3"/></svg>
                Credentials Ticker
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Short trust badges that scroll across the homepage — e.g. &quot;Ministry of AYUSH Registered&quot;.</span>
              {form.credentials.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      className={arrayErrors.credentials[i] ? 'admin-input admin-input--error' : 'admin-input'}
                      value={c}
                      onChange={e => setCredential(i, e.target.value)}
                      placeholder="Credential badge text…"
                    />
                    {arrayErrors.credentials[i] && <span className="admin-field-error">{arrayErrors.credentials[i]}</span>}
                  </div>
                  <button type="button" onClick={() => removeCredential(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, paddingTop: 10, flexShrink: 0 }} aria-label="Remove">×</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addCredential}>+ Add credential</button>
            </div>
          </div>

          {/* Philosophy Pillars */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M8 1v14M1 8h14"/></svg>
                Philosophy Pillars
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The step-based approach cards shown in the Philosophy section.</span>
              {form.pillars.map((p, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', position: 'relative' }}>
                  <button type="button" onClick={() => removePillar(i)} style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1 }} aria-label="Remove">×</button>
                  <div className="admin-form-row" style={{ marginBottom: '0.75rem' }}>
                    <div className="admin-form-group" style={{ flex: '0 0 120px' }}>
                      <label className="admin-label" style={{ fontSize: '0.7rem' }}>Step Label *</label>
                      <input className={arrayErrors.pillars[i]?.step ? 'admin-input admin-input--error' : 'admin-input'} value={p.step} onChange={e => setPillar(i, 'step', e.target.value)} placeholder="01" />
                      {arrayErrors.pillars[i]?.step && <span className="admin-field-error">{arrayErrors.pillars[i]?.step}</span>}
                    </div>
                    <div className="admin-form-group" style={{ flex: 1 }}>
                      <label className="admin-label" style={{ fontSize: '0.7rem' }}>Pillar Name *</label>
                      <input className={arrayErrors.pillars[i]?.name ? 'admin-input admin-input--error' : 'admin-input'} value={p.name} onChange={e => setPillar(i, 'name', e.target.value)} placeholder="Diagnosis" />
                      {arrayErrors.pillars[i]?.name && <span className="admin-field-error">{arrayErrors.pillars[i]?.name}</span>}
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Description *</label>
                    <textarea className={arrayErrors.pillars[i]?.body ? 'admin-textarea admin-input--error' : 'admin-textarea'} value={p.body} onChange={e => setPillar(i, 'body', e.target.value)} placeholder="Describe this pillar…" style={{ minHeight: 72 }} />
                    {arrayErrors.pillars[i]?.body && <span className="admin-field-error">{arrayErrors.pillars[i]?.body}</span>}
                  </div>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addPillar}>+ Add pillar</button>
            </div>
          </div>

          {/* Philosophy Stats */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M2 12l4-4 3 3 5-6"/></svg>
                Philosophy Stats
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Numbers shown in the Philosophy section, e.g. &quot;4,800+ / Patients Healed&quot;.</span>
              {form.stats.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: '0 0 140px' }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Value *</label>
                    <input className={arrayErrors.stats[i]?.n ? 'admin-input admin-input--error' : 'admin-input'} value={s.n} onChange={e => philo.setStat(i, 'n', e.target.value)} placeholder="4,800+" />
                    {arrayErrors.stats[i]?.n && <span className="admin-field-error">{arrayErrors.stats[i]?.n}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Label *</label>
                    <input className={arrayErrors.stats[i]?.l ? 'admin-input admin-input--error' : 'admin-input'} value={s.l} onChange={e => philo.setStat(i, 'l', e.target.value)} placeholder="Patients Healed" />
                    {arrayErrors.stats[i]?.l && <span className="admin-field-error">{arrayErrors.stats[i]?.l}</span>}
                  </div>
                  <button type="button" onClick={() => philo.removeStat(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, paddingTop: '1.6rem', flexShrink: 0 }} aria-label="Remove">×</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={philo.addStat}>+ Add stat</button>
            </div>
          </div>

          {/* About Stats */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
                About Us Stats
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Stats shown on the About page, e.g. &quot;2002 / Year Founded&quot;.</span>
              {form.aboutStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: '0 0 140px' }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Value *</label>
                    <input className={arrayErrors.aboutStats[i]?.n ? 'admin-input admin-input--error' : 'admin-input'} value={s.n} onChange={e => about.setStat(i, 'n', e.target.value)} placeholder="2002" />
                    {arrayErrors.aboutStats[i]?.n && <span className="admin-field-error">{arrayErrors.aboutStats[i]?.n}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Label *</label>
                    <input className={arrayErrors.aboutStats[i]?.l ? 'admin-input admin-input--error' : 'admin-input'} value={s.l} onChange={e => about.setStat(i, 'l', e.target.value)} placeholder="Year Founded" />
                    {arrayErrors.aboutStats[i]?.l && <span className="admin-field-error">{arrayErrors.aboutStats[i]?.l}</span>}
                  </div>
                  <button type="button" onClick={() => about.removeStat(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, paddingTop: '1.6rem', flexShrink: 0 }} aria-label="Remove">×</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={about.addStat}>+ Add stat</button>
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
