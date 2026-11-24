import Link from 'next/link'
import type { ReactNode, CSSProperties } from 'react'

type Variant = 'forest' | 'gold' | 'ghost' | 'outline' | 'dark'

interface BtnProps {
  children: ReactNode
  variant?: Variant
  href?: string
  external?: boolean
  chevron?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  style?: CSSProperties
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-chevron">
      <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Btn({
  children,
  variant = 'forest',
  href,
  external = false,
  chevron = true,
  className,
  onClick,
  type = 'button',
  disabled,
  style,
}: BtnProps) {
  const cls = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')

  if (href) {
    if (href.startsWith('/') && !external) {
      return (
        <Link href={href} className={cls} style={style}>
          {children}
          {chevron && <ChevronIcon />}
        </Link>
      )
    }
    return (
      <a
        href={href}
        className={cls}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {chevron && <ChevronIcon />}
      </a>
    )
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} style={style}>
      {children}
      {chevron && <ChevronIcon />}
    </button>
  )
}
