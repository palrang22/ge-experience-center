import { useState } from 'react'
import type { ScenarioStep } from '@/data/scenarios'

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

function AttachmentChip({ domainId, file }: { domainId: string; file: string }) {
  const ext = file.split('.').pop()?.toUpperCase() ?? 'FILE'
  return (
    <a
      href={`/demo-data/${domainId}/${file}`}
      download
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
    >
      <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-primary">
        {ext}
      </span>
      {file}
    </a>
  )
}

type Props = {
  domainId: string
  step: ScenarioStep
  completed: boolean
  onToggleComplete: () => void
}

function ScenarioStepCard({ domainId, step, completed, onToggleComplete }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(step.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard API unavailable — prompt text is still visible for manual copy
    }
  }

  // 상태별 테두리 + 글로우: 완료 = 그린, 펼친 상태 = 블루/퍼플 그라데이션 글로우, 기본 = 중립
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
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-text-primary">{step.title}</h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {step.isWow && (
                <span className="rounded-full bg-gradient-to-r from-brand-purple to-brand-blue px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-white shadow-[0_0_10px_-2px_rgba(137,32,255,0.7)]">
                  WOW
                </span>
              )}
              {step.attachments.length > 0 && (
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-secondary">
                  첨부 파일 {step.attachments.length}개
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {/* 그리드 트랙을 0fr↔1fr로 트랜지션해서 실제 콘텐츠 높이를 몰라도 "슥" 늘어나는 애니메이션을 낸다(원본 사이트 아코디언과 동일한 방식) */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5 border-t border-border/60 p-5 pt-5">
            {/* 프롬프트는 그냥 복사해서 붙여넣는 용도라 일부러 톤을 낮췄다 — 눈에 띄어야 할 건 확인 포인트 */}
            <div className="flex flex-col gap-2 rounded-md border border-border bg-surface-2 p-4">
              <p className="font-mono text-[11px] tracking-[0.1em] text-text-secondary">
                PROMPT · 복사해서 채팅창에 붙여넣기
              </p>
              <p className="font-mono text-sm leading-relaxed text-text-secondary">
                {step.prompt}
              </p>
            </div>

            {/* 확인 포인트 — 실제로 읽고 검증해야 하는 내용이라 가장 눈에 띄게: 밝은 본문색 + 블루→퍼플 라인 강조 */}
            <div className="flex flex-col gap-2 rounded-md border-l-4 border-solid bg-surface-2 p-4 [border-image:linear-gradient(180deg,var(--color-brand-blue),var(--color-brand-purple))_1]">
              <p className="font-mono text-[11px] tracking-[0.1em] text-brand-blue">확인 포인트</p>
              <p className="text-base leading-relaxed text-text-primary">{step.expectedResult}</p>
            </div>

            {step.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {step.attachments.map((file) => (
                  <AttachmentChip key={file} domainId={domainId} file={file} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
              >
                {copied ? '복사됨' : '프롬프트 복사'}
              </button>
              <button
                type="button"
                onClick={onToggleComplete}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
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
    </div>
  )
}

export default ScenarioStepCard
