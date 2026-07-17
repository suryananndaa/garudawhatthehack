type IconProps = { className?: string }

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  )
}

export function IconMail({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

export function IconLock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  )
}

export function IconEye({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export function IconEyeOff({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7C11 5.6 11.5 5.5 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.4 4.2M7 6.7A15.4 15.4 0 0 0 2.5 12S6 18.5 12 18.5c1.1 0 2.1-.2 3-.5" />
      <path d="M9.9 9.9a2.6 2.6 0 0 0 3.6 3.6" />
    </svg>
  )
}

export function IconWheat({ className }: IconProps) {
  return (
    <svg {...base} width={22} height={22} className={className}>
      <path d="M12 21V9" />
      <path d="M12 9c0-2.5-1.8-4-4-4.5C8.5 6.7 10 8.5 12 9Z" />
      <path d="M12 9c0-2.5 1.8-4 4-4.5C15.5 6.7 14 8.5 12 9Z" />
      <path d="M12 13c0-2.5-1.8-4-4-4.5c.5 2.2 2 4 4 4.5Z" />
      <path d="M12 13c0-2.5 1.8-4 4-4.5c-.5 2.2-2 4-4 4.5Z" />
    </svg>
  )
}

export function IconCart({ className }: IconProps) {
  return (
    <svg {...base} width={22} height={22} className={className}>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  )
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} width={15} height={15} className={className}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}
