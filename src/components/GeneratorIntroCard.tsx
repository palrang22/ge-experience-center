import { ClockIcon, WandIcon } from '@/components/icons/DomainIcons'
import { CTA_CLASS, accentBadge, accentText } from '@/lib/domainCardTheme'

const KEYWORDS = ['회사 도메인 입력', '맞춤 시나리오 생성', '배포 스크립트·데이터 다운로드']

/** AgentChatCard/DomainCardContent와 같은 시각 구조(아이콘·배지·설명 카드)를 쓰지만,
 *  특정 Domain에 종속되지 않는 "에이전트 만들기" 자체를 소개하는 고정 문구 카드다. */
function GeneratorIntroCard({ onOpenGuide }: { onOpenGuide: () => void }) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface-1 p-6 text-left">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${accentBadge.purple}`}
        >
          <WandIcon className={`h-6 w-6 ${accentText.purple}`} />
        </span>
        <div className="flex flex-col gap-0.5 pt-1">
          <h2 className="text-base font-semibold leading-tight text-text-primary">
            에이전트 만들기
          </h2>
          <p className="font-mono text-[10px] tracking-[0.15em] text-text-secondary">
            AI AGENT GENERATOR
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium ${accentBadge.purple} ${accentText.purple}`}
      >
        GE Demo Generator
      </span>

      <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>약 10분 · 4단계</span>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          내가 소개하고 싶은 회사의 도메인만 입력하면, 그 회사 업무에 맞춘 합성 데이터와 에이전트
          배포 스크립트를 자동으로 만들어 줍니다. 화면은 전부 영어라 오른쪽 가이드를 따라 진행하면
          됩니다.
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {KEYWORDS.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-border bg-surface-1 px-2.5 py-1 text-[11px] text-text-secondary"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <button type="button" onClick={onOpenGuide} className={`${CTA_CLASS} hover:opacity-90`}>
        에이전트 만들기 시작
      </button>
    </div>
  )
}

export default GeneratorIntroCard
