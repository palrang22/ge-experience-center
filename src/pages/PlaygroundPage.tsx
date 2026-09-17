import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AgentChatCard from '@/components/AgentChatCard'
import ScenarioStepCard from '@/components/ScenarioStepCard'
import SplitViewGuideModal from '@/components/SplitViewGuideModal'
import { domains, type Domain } from '@/data/domains'
import { openChatPane } from '@/lib/chatPane'
import { getScenario } from '@/data/scenarios'

function PlaygroundPage() {
  const { domainId } = useParams<{ domainId: string }>()
  const domain = domains.find((candidate) => candidate.id === domainId)

  if (!domain) {
    return (
      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-green">PLAYGROUND</p>
        <h1 className="text-3xl font-semibold tracking-tight">도메인을 찾을 수 없습니다</h1>
        <p className="max-w-xl text-text-secondary">
          <Link to="/experience" className="text-brand-blue underline">
            도메인 선택으로 돌아가기
          </Link>
        </p>
      </section>
    )
  }

  // key={domain.id}로 도메인이 바뀔 때마다 완료 상태를 자연스럽게 리셋한다(effect로 setState하지 않음).
  return <PlaygroundScenario key={domain.id} domain={domain} />
}

function PlaygroundScenario({ domain }: { domain: Domain }) {
  const scenario = getScenario(domain.id)
  const totalSteps = scenario?.steps.length ?? 0
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [guideOpen, setGuideOpen] = useState(false)
  const progress = totalSteps ? (completedSteps.size / totalSteps) * 100 : 0

  function toggleStep(step: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(step)) {
        next.delete(step)
      } else {
        next.add(step)
      }
      return next
    })
  }

  function handleStartChat() {
    openChatPane(domain.agentChatUrl)
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:gap-10">
      {/* 왼쪽 사이드바 — 도메인 정보 카드(정적, 애니메이션 없음) + 채팅 시작 버튼.
          버튼을 누르면 바로 채팅이 열리는 게 아니라 분할 뷰 안내 모달이 뜬다. */}
      <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-green">PLAYGROUND</p>
        <AgentChatCard domain={domain} onOpenGuide={() => setGuideOpen(true)} />
        <SplitViewGuideModal
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          agentChatUrl={domain.agentChatUrl}
          onOpenChat={handleStartChat}
        />
      </aside>

      {/* 오른쪽 본문 — 상단 완료바 + 단계별 아코디언 카드 */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-primary">
              데모 가이드 · 전체 {totalSteps}단계
            </h2>
            <p className="text-sm text-text-secondary">
              순서대로 프롬프트를 복사해 에이전트 채팅창에 입력하면 시나리오가 이어집니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green shadow-[0_0_10px_-2px_rgba(137,32,255,0.8)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-sm text-text-secondary">
              {completedSteps.size}/{totalSteps}
            </span>
            <button
              type="button"
              onClick={() => setCompletedSteps(new Set())}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {scenario?.steps.map((step) => (
            <ScenarioStepCard
              key={step.step}
              domainId={domain.id}
              step={step}
              completed={completedSteps.has(step.step)}
              onToggleComplete={() => toggleStep(step.step)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlaygroundPage
