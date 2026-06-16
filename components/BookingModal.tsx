'use client'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCustomEvent } from '@/hooks/useCustomEvent'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import Btn from './Btn'

interface Props {
  whatsapp?: string
}

export default function BookingModal({ whatsapp = '+914872440000' }: Props) {
  const t = useTranslations('booking')
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', treatment: '', date: '', message: '' })

  const openModal = useCallback(() => setOpen(true), [])
  useCustomEvent('openBooking', openModal)
  const trapRef = useFocusTrap(open)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false); setSubmitted(false) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const lines = [
      `\u{1F33F} *New Consultation Request*`,
      `\n*Name:* ${form.name}`,
      form.phone && `*Phone:* ${form.phone}`,
      `*Email:* ${form.email}`,
      form.treatment && `*Treatment:* ${form.treatment}`,
      form.date && `*Preferred Date:* ${form.date}`,
      form.message && `\n*Message:*\n_${form.message}_`,
    ].filter(Boolean)

    const waNumber = whatsapp.replace(/\D/g, '')
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    setSubmitted(true)
  }

  const treatmentOptions = t.raw('treatmentOptions') as string[]

  if (!open) return null

  return (
    <div className="bm-backdrop" onClick={close} role="dialog" aria-modal="true" aria-labelledby="bm-title">
      <div className="bm-panel" ref={trapRef} onClick={e => e.stopPropagation()}>
        <button className="bm-close" onClick={close} aria-label={t('close')}>
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
            <h3 className="bm-success-h">{t('successTitle')}</h3>
            <p className="bm-success-p">Thank you, {form.name.split(' ')[0]}. {t('successBody')}</p>
            <Btn variant="gold" onClick={close} chevron={false} style={{ marginTop: '1.5rem' }}>{t('done')}</Btn>
          </div>
        ) : (
          <>
            <div className="bm-header">
              <p className="label">{t('label')}</p>
              <h2 className="bm-title" id="bm-title">{t('title')}</h2>
              <p className="bm-sub">{t('sub')}</p>
            </div>

            <form className="bm-form" onSubmit={handleSubmit}>
              <div className="bm-row">
                <div className="bm-field">
                  <label className="bm-label">{t('fields.fullName')}</label>
                  <input className="bm-input" name="name" type="text" placeholder={t('placeholders.fullName')} required value={form.name} onChange={handleChange} />
                </div>
                <div className="bm-field">
                  <label className="bm-label">{t('fields.phone')}</label>
                  <input className="bm-input" name="phone" type="tel" placeholder={t('placeholders.phone')} value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="bm-field">
                <label className="bm-label">{t('fields.email')}</label>
                <input className="bm-input" name="email" type="email" placeholder={t('placeholders.email')} required value={form.email} onChange={handleChange} />
              </div>

              <div className="bm-row">
                <div className="bm-field">
                  <label className="bm-label">{t('fields.treatment')}</label>
                  <select className="bm-input bm-select" name="treatment" value={form.treatment} onChange={handleChange}>
                    <option value="">{t('placeholders.treatment')}</option>
                    {treatmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="bm-field">
                  <label className="bm-label">{t('fields.date')}</label>
                  <input className="bm-input" name="date" type="date" value={form.date} onChange={handleChange} />
                </div>
              </div>

              <div className="bm-field">
                <label className="bm-label">{t('fields.message')} <span className="bm-optional">{t('fields.messageOptional')}</span></label>
                <textarea className="bm-input bm-textarea" name="message" placeholder={t('placeholders.message')} rows={3} value={form.message} onChange={handleChange} />
              </div>

              <Btn variant="gold" type="submit" className="bm-submit">{t('submit')}</Btn>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
