'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteSettings, VideoEntry, PillarEntry, StatEntry } from '@/lib/db'
import AdminToast from '../../_components/AdminToast'

const empty: SiteSettings = { phone: '', whatsapp: '', instagram: '', youtube: '', address: '', heroVideo: '', videos: [], credentials: [], pillars: [], stats: [], aboutStats: [] }

type ScalarKey = Exclude<keyof SiteSettings, 'videos' | 'heroVideo' | 'credentials' | 'pillars' | 'stats' | 'aboutStats'>
type FieldErrors = Partial<Record<ScalarKey, string>>

type ArrayErrors = {
  credentials: (string | undefined)[]
  videos: ({ id?: string; title?: string } | undefined)[]
  pillars: ({ name?: string; body?: string } | undefined)[]
  stats: ({ n?: string; l?: string } | undefined)[]
  aboutStats: ({ n?: string; l?: string } | undefined)[]
}
const emptyAE = (): ArrayErrors => ({ credentials: [], videos: [], pillars: [], stats: [], aboutStats: [] })

function hasAE(e: ArrayErrors) {
  return e.credentials.some(Boolean) || e.videos.some(Boolean) || e.pillars.some(Boolean) || e.stats.some(Boolean) || e.aboutStats.some(Boolean)
}

function validate(data: SiteSettings): FieldErrors {
  const e: FieldErrors = {}
  if (!data.phone.trim()) { e.phone = 'Phone number is required.' }
  else if (!/^[+\d][\d\s\-(). ]*$/.test(data.phone.trim())) { e.phone = 'Only digits, spaces, +, -, ( ) are allowed.' }
  else { const d = data.phone.replace(/\D/g, ''); if (d.length < 7) e.phone = 'Too short — minimum 7 digits.'; else if (d.length > 15) e.phone = 'Too long — maximum 15 digits.' }

  if (!data.whatsapp.trim()) { e.whatsapp = 'WhatsApp number is required.' }
  else if (!/^\+?\d{7,15}$/.test(data.whatsapp.trim())) { e.whatsapp = 'Digits only with country code, no spaces — e.g. +914872440000' }

  if (!data.instagram.trim()) { e.instagram = 'Instagram link is required.' }
  else if (!data.instagram.trim().startsWith('@') && !/^https?:\/\//i.test(data.instagram.trim())) { e.instagram = 'Must be a full URL or an @handle.' }

  if (!data.youtube.trim()) { e.youtube = 'YouTube link is required.' }
  else if (!/^https?:\/\//i.test(data.youtube.trim())) { e.youtube = 'Must be a full URL (https://youtube.com/…).' }

  if (!data.address.trim()) { e.address = 'Address is required.' }
  else if (data.address.trim().length < 10) { e.address = 'Address is too short (minimum 10 characters).' }

  return e
}

function validateArrays(data: SiteSettings): ArrayErrors {
  const e = emptyAE()

  data.credentials.forEach((c, i) => {
    if (!c.trim()) e.credentials[i] = 'Badge text cannot be empty.'
  })

  data.videos.forEach((v, i) => {
    const vErr: { id?: string; title?: string } = {}
    if (!v.id.trim()) vErr.id = 'Video ID is required.'
    else if (!/^[A-Za-z0-9_-]{11}$/.test(v.id.trim())) vErr.id = 'Must be an 11-character YouTube video ID.'
    if (!v.title.trim()) vErr.title = 'Title is required.'
    if (Object.keys(vErr).length) e.videos[i] = vErr
  })

  data.pillars.forEach((p, i) => {
    const pErr: { name?: string; body?: string } = {}
    if (!p.name.trim()) pErr.name = 'Name is required.'
    if (!p.body.trim()) pErr.body = 'Description is required.'
    if (Object.keys(pErr).length) e.pillars[i] = pErr
  })

  data.stats.forEach((s, i) => {
    const sErr: { n?: string; l?: string } = {}
    if (!s.n.trim()) sErr.n = 'Value is required (e.g. 4,800+).'
    if (!s.l.trim()) sErr.l = 'Label is required (e.g. Patients healed).'
    if (Object.keys(sErr).length) e.stats[i] = sErr
  })

  data.aboutStats.forEach((s, i) => {
    const sErr: { n?: string; l?: string } = {}
    if (!s.n.trim()) sErr.n = 'Value is required (e.g. 2002).'
    if (!s.l.trim()) sErr.l = 'Label is required (e.g. Year Founded).'
    if (Object.keys(sErr).length) e.aboutStats[i] = sErr
  })

  return e
}

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [ae, setAe] = useState<ArrayErrors>(emptyAE())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function set(key: ScalarKey, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  // Credentials
  function setCredential(i: number, val: string) {
    setForm(f => { const c = [...f.credentials]; c[i] = val; return { ...f, credentials: c } })
    if (ae.credentials[i]) setAe(e => { const c = [...e.credentials]; c[i] = undefined; return { ...e, credentials: c } })
  }
  function addCredential() { setForm(f => ({ ...f, credentials: [...f.credentials, ''] })) }
  function removeCredential(i: number) {
    setForm(f => ({ ...f, credentials: f.credentials.filter((_, j) => j !== i) }))
    setAe(e => ({ ...e, credentials: e.credentials.filter((_, j) => j !== i) }))
  }

  // Pillars
  function setPillar(i: number, field: keyof PillarEntry, val: string) {
    setForm(f => { const p = [...f.pillars]; p[i] = { ...p[i], [field]: val }; return { ...f, pillars: p } })
    if (ae.pillars[i]?.[field as 'name' | 'body']) setAe(e => { const p = [...e.pillars]; p[i] = { ...p[i], [field]: undefined }; return { ...e, pillars: p } })
  }
  function addPillar() { setForm(f => ({ ...f, pillars: [...f.pillars, { step: String(f.pillars.length + 1).padStart(2, '0'), name: '', body: '' }] })) }
  function removePillar(i: number) {
    setForm(f => ({ ...f, pillars: f.pillars.filter((_, j) => j !== i) }))
    setAe(e => ({ ...e, pillars: e.pillars.filter((_, j) => j !== i) }))
  }

  // Stats (Philosophy)
  function setStat(i: number, field: keyof StatEntry, val: string) {
    setForm(f => { const s = [...f.stats]; s[i] = { ...s[i], [field]: val }; return { ...f, stats: s } })
    if (ae.stats[i]?.[field]) setAe(e => { const s = [...e.stats]; s[i] = { ...s[i], [field]: undefined }; return { ...e, stats: s } })
  }
  function addStat() { setForm(f => ({ ...f, stats: [...f.stats, { n: '', l: '' }] })) }
  function removeStat(i: number) {
    setForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))
    setAe(e => ({ ...e, stats: e.stats.filter((_, j) => j !== i) }))
  }

  // About Stats
  function setAboutStat(i: number, field: keyof StatEntry, val: string) {
    setForm(f => { const s = [...f.aboutStats]; s[i] = { ...s[i], [field]: val }; return { ...f, aboutStats: s } })
    if (ae.aboutStats[i]?.[field]) setAe(e => { const s = [...e.aboutStats]; s[i] = { ...s[i], [field]: undefined }; return { ...e, aboutStats: s } })
  }
  function addAboutStat() { setForm(f => ({ ...f, aboutStats: [...f.aboutStats, { n: '', l: '' }] })) }
  function removeAboutStat(i: number) {
    setForm(f => ({ ...f, aboutStats: f.aboutStats.filter((_, j) => j !== i) }))
    setAe(e => ({ ...e, aboutStats: e.aboutStats.filter((_, j) => j !== i) }))
  }

  function extractVideoId(raw: string): string {
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
    return m ? m[1] : raw.trim()
  }

  function setVideo(i: number, field: keyof VideoEntry, value: string) {
    setForm(f => {
      const videos = [...f.videos]
      videos[i] = { ...videos[i], [field]: field === 'id' ? extractVideoId(value) : value }
      return { ...f, videos }
    })
    if (ae.videos[i]?.[field]) setAe(e => { const v = [...e.videos]; v[i] = { ...v[i], [field]: undefined }; return { ...e, videos: v } })
  }

  function addVideo() { setForm(f => ({ ...f, videos: [...f.videos, { id: '', title: '' }] })) }
  function removeVideo(i: number) {
    setForm(f => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }))
    setAe(e => ({ ...e, videos: e.videos.filter((_, j) => j !== i) }))
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reset = () => { if (videoFileRef.current) videoFileRef.current.value = '' }
    if (file.size > 200 * 1024 * 1024) { setToast({ message: 'Video must be smaller than 200 MB.', type: 'error' }); reset(); return }
    setVideoUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload/video', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      const oldPath = form.heroVideo
      setForm(f => ({ ...f, heroVideo: data.url }))
      setToast({ message: 'Background video uploaded.', type: 'success' })
      if (oldPath.startsWith('/uploads/')) fetch('/api/admin/upload/video', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: oldPath }) })
    } else { setToast({ message: data.error || 'Upload failed.', type: 'error' }) }
    setVideoUploading(false); reset()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(form)
    const arrayErrors = validateArrays(form)
    if (Object.keys(fieldErrors).length > 0 || hasAE(arrayErrors)) {
      setErrors(fieldErrors)
      setAe(arrayErrors)
      setToast({ message: 'Please fix the errors below before saving.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data); setAe(emptyAE()); setToast({ message: 'Settings saved successfully.', type: 'success' }) }
    setSaving(false)
  }

  const inp = (key: ScalarKey) => errors[key] ? 'admin-input admin-input--error' : 'admin-input'

  if (loading) return (
    <>
      <div className="admin-topbar"><span className="admin-topbar-title">Site Settings</span></div>
      <div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div>
    </>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Site Settings</span>
        <span className="admin-topbar-date">Contact information &amp; homepage content</span>
      </div>
      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSave} onKeyDown={e => { const tag = (e.target as HTMLElement).tagName; if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') e.preventDefault() }}>

          {/* Phone & WhatsApp */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M3 2h2.5l1 3-1.5 1a9 9 0 004 4l1-1.5 3 1V13a1 1 0 01-1 1C5.4 14 2 10.6 2 3a1 1 0 011-1z" /></svg>
                Phone &amp; WhatsApp
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number *</label>
                  <input type="tel" className={inp('phone')} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 487 244 0000" />
                  {errors.phone ? <span className="admin-field-error">{errors.phone}</span> : <span className="admin-form-hint">Include country code, e.g. +91 98765 43210</span>}
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">WhatsApp Number *</label>
                  <input type="tel" className={inp('whatsapp')} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+914872440000" />
                  {errors.whatsapp ? <span className="admin-field-error">{errors.whatsapp}</span> : <span className="admin-form-hint">Digits + country code, no spaces — used in wa.me links</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" /></svg>
                Social Media
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Instagram *</label>
                  <input className={inp('instagram')} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/ayursiha" />
                  {errors.instagram ? <span className="admin-field-error">{errors.instagram}</span> : <span className="admin-form-hint">Full URL or @handle</span>}
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">YouTube Channel *</label>
                  <input className={inp('youtube')} value={form.youtube} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/@ayursiha" />
                  {errors.youtube ? <span className="admin-field-error">{errors.youtube}</span> : <span className="admin-form-hint">Full channel URL</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M8 1a5 5 0 00-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 00-5-5z" /><circle cx="8" cy="6" r="1.5" /></svg>
                Address
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Full Address *</label>
                <textarea className={errors.address ? 'admin-textarea admin-input--error' : 'admin-textarea'} value={form.address} onChange={e => set('address', e.target.value)} placeholder="11/310 Thuruth, Aluva, Chowara, Kerala 683101" style={{ minHeight: 80 }} />
                {errors.address && <span className="admin-field-error">{errors.address}</span>}
              </div>
            </div>
          </div>

          {/* Hero Background Video */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M1 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" /><path d="M13 6.5l3-2v7l-3-2" /></svg>
                Hero Background Video
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {form.heroVideo && (
                <video key={form.heroVideo} src={form.heroVideo} muted autoPlay loop playsInline style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, background: '#011e24' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => videoFileRef.current?.click()} disabled={videoUploading}>
                  {videoUploading ? 'Uploading…' : form.heroVideo ? 'Replace Video' : 'Upload Video'}
                </button>
                <input ref={videoFileRef} type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={handleVideoUpload} />
                {form.heroVideo && <span style={{ fontSize: '0.78rem', color: '#6b7280', wordBreak: 'break-all' }}>{form.heroVideo}</span>}
              </div>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Recommended: <strong>1920 × 1080 px</strong>, 10–30 s loop &nbsp;·&nbsp; Max <strong>200 MB</strong> &nbsp;·&nbsp; MP4 or WebM</span>
            </div>
          </div>

          {/* Videos — Experience section */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
                Videos — Experience the Healing Environment
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Paste a YouTube URL or 11-character video ID. Videos appear in the grid on the homepage.</span>
              {form.videos.map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: '0 0 200px' }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>YouTube URL / ID *</label>
                    <input className={ae.videos[i]?.id ? 'admin-input admin-input--error' : 'admin-input'} value={v.id} onChange={e => setVideo(i, 'id', e.target.value)} placeholder="https://youtu.be/abc123" />
                    {ae.videos[i]?.id && <span className="admin-field-error">{ae.videos[i]?.id}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Title *</label>
                    <input className={ae.videos[i]?.title ? 'admin-input admin-input--error' : 'admin-input'} value={v.title} onChange={e => setVideo(i, 'title', e.target.value)} placeholder="Video title…" />
                    {ae.videos[i]?.title && <span className="admin-field-error">{ae.videos[i]?.title}</span>}
                  </div>
                  {v.id && !/\s/.test(v.id) && v.id.length === 11 && (
                    <div style={{ paddingTop: '1.6rem' }}>
                      <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Preview <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 2h7v7M12 2L4 10"/></svg>
                      </a>
                    </div>
                  )}
                  <button type="button" onClick={() => removeVideo(i)} style={{ paddingTop: '1.6rem', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }} aria-label="Remove">×</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addVideo} style={{ alignSelf: 'flex-start' }}>+ Add video</button>
            </div>
          </div>

          {/* Credentials Ticker */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M3 8h10M3 4h10M3 12h6" /></svg>
                Credentials Ticker
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Items shown in the scrolling ticker strip below the hero. One badge per line.</span>
              {form.credentials.map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div className="admin-array-item">
                    <input className={ae.credentials[i] ? 'admin-input admin-input--error' : 'admin-input'} value={c} onChange={e => setCredential(i, e.target.value)} placeholder="Ministry of AYUSH Registered" />
                    <button type="button" className="admin-array-remove" onClick={() => removeCredential(i)}>×</button>
                  </div>
                  {ae.credentials[i] && <span className="admin-field-error">{ae.credentials[i]}</span>}
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addCredential}>+ Add item</button>
            </div>
          </div>

          {/* Philosophy Pillars */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="2" y="2" width="12" height="12" rx="2" /><path d="M6 8h4M8 6v4" /></svg>
                Philosophy — Four Pillars
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The four Ayurvedic pillars shown on the homepage Philosophy section.</span>
              {form.pillars.map((p, i) => (
                <div key={i} style={{ background: '#f9fafb', border: `1px solid ${ae.pillars[i] ? '#fca5a5' : '#e5e8ed'}`, borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: '0 0 70px' }}>
                      <label className="admin-label" style={{ fontSize: '0.7rem' }}>Step</label>
                      <input className="admin-input" value={p.step} onChange={e => setPillar(i, 'step', e.target.value)} placeholder="01" style={{ fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label" style={{ fontSize: '0.7rem' }}>Name *</label>
                      <input className={ae.pillars[i]?.name ? 'admin-input admin-input--error' : 'admin-input'} value={p.name} onChange={e => setPillar(i, 'name', e.target.value)} placeholder="Nidan Parivarjan" />
                      {ae.pillars[i]?.name && <span className="admin-field-error">{ae.pillars[i]?.name}</span>}
                    </div>
                    <button type="button" onClick={() => removePillar(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, marginTop: '1.4rem', flexShrink: 0 }} aria-label="Remove">×</button>
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Description *</label>
                    <textarea className={ae.pillars[i]?.body ? 'admin-textarea admin-input--error' : 'admin-textarea'} value={p.body} onChange={e => setPillar(i, 'body', e.target.value)} placeholder="Brief description of this pillar…" style={{ minHeight: 72 }} />
                    {ae.pillars[i]?.body && <span className="admin-field-error">{ae.pillars[i]?.body}</span>}
                  </div>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addPillar}>+ Add pillar</button>
            </div>
          </div>

          {/* About Stats */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M2 14V8h3M6 14V2h4M13 14V5h3" /></svg>
                About Us — Stats
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Stats shown on the About Us page (Year Founded, Patients Healed, etc.).</span>
              {form.aboutStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div className="admin-array-item">
                    <div style={{ flex: '0 0 130px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <input className={ae.aboutStats[i]?.n ? 'admin-input admin-input--error' : 'admin-input'} value={s.n} onChange={e => setAboutStat(i, 'n', e.target.value)} placeholder="2002" style={{ fontWeight: 600 }} />
                      {ae.aboutStats[i]?.n && <span className="admin-field-error">{ae.aboutStats[i]?.n}</span>}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <input className={ae.aboutStats[i]?.l ? 'admin-input admin-input--error' : 'admin-input'} value={s.l} onChange={e => setAboutStat(i, 'l', e.target.value)} placeholder="Year Founded" />
                      {ae.aboutStats[i]?.l && <span className="admin-field-error">{ae.aboutStats[i]?.l}</span>}
                    </div>
                    <button type="button" className="admin-array-remove" onClick={() => removeAboutStat(i)}>×</button>
                  </div>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addAboutStat}>+ Add stat</button>
            </div>
          </div>

          {/* Stats */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M2 14V8h3M6 14V2h4M13 14V5h3" /></svg>
                Philosophy — Stats
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>The achievement stats shown in the Philosophy section (e.g. 4,800+ Patients).</span>
              {form.stats.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div className="admin-array-item">
                    <div style={{ flex: '0 0 130px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <input className={ae.stats[i]?.n ? 'admin-input admin-input--error' : 'admin-input'} value={s.n} onChange={e => setStat(i, 'n', e.target.value)} placeholder="4,800+" style={{ fontWeight: 600 }} />
                      {ae.stats[i]?.n && <span className="admin-field-error">{ae.stats[i]?.n}</span>}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <input className={ae.stats[i]?.l ? 'admin-input admin-input--error' : 'admin-input'} value={s.l} onChange={e => setStat(i, 'l', e.target.value)} placeholder="Patients healed" />
                      {ae.stats[i]?.l && <span className="admin-field-error">{ae.stats[i]?.l}</span>}
                    </div>
                    <button type="button" className="admin-array-remove" onClick={() => removeStat(i)}>×</button>
                  </div>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addStat}>+ Add stat</button>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
          </div>
        </form>
      </div>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}
