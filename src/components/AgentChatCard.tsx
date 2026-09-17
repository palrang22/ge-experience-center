import { useRef, type CSSProperties, type MouseEvent } from 'react'
import type { Domain } from '@/data/domains'
import { DomainCardContent } from '@/components/DomainCard'
import { CTA_CLASS, GLOW, TILT_DEG, accentBorderHover } from '@/lib/domainCardTheme'

/** /experience 도메인 카드와 완전히 동일한 시각 디자인을, 플레이그라운드 좌측 사이드바에서는
 *  "다음 도메인으로 이동" 대신 "에이전트 채팅 시작"을 트리거하는 버튼으로 재사용한다. */
function AgentChatCard({ domain, onStartChat }: { domain: Domain; onStartChat: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const glow = GLOW[domain.id] ?? { c1: '#414aff', c2: '#8920ff' }

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
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
    <button
      type="button"
      ref={cardRef}
      onClick={onStartChat}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--c1': glow.c1, '--c2': glow.c2 } as CSSProperties}
      className={`tilt-card group flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface-1 p-6 text-left transition-colors ${accentBorderHover[domain.accent]}`}
    >
      <DomainCardContent
        domain={domain}
        cta={<span className={CTA_CLASS}>에이전트 채팅 시작</span>}
      />
    </button>
  )
}

export default AgentChatCard
