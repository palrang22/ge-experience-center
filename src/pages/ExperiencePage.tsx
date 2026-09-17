import { useRef } from 'react'
import DomainCard from '@/components/DomainCard'
import { domains } from '@/data/domains'

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-1 p-6">
      <span className="font-mono text-sm text-text-secondary">{number}</span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary">{desc}</p>
    </div>
  )
}

function ExperiencePage() {
  const railRef = useRef<HTMLDivElement>(null)

  function scrollRail(direction: 1 | -1) {
    railRef.current?.scrollBy({ left: direction * 420, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="flex flex-col gap-6">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-green">
          01 · HOW TO EXPERIENCE
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <Step number="01" title="도메인 선택" desc="관심 있는 산업의 에이전트를 고릅니다." />
          <Step
            number="02"
            title="프롬프트 실행"
            desc="복사한 프롬프트를 하단 채팅창에 붙여넣습니다."
          />
          <Step
            number="03"
            title="결과 확인"
            desc="확인 포인트에 맞춰 에이전트의 실제 응답을 확인합니다."
          />
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-border/60 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="font-mono text-xs tracking-[0.2em] text-brand-blue">02 · DOMAINS</p>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              6개 산업 도메인
            </h1>
            <p className="text-text-secondary">
              6개 산업 도메인의 에이전트를 체험할 수 있습니다. 카드를 선택하면 해당 에이전트의
              데모로 이동합니다.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              aria-label="이전 도메인"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              aria-label="다음 도메인"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              ›
            </button>
          </div>
        </div>
        {/* 원본 사이트(#domains)처럼 가로 스크롤 캐러셀 — 카드는 고정폭, 화면이 넓어져도 늘어나지 않고 옆으로 더 보인다. */}
        {/* 스크롤바는 no-scrollbar로 숨김(스크롤 자체는 유지). overflow-x-auto를 걸면 overflow-y도 자동으로 clip되므로,
            카드가 호버 시 위로 떠오르는 것(translateY -8px)과 글로우가 잘리지 않도록 위/아래에 여유 패딩을 둔다. */}
        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-6"
        >
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ExperiencePage
