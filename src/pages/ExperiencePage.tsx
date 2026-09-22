import DomainCard from '@/components/DomainCard'
import { domains } from '@/data/domains'

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-border bg-surface-1 p-5 text-center transition-colors hover:border-brand-green/40">
      <span className="rounded-full border border-brand-green/30 bg-brand-green/10 px-2.5 py-0.5 font-mono text-xs text-brand-green">
        STEP {number}
      </span>
      <h3 className="text-base font-semibold text-text-primary sm:text-lg">{title}</h3>
      <p className="text-sm text-text-secondary">{desc}</p>
    </div>
  )
}

function ExperiencePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-8 py-16 sm:px-12 md:px-16">
      {/* 01 · 상단 가이드: 가운데 정렬 & 세로 적층 배치 */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-xs tracking-[0.2em] text-brand-green">
            01 · HOW TO EXPERIENCE
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            에이전트 체험 방법
          </h2>
          <p className="max-w-md text-sm text-text-secondary">
            간단한 3단계를 통해 엔터프라이즈 AI 에이전트를 직접 경험해보세요.
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-4">
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

      {/* 02 · 하단 도메인 데모: 가로 2개씩 3줄(2x3 그리드) 배치 */}
      <section className="flex flex-col items-center gap-8 border-t border-border/60 pt-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-xs tracking-[0.2em] text-brand-blue">02 · DOMAINS</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            6개 산업 도메인
          </h1>
          <p className="max-w-md text-sm text-text-secondary">
            카드를 선택하면 해당 에이전트의 데모로 이동합니다.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 text-left sm:gap-6">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ExperiencePage
