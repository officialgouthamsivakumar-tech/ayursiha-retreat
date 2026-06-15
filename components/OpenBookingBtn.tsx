'use client'
import Btn from './Btn'

export default function OpenBookingBtn() {
  return (
    <Btn onClick={() => window.dispatchEvent(new CustomEvent('openBooking'))}>
      Book a Consultation
    </Btn>
  )
}
