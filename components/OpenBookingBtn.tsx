'use client'
export default function OpenBookingBtn() {
  return (
    <button
      className="btn btn-gold"
      onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}
    >
      Book a Consultation
      <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron">
        <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
