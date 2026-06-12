'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SiteSettings, PillarEntry, StatEntry } from '@/lib/db'
import AdminToast from '../../../_components/AdminToast'

const empty: SiteSettings = { phone: '', whatsapp: '', instagram: '', youtube: '', address: '', heroVideo: '', aboutHeroImage: '', experienceImages: ['', '', '', ''], experienceHeroImage: '', experiencePageImages: ['', '', '', ''], videos: [], credentials: [], pillars: [], stats: [], aboutStats: [] }

type CredentialErrors = (string | undefined)[]
type PillarErrors = ({ step?: string; name?: string; body?: string } | undefined)[]
type StatErrors = ({ n?: string; l?: string } | undefined)[]

interface ArrayErrors {
  credentials: CredentialErrors
  pillars: PillarErrors
  stats: StatErrors
  aboutStats: StatErrors
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

export default function ContentSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty)
  const [arrayErrors, setArrayErrors] = useState<ArrayErrors>({ credentials: [], pillars: [], stats: [], aboutStats: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: SiteSettings) => { setForm(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

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
    const hasArrayErr = ae.credentials.some(Boolean) || ae.pillars.some(Boolean) || ae.stats.some(Boolean) || ae.aboutStats.some(Boolean)
    if (hasArrayErr) {
      setArrayErrors(ae)
      setToast({ message: 'Please fix the errors below before saving.', type: 'error' })
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setToast({ message: data.error || 'Failed to save.', type: 'error' }) }
    else { setForm(data); setArrayErrors({ credentials: [], pillars: [], stats: [], aboutStats: [] }); setToast({ message: 'Settings saved.', type: 'success' }) }
    setSaving(false)
  }

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

          {/* Credentials Ticker */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <span className="admin-card-title">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginRight: 6 }}><path d="M1 8h14M4 4l4-3 4 3M4 12l4 3 4-3"/></svg>
                Credentials Ticker
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Short trust badges that scroll across the homepage — e.g. "Ministry of AYUSH Registered".</span>
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
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Numbers shown below the Philosophy section, e.g. "4,800+ / Patients Healed".</span>
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
              <span className="admin-form-hint" style={{ marginTop: 0 }}>Stats shown on the About page, e.g. "2002 / Year Founded" and "97% / Patient Satisfaction".</span>
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
