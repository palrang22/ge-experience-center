import type { DomainAccent } from '@/data/domains'

// 마우스 스포트라이트/테두리 글로우 색 — 전 카드 공통 보라(브랜드 --brand-purple 톤 하나로 통일, 2026-09-17).
const PURPLE_GLOW = { c1: '#c084fc', c2: '#8920ff' }
export const GLOW: Record<string, { c1: string; c2: string }> = {
  manufacturing: PURPLE_GLOW,
  finance: PURPLE_GLOW,
  retail: PURPLE_GLOW,
  'it-devops': PURPLE_GLOW,
  media: PURPLE_GLOW,
  'public-sector': PURPLE_GLOW,
}
export const TILT_DEG = 9

export const accentText: Record<DomainAccent, string> = {
  blue: 'text-brand-blue',
  purple: 'text-brand-purple',
  green: 'text-brand-green',
}

export const accentBadge: Record<DomainAccent, string> = {
  blue: 'border-brand-blue/30 bg-brand-blue/10',
  purple: 'border-brand-purple/30 bg-brand-purple/10',
  green: 'border-brand-green/30 bg-brand-green/10',
}

export const accentBorderHover: Record<DomainAccent, string> = {
  blue: 'hover:border-brand-blue/60',
  purple: 'hover:border-brand-purple/60',
  green: 'hover:border-brand-green/60',
}

export const CTA_CLASS =
  'flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple py-3 text-sm font-semibold text-white transition-opacity group-hover:opacity-90'
