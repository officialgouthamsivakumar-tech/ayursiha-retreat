'use client'

import { useEffect } from 'react'

type Props = { message: string; type: 'success' | 'error'; onClose: () => void }

export default function AdminToast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`admin-toast admin-toast--${type}`}>
      <div className="admin-toast-icon">
        {type === 'success' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="8" cy="8" r="7" /><path d="M5 8l2 2 4-4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="8" cy="8" r="7" /><path d="M8 5v3M8 11v.5" />
          </svg>
        )}
      </div>
      <span className="admin-toast-message">{message}</span>
      <button className="admin-toast-close" onClick={onClose} aria-label="Dismiss">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  )
}
