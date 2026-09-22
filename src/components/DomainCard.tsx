import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Domain } from '@/data/domains'
import { ClockIcon } from '@/components/icons/DomainIcons'
import {
  CTA_CLASS,
  GLOW,
  TILT_DEG,
  accentBadge,
  accentBorderHover,
  accentText,
} from '@/lib/domainCardTheme'

/** 아이콘 · 제목 · 직무 배지 · 카드 안의 카드(소요시간/설명/키워드) — 카드 시각 구성 전체를 공유.
 *  /experience의 DomainCard와 플레이그라운드 사이드바의 AgentChatCard가 이 콘텐츠를 그대로 공유하고,
 *  바깥 요소(Link vs button)와 CTA 라벨만 다르게 가져간다. */
export function DomainCardContent({ domain, cta }: { domain: Domain; cta: ReactNode }) {
  const { Icon } = domain
  const keywords = domain.example.split('·').map((keyword) => keyword.trim())

  return (
    <>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${accentBadge[domain.accent]}`}
        >
          <Icon className={`h-6 w-6 ${accentText[domain.accent]}`} />
        </span>
        <div className="flex flex-col gap-0.5 pt-1">
          <h2 className="text-base font-semibold leading-tight text-text-primary">
            {domain.nameKo}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.15em] text-text-secondary">
            {domain.nameEn}
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium ${accentBadge[domain.accent]} ${accentText[domain.accent]}`}
      >
        {domain.agentName}
      </span>

      {/* 카드 안의 카드 — 배경을 한 단계 밝혀서(surface-2) 정보 블록을 시각적으로 구분한다 */}
      <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{domain.duration}</span>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">{domain.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-border bg-surface-1 px-2.5 py-1 text-[11px] text-text-secondary"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {cta}
    </>
  )
}

function DomainCard({ domain }: { domain: Domain }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const glow = GLOW[domain.id] ?? { c1: '#414aff', c2: '#8920ff' }

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const ratioX = (event.clientX - rect.left) / rect.width
    const ratioY = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--mx', `${ratioX * 100}%`)
    card.style.setProperty('--my', `${ratioY * 100}%`)
    const rotateY = (ratioX - 0.5) * TILT_DEG
    const rotateX = (0.5 - ratioY) * TILT_DEG
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (card) card.style.transform = ''
  }

  return (
    <Link
      ref={cardRef}
      to={`/playground/${domain.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--c1': glow.c1, '--c2': glow.c2 } as CSSProperties}
      className={`tilt-card group flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface-1 p-6 transition-colors ${accentBorderHover[domain.accent]}`}
    >
      <DomainCardContent domain={domain} cta={<span className={CTA_CLASS}>체험하기 →</span>} />
    </Link>
  )
}

export default DomainCard
