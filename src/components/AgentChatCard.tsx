import type { Domain } from '@/data/domains'
import { DomainCardContent } from '@/components/DomainCard'
import { CTA_CLASS } from '@/lib/domainCardTheme'

/** /experience 도메인 카드와 같은 내부 콘텐츠(아이콘/설명/키워드)를 보여주지만, 여기서는
 *  카드 자체가 클릭 대상이 아니라 정보만 보여주는 일반 카드다(마우스 틸트/글로우 없음).
 *  실제로 누르는 건 카드 안의 "에이전트 채팅 시작" 버튼 하나뿐이고, 누르면 분할 뷰 안내
 *  모달이 뜬다(실제 링크는 그 모달 안에 있음 — SplitViewGuideModal 참조). */
function AgentChatCard({ domain, onOpenGuide }: { domain: Domain; onOpenGuide: () => void }) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface-1 p-6 text-left">
      <DomainCardContent
        domain={domain}
        cta={
          <button type="button" onClick={onOpenGuide} className={`${CTA_CLASS} hover:opacity-90`}>
            에이전트 채팅 시작
          </button>
        }
      />
    </div>
  )
}

export default AgentChatCard
