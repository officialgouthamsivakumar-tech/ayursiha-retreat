'use client'
import { useEffect, useState } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'

const levelOptions = ['Beginner', 'Intermediate', 'Advanced']

interface Props {
  open: boolean
  onClose: () => void
}

export default function YogaModal({ open, onClose }: Props) {
  const trapRef = useFocusTrap(open)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', level: '', date: '', message: '' })
  const [phoneError, setPhoneError] = useState('')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function close() { onClose(); setSubmitted(false); setPhoneError('') }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '')
      if (value && (digits.length < 10 || digits.length > 13)) {
        setPhoneError('Enter a valid phone number (10–13 digits)')
      } else {
        setPhoneError('')
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (phoneError) return
    setSubmitted(true)
  }

  if (!open) return null

  return (
    <div className="bm-backdrop" onClick={close} role="dialog" aria-modal="true" aria-labelledby="ym-title">
      <div className="bm-panel" ref={trapRef} onClick={e => e.stopPropagation()}>
        <button className="bm-close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        {submitted ? (
          <div className="bm-success">
            <div className="bm-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <h3 className="bm-success-h">You&apos;re registered!</h3>
            <p className="bm-success-p">Thank you, {form.name.split(' ')[0]}. Our team will contact you within 24 hours to confirm your yoga session.</p>
            <button className="btn btn-gold" onClick={close} style={{ marginTop: '1.5rem' }}>Done</button>
          </div>
        ) : (
          <>
            <div className="bm-header">
              <p className="label">Ayursiha Retreat</p>
              <h2 className="bm-title" id="ym-title">Join a Yoga Session</h2>
              <p className="bm-sub">Fill in your details and our team will confirm your session within 24 hours.</p>
            </div>

            <form className="bm-form" onSubmit={handleSubmit}>
              <div className="bm-row">
                <div className="bm-field">
                  <label className="bm-label">Full Name</label>
                  <input className="bm-input" name="name" type="text" placeholder="Your full name" required value={form.name} onChange={handleChange} />
                </div>
                <div className="bm-field">
                  <label className="bm-label">Phone</label>
                  <input className="bm-input" name="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
                  {phoneError && <span style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
                </div>
              </div>

              <div className="bm-field">
                <label className="bm-label">Email</label>
                <input className="bm-input" name="email" type="email" placeholder="your@email.com" required value={form.email} onChange={handleChange} />
              </div>

              <div className="bm-row">
                <div className="bm-field">
                  <label className="bm-label">Experience Level</label>
                  <select className="bm-input bm-select" name="level" value={form.level} onChange={handleChange}>
                    <option value="">Select level</option>
                    {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="bm-field">
                  <label className="bm-label">Preferred Date</label>
                  <input className="bm-input" name="date" type="date" value={form.date} onChange={handleChange} />
                </div>
              </div>

              <div className="bm-field">
                <label className="bm-label">Message <span className="bm-optional">(optional)</span></label>
                <textarea className="bm-input bm-textarea" name="message" placeholder="Any health conditions or goals we should know about…" rows={3} value={form.message} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-gold bm-submit">
                Register for Session
                <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron"><path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
