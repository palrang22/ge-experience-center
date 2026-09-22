import { useState } from 'react'
import type { GeneratorStep } from '@/data/generatorGuide'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function CheckIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  )
}

type Props = {
  step: GeneratorStep
  completed: boolean
  onToggleComplete: () => void
}

// ScenarioStepCard와 시각 구조(상태별 테두리/글로우, 아코디언, 완료 체크)를 공유하되,
// 콘텐츠는 프롬프트/첨부파일이 아니라 "외부 사이트 조작 가이드"(스크린샷 + 한국어 설명)다.
function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|'[^']+')/g)
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-text-primary">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith("'") && token.endsWith("'")) {
      return (
        <kbd
          key={i}
          className="mx-1 inline-flex items-center rounded-md border border-sky-400/50 bg-sky-500/15 px-2 py-0.5 font-mono text-[13px] font-bold tracking-wide text-sky-200 shadow-[0_0_10px_-2px_rgba(56,189,248,0.35)]"
        >
          {token.slice(1, -1)}
        </kbd>
      )
    }
    return token
  })
}

function GuideDesc({ desc }: { desc: string }) {
  const lines = desc.split('\n').filter((line) => line.trim().length > 0)

  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim()

        const numMatch = trimmed.match(/^(\d+)\.\s*(.+)$/)
        if (numMatch) {
          const [, num, content] = numMatch
          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-border/70 bg-surface-2/80 p-3.5 transition-colors hover:border-brand-blue/40"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-brand-blue to-brand-purple font-mono text-xs font-bold text-white shadow-[0_0_8px_-1px_rgba(65,74,255,0.5)]">
                {num}
              </span>
              <p className="flex-1 text-[15px] leading-relaxed text-text-primary">
                {renderInline(content)}
              </p>
            </div>
          )
        }

        if (trimmed.startsWith('💡') || trimmed.startsWith('팁:')) {
          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-brand-green/30 bg-brand-green/10 p-3.5"
            >
              <span className="shrink-0 text-base">💡</span>
              <div className="flex-1 text-sm leading-relaxed text-text-primary">
                {renderInline(trimmed.replace(/^(💡|팁:?)\s*/, ''))}
              </div>
            </div>
          )
        }

        if (trimmed.startsWith('⏱️') || trimmed.includes('소요 시간')) {
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-3.5 py-2.5"
            >
              <span className="text-base">⏱️</span>
              <span className="text-sm font-medium text-text-primary">
                {renderInline(trimmed.replace(/^⏱️\s*/, ''))}
              </span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-[15px] leading-relaxed text-text-primary">
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function GeneratorStepCard({ step, completed, onToggleComplete }: Props) {
  const [open, setOpen] = useState(false)

  const borderClass = completed
    ? 'border-brand-green/60 shadow-[0_0_28px_-10px_rgba(52,173,92,0.65)]'
    : open
      ? 'border-transparent shadow-[0_0_28px_-8px_rgba(65,74,255,0.55)] [background:linear-gradient(var(--color-surface-1),var(--color-surface-1))_padding-box,linear-gradient(135deg,var(--color-brand-blue),var(--color-brand-purple))_border-box] border-2'
      : 'border-border'

  return (
    <div className={`flex flex-col rounded-xl border bg-surface-1 transition-all ${borderClass}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs ${
              completed
                ? 'bg-gradient-to-br from-brand-green to-brand-blue text-white shadow-[0_0_12px_-2px_rgba(52,173,92,0.8)]'
                : open
                  ? 'bg-gradient-to-br from-brand-blue to-brand-purple text-white shadow-[0_0_12px_-2px_rgba(65,74,255,0.8)]'
                  : 'border border-border text-text-secondary'
            }`}
          >
            {completed ? <CheckIcon className="h-4 w-4" /> : String(step.step).padStart(2, '0')}
          </span>
          <h3 className="text-base font-semibold text-text-primary">{step.title}</h3>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5 border-t border-border/60 p-5 pt-5">
            <div className="flex flex-col gap-4">
              {step.images.map((image, idx) => (
                <div
                  key={`${image}-${idx}`}
                  className="overflow-hidden rounded-md border border-border bg-surface-2"
                >
                  <img src={image} alt={`${step.title} ${idx + 1}`} className="w-full" />
                </div>
              ))}
            </div>

            <GuideDesc desc={step.desc} />

            {step.watch ? (
              <div className="flex flex-col gap-2 rounded-md border-l-4 border-solid bg-surface-2 p-4 [border-image:linear-gradient(180deg,var(--color-brand-blue),var(--color-brand-purple))_1]">
                <p className="font-mono text-[11px] tracking-[0.1em] text-brand-blue">
                  확인 포인트
                </p>
                <p className="text-base leading-relaxed text-text-primary">{step.watch}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onToggleComplete}
              className={`inline-flex w-fit items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                completed
                  ? 'bg-gradient-to-r from-brand-green to-brand-blue text-white shadow-[0_0_16px_-4px_rgba(52,173,92,0.7)]'
                  : 'border border-border text-text-secondary hover:border-brand-green hover:text-brand-green'
              }`}
            >
              <CheckIcon className="h-3.5 w-3.5" />
              {completed ? '완료됨' : '완료 체크'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratorStepCard
