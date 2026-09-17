import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20V11l5 3v-3l5 3v-3l5 3v6H3Z" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <line x1="7" y1="8" x2="7" y2="5" />
      <line x1="10" y1="8" x2="10" y2="5" />
    </svg>
  )
}

export function BankIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="4 9 12 4 20 9" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="6" y1="9" x2="6" y2="18" />
      <line x1="10" y1="9" x2="10" y2="18" />
      <line x1="14" y1="9" x2="14" y2="18" />
      <line x1="18" y1="9" x2="18" y2="18" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </svg>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.4 12h11.2l1.8-8H7" />
      <circle cx="8.5" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CloudIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17a4 4 0 0 1-.5-7.97A5 5 0 0 1 16.5 8 4 4 0 0 1 18 17H7Z" />
    </svg>
  )
}

export function BroadcastIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M8.5 8.7a5 5 0 0 0 0 6.6" />
      <path d="M15.5 8.7a5 5 0 0 1 0 6.6" />
      <path d="M5.3 5.5a9.2 9.2 0 0 0 0 13" />
      <path d="M18.7 5.5a9.2 9.2 0 0 1 0 13" />
    </svg>
  )
}

export function CityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="3" y1="20" x2="21" y2="20" />
      <rect x="5" y="10" width="5" height="10" />
      <rect x="13" y="5" width="6" height="15" />
      <line x1="15" y1="8" x2="17" y2="8" />
      <line x1="15" y1="11" x2="17" y2="11" />
      <line x1="15" y1="14" x2="17" y2="14" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}
