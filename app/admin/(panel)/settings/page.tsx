'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings, VideoEntry } from '@/lib/db'
import AdminToast from '../../_components/AdminToast'

const emptyHomeContent = {
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

const emptyExperience = { heroLabel: '', heroHeading: '', heroSub: '', introLabel: '', introHeading: '', introBody1: '', introBody2: '', narrativeHeadingLine1: '', narrativeHeadingLine2: '', narrativeBody: '', cards: [{ label: '', title: '', body: '' }, { label: '', title: '', body: '' }, { label: '', title: '', body: '' }, { label: '', title: '', body: '' }], ctaHeading: '', ctaSub: '' }
const emptyAbout = { heroLabel: '', heroHeading: '', heroSub: '', storyLabel: '', storyHeadingLine1: '', storyHeadingLine2: '', storyBody1: '', storyBody2: '', storyBody3: '', missionQuote: '', pillarsLabel: '', pillarsHeading: '', pillars: [{ title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }], teamLabel: '', teamHeading: '', ctaHeading: '', ctaSub: '' }
const emptyTreatments = { heroLabel: '', heroHeading: '', heroSub: '', introLabel: '', introHeading: '', introBody: '', ctaHeading: '', ctaSub: '' }

const empty: SiteSettings = { phone: '', whatsapp: '', instagram: '', youtube: '', address: '', heroVideo: '', aboutHeroImage: '', treatmentsHeroImage: '', experienceImages: ['', '', '', ''], experienceHeroImage: '', experiencePageImages: ['', '', '', ''], videos: [], credentials: [], pillars: [], stats: [], aboutStats: [], homeContent: emptyHomeContent as SiteSettings['homeContent'], experiencePageContent: emptyExperience as SiteSettings['experiencePageContent'], aboutPageContent: emptyAbout as SiteSettings['aboutPageContent'], treatmentsPageContent: emptyTreatments as SiteSettings['treatmentsPageContent'] }

type ScalarKey = Exclude<keyof SiteSettings, 'videos' | 'heroVideo' | 'aboutHeroImage' | 'treatmentsHeroImage' | 'experienceImages' | 'experienceHeroImage' | 'experiencePageImages' | 'credentials' | 'pillars' | 'stats' | 'aboutStats' | 'homeContent'>
type FieldErrors = Partial<Record<ScalarKey, string>>
type VideoErrors = ({ id?: string; title?: string } | undefined)[]

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

function validateVideos(videos: SiteSettings['videos']): VideoErrors {
  return videos.map(v => {
    const vErr: { id?: string; title?: string } = {}
    if (!v.id.trim()) vErr.id = 'Video ID is required.'
    else if (!/^[A-Za-z0-9_-]{11}$/.test(v.id.trim())) vErr.id = 'Must be an 11-character YouTube video ID.'
    if (!v.title.trim()) vErr.title = 'Title is required.'
    return Object.keys(vErr).length ? vErr : undefined
  })
}

export default function ContactSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [videoErrors, setVideoErrors] = useState<VideoErrors>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [imgUploading, setImgUploading] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const aboutImgRef = useRef<HTMLInputElement>(null)
  const expImgRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const treatmentsImgRef = useRef<HTMLInputElement>(null)
  const expHeroRef = useRef<HTMLInputElement>(null)
  const expPageRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

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

  function extractVideoId(raw: string): string {
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
    return m ? m[1] : raw.trim()
  }

  function setVideo(i: number, field: keyof VideoEntry, value: string) {
    setForm(f => { const v = [...f.videos]; v[i] = { ...v[i], [field]: field === 'id' ? extractVideoId(value) : value }; return { ...f, videos: v } })
    if (videoErrors[i]?.[field]) setVideoErrors(e => { const v = [...e]; v[i] = { ...v[i], [field]: undefined }; return v })
  }
  function addVideo() { setForm(f => ({ ...f, videos: [...f.videos, { id: '', title: '' }] })) }
  function removeVideo(i: number) {
    setForm(f => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }))
    setVideoErrors(e => e.filter((_, j) => j !== i))
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
      if (oldPath.startsWith('/uploads/') || oldPath.startsWith('/api/uploads/')) fetch('/api/admin/upload/video', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: oldPath }) })
    } else { setToast({ message: data.error || 'Upload failed.', type: 'error' }) }
    setVideoUploading(false); reset()
  }

  async function handleImageUpload(key: 'aboutHeroImage' | 'treatmentsHeroImage' | 'experienceHeroImage' | 'experienceImages' | 'experiencePageImages', idx: number | null, file: File) {
    if (file.size > 5 * 1024 * 1024) { setToast({ message: 'Image must be smaller than 5 MB.', type: 'error' }); return }
    const uploadKey = key + (idx !== null ? idx : '')
    setImgUploading(s => ({ ...s, [uploadKey]: true }))
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        if (key === 'aboutHeroImage' || key === 'treatmentsHeroImage' || key === 'experienceHeroImage') {
          const old = form[key]
          setForm(f => ({ ...f, [key]: data.url }))
          if (old?.startsWith('/api/uploads/')) fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: old }) }).catch(() => {})
        } else {
          const arrKey = key as 'experienceImages' | 'experiencePageImages'
          setForm(f => { const imgs = [...(f[arrKey] ?? ['', '', '', ''])]; imgs[idx!] = data.url; return { ...f, [arrKey]: imgs } })
        }
        setToast({ message: 'Image uploaded.', type: 'success' })
      } else { setToast({ message: data.error || 'Upload failed.', type: 'error' }) }
    } catch {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' })
    }
    setImgUploading(s => ({ ...s, [uploadKey]: false }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const fe = validate(form)
    const ve = validateVideos(form.videos)
    if (Object.keys(fe).length || ve.some(Boolean)) {
      setErrors(fe); setVideoErrors(ve)
      setToast({ message: 'Please fix the errors below before saving.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data); setVideoErrors([]); setToast({ message: 'Settings saved.', type: 'success' }) }
    setSaving(false)
  }

  const inp = (key: ScalarKey) => errors[key] ? 'admin-input admin-input--error' : 'admin-input'

  if (loading) return (
    <><div className="admin-topbar"><span className="admin-topbar-title">Contact &amp; Media</span></div><div className="admin-content"><p style={{ color: '#9ca3af' }}>Loading…</p></div></>
  )

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Contact &amp; Media</span>
        <Link href="/admin/settings/content" className="admin-btn admin-btn-ghost admin-btn-sm">Homepage Content →</Link>
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

          {/* About Hero Image */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                About Page — Hero Background Image
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {form.aboutHeroImage ? (
                <div style={{ width: 200, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                  <Image src={form.aboutHeroImage} alt="About hero" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              ) : (
                <div style={{ width: 200, height: 120, borderRadius: 8, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => aboutImgRef.current?.click()} disabled={imgUploading['aboutHeroImage']}>
                  {imgUploading['aboutHeroImage'] ? 'Uploading…' : form.aboutHeroImage ? 'Replace Image' : 'Upload Image'}
                </button>
                <input ref={aboutImgRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload('aboutHeroImage', null, f); e.target.value = '' }} />
                <span className="admin-form-hint">JPEG/PNG/WebP · min 1200×600 px recommended</span>
              </div>
            </div>
          </div>

          {/* Treatments Hero Image */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Treatments Page — Hero Background Image
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {form.treatmentsHeroImage ? (
                <div style={{ width: 200, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                  <Image src={form.treatmentsHeroImage} alt="Treatments hero" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              ) : (
                <div style={{ width: 200, height: 120, borderRadius: 8, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => treatmentsImgRef.current?.click()} disabled={imgUploading['treatmentsHeroImage']}>
                  {imgUploading['treatmentsHeroImage'] ? 'Uploading…' : form.treatmentsHeroImage ? 'Replace Image' : 'Upload Image'}
                </button>
                <input ref={treatmentsImgRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload('treatmentsHeroImage', null, f); e.target.value = '' }} />
                <span className="admin-form-hint">JPEG/PNG/WebP · min 1200×600 px recommended</span>
              </div>
            </div>
          </div>

          {/* Experience Card Images */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Experience Section — Card Images
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Background images for the 4 experience cards on the homepage.</span>
              {['Arrive & Assess', 'Your Personal Plan', 'Daily Treatments', 'Lasting Restoration'].map((label, i) => {
                const img = form.experienceImages?.[i] ?? ''
                const uploadKey = 'experienceImages' + i
                return (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {img ? (
                      <div style={{ width: 120, height: 72, borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                        <Image src={img} alt={label} fill style={{ objectFit: 'cover' }} unoptimized />
                      </div>
                    ) : (
                      <div style={{ width: 120, height: 72, borderRadius: 6, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className="admin-label" style={{ marginBottom: 0 }}>Card {i + 1} — {label}</span>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => expImgRefs[i].current?.click()} disabled={imgUploading[uploadKey]}>
                        {imgUploading[uploadKey] ? 'Uploading…' : img ? 'Replace' : 'Upload'}
                      </button>
                      <input ref={expImgRefs[i]} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload('experienceImages', i, f); e.target.value = '' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Experience Page — Hero Image */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Experience Page — Hero Background Image
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {form.experienceHeroImage ? (
                <div style={{ width: 200, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                  <Image src={form.experienceHeroImage} alt="Experience hero" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              ) : (
                <div style={{ width: 200, height: 120, borderRadius: 8, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => expHeroRef.current?.click()} disabled={imgUploading['experienceHeroImage']}>
                  {imgUploading['experienceHeroImage'] ? 'Uploading…' : form.experienceHeroImage ? 'Replace Image' : 'Upload Image'}
                </button>
                <input ref={expHeroRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload('experienceHeroImage', null, f); e.target.value = '' }} />
                <span className="admin-form-hint">Full-width hero on the /experience page · min 1920×800 px</span>
              </div>
            </div>
          </div>

          {/* Experience Page — Content Images */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Experience Page — Section Images
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Images for the 4 alternating content sections on the /experience page.</span>
              {['Panchakarma & Classical Healing', 'Your Personalised Healing Plan', 'Yoga & Meditation Sessions', 'Rasayana & Post-Stay Care'].map((label, i) => {
                const img = form.experiencePageImages?.[i] ?? ''
                const uploadKey = 'experiencePageImages' + i
                return (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {img ? (
                      <div style={{ width: 120, height: 72, borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e8ed', flexShrink: 0, position: 'relative', background: '#f5f7fa' }}>
                        <Image src={img} alt={label} fill style={{ objectFit: 'cover' }} unoptimized />
                      </div>
                    ) : (
                      <div style={{ width: 120, height: 72, borderRadius: 6, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fafbfc' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className="admin-label" style={{ marginBottom: 0 }}>Section {i + 1} — {label}</span>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => expPageRefs[i].current?.click()} disabled={imgUploading[uploadKey]}>
                        {imgUploading[uploadKey] ? 'Uploading…' : img ? 'Replace' : 'Upload'}
                      </button>
                      <input ref={expPageRefs[i]} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload('experiencePageImages', i, f); e.target.value = '' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* YouTube Videos */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
                Videos — Experience Section
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Paste a YouTube URL or 11-character video ID.</span>
              {form.videos.map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: '0 0 200px' }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>YouTube URL / ID *</label>
                    <input className={videoErrors[i]?.id ? 'admin-input admin-input--error' : 'admin-input'} value={v.id} onChange={e => setVideo(i, 'id', e.target.value)} placeholder="https://youtu.be/abc123" />
                    {videoErrors[i]?.id && <span className="admin-field-error">{videoErrors[i]?.id}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label" style={{ fontSize: '0.7rem' }}>Title *</label>
                    <input className={videoErrors[i]?.title ? 'admin-input admin-input--error' : 'admin-input'} value={v.title} onChange={e => setVideo(i, 'title', e.target.value)} placeholder="Video title…" />
                    {videoErrors[i]?.title && <span className="admin-field-error">{videoErrors[i]?.title}</span>}
                  </div>
                  {v.id && v.id.length === 11 && (
                    <div style={{ paddingTop: '1.6rem' }}>
                      <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Preview <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 2h7v7M12 2L4 10"/></svg>
                      </a>
                    </div>
                  )}
                  <button type="button" onClick={() => removeVideo(i)} style={{ paddingTop: '1.6rem', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }} aria-label="Remove">×</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={addVideo}>+ Add video</button>
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
