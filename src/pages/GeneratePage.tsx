import { useState } from 'react'
import GeneratorIntroCard from '@/components/GeneratorIntroCard'
import GeneratorStepCard from '@/components/GeneratorStepCard'
import SplitViewGuideModal from '@/components/SplitViewGuideModal'
import { generatorSteps } from '@/data/generatorGuide'
import { openChatPane } from '@/lib/chatPane'

// mz.co.kr 계정 인증 필요 여부는 아직 실측 전 — plan.md Phase 10 TODO 참조.
const GE_DEMO_GENERATOR_URL =
  'https://script.google.com/a/macros/mz.co.kr/s/AKfycbxL84crJM36plCKcHsz5d0sp_h4Sk21lgTD6chIFk9t42ABggzodjaTIrV5ovWOlpMShA/exec'

function GeneratePage() {
  const totalSteps = generatorSteps.length
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
    openChatPane(GE_DEMO_GENERATOR_URL)
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:gap-10">
      {/* 왼쪽 — 소개 카드 + 시작 버튼. PlaygroundPage와 동일하게 버튼을 누르면 바로 외부 사이트로
          가는 게 아니라 분할 뷰 안내 모달이 먼저 뜬다(SplitViewGuideModal 재사용, URL만 다름). */}
      <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-green">GENERATE</p>
        <GeneratorIntroCard onOpenGuide={() => setGuideOpen(true)} />
        <SplitViewGuideModal
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          agentChatUrl={GE_DEMO_GENERATOR_URL}
          onOpenChat={handleStartChat}
          title="에이전트 만들기를 화면 하단에 고정하는 방법"
          buttonText="에이전트 만들기 시작"
        />
      </aside>

      {/* 오른쪽 — 외부 사이트(영어) 조작 가이드. 프롬프트 복사 대신 스크린샷 + 한국어 설명 중심. */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-primary">
              조작 가이드 · 전체 {totalSteps}단계
            </h2>
            <p className="text-sm text-text-secondary">
              화면 하단(분할 뷰)의 실제 사이트를 조작하면서, 각 단계 설명을 따라가면 됩니다.
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
          {generatorSteps.map((step) => (
            <GeneratorStepCard
              key={step.step}
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

export default GeneratePage
