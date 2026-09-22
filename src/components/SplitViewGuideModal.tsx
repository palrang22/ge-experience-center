import { useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'

type Step = { image: string; alt: string; desc: string }

const STEPS: Step[] = [
  {
    image: '/splitview-guide/splitview-guide-1.png',
    alt: '우클릭 메뉴에서 분할 뷰에서 링크 열기 선택',
    desc: "아래 버튼을 마우스 우클릭하면 나오는 메뉴에서 '분할 뷰에서 링크 열기'를 선택하세요.",
  },
  {
    image: '/splitview-guide/splitview-guide-2.png',
    alt: '분할 아이콘에서 스택형으로 표시 선택',
    desc: "주소창 왼쪽의 분할 아이콘을 눌러 '스택형으로 표시'를 선택하세요.",
  },
  {
    image: '/splitview-guide/splitview-guide-3.png',
    alt: '닫기를 누르고 오른쪽 가이드 1번부터 진행',
    desc: '이 안내창을 닫고, 오른쪽 가이드의 1번부터 진행해주세요.',
  },
]

function SplitViewGuideModal({
  open,
  onClose,
  agentChatUrl,
  onOpenChat,
}: {
  open: boolean
  onClose: () => void
  agentChatUrl: string
  onOpenChat: () => void
}) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    // 좌클릭으로 그냥 눌러도 동작은 하게(재사용 창 열기) — 우클릭 "분할 뷰에서 링크 열기"가 진짜 목적.
    event.preventDefault()
    onOpenChat()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-4xl max-h-[92vh] flex-col rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-4 sm:p-5 shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">
            채팅을 화면 하단에 고정하는 방법
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.image} className="flex flex-col gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2 p-3">
                  <img src={step.image} alt={step.alt} className="h-36 sm:h-44 md:h-48 w-auto" />
                </div>
                <p className="text-sm sm:text-base text-text-secondary">
                  <span className="font-mono text-text-primary">{index + 1}.</span> {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border/60 p-4 sm:p-5 shrink-0 bg-surface-1">
          <p className="text-xs sm:text-sm text-text-secondary">
            아래 버튼을 우클릭해 <span className="text-text-primary font-medium">'분할 뷰에서 링크 열기'</span>
            를 클릭하세요.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-full border border-border text-xs sm:text-sm font-medium text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
            >
              닫기
            </button>
            <a
              href={agentChatUrl}
              onClick={handleLinkClick}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_0_16px_-4px_rgba(65,74,255,0.5)] transition-opacity hover:opacity-90"
            >
              에이전트 채팅 시작
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SplitViewGuideModal
