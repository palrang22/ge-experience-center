import { useState } from 'react'
import { Link } from 'react-router-dom'
import Architecture3DCanvas from '@/components/Architecture3DCanvas'
import { ARCHITECTURE_LAYERS } from '@/data/architecture'

export default function ArchitectureSection() {
  // 3D 뷰 선택 상태: null이면 아무것도 선택되지 않아 모든 그래프에 불이 켜진 기본 상태
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null)

  function handleCardClick(idx: number) {
    // 이미 선택된 카드를 한 번 더 누르면 선택 해제 (그래프 클릭 전 상태로 복귀)
    setSelectedLayerIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.2em] text-brand-purple">
            AI ARCHITECTURE
          </span>
          <span className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-2 py-0.5 font-mono text-[10px] text-brand-purple">
            5-LAYER PIPELINE
          </span>
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          AI는 어떻게 판단하는가
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
          원천 데이터 수집부터 검증된 사실 근거(Grounding), 자율 추론 및 인간 승인(HITL)을 거친
          안전한 산출물까지 — 5개 핵심 계층이 하나의 엔터프라이즈 파이프라인으로 연결됩니다.
        </p>
      </div>

      {/* 3D 인터랙티브 캔버스 뷰 (좌측 3D 노드 그래프 + 우측 레이어 카드) */}
      <div
        onClick={(e) => {
          // 바깥 빈 공간 클릭 시 선택 해제 (모든 그래프 불 켜짐)
          if (e.target === e.currentTarget) {
            setSelectedLayerIndex(null)
          }
        }}
        className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
      >
        {/* 좌측: 3D 인터랙티브 캔버스 (우측 L01~L05 카드와 높이 100% 동일) */}
        <div className="flex h-full min-h-[540px] lg:col-span-7">
          <Architecture3DCanvas
            layers={ARCHITECTURE_LAYERS}
            selectedLayerIndex={selectedLayerIndex}
            onSelectLayer={setSelectedLayerIndex}
          />
        </div>

        {/* 우측: 5단계 레이어 인터랙티브 정보 카드 */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isActive = selectedLayerIndex === idx
            const isOtherActive = selectedLayerIndex !== null && !isActive

            return (
              <div
                key={layer.id}
                onClick={() => handleCardClick(idx)}
                className={`group relative cursor-pointer rounded-xl border bg-surface-1 p-4 transition-all duration-300 ${
                  isOtherActive ? 'opacity-35 hover:opacity-75' : 'opacity-100'
                } ${
                  isActive
                    ? 'translate-x-1.5 shadow-lg'
                    : 'border-border hover:border-border/80 hover:bg-surface-1/90'
                }`}
                style={{
                  borderColor: isActive ? layer.color : undefined,
                  boxShadow: isActive ? `0 0 24px -6px ${layer.glowColor}` : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full shadow-sm"
                      style={{
                        backgroundColor: layer.color,
                        boxShadow: `0 0 10px ${layer.color}`,
                      }}
                    />
                    <h3 className="text-sm font-semibold tracking-tight text-text-primary">
                      {layer.nameKo}
                    </h3>
                  </div>
                  <span className="font-mono text-[11px]" style={{ color: layer.color }}>
                    L{layer.step}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {layer.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {layer.nodes.map((node) => (
                    <span
                      key={node.name}
                      className="rounded-md border border-border/60 bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] text-text-secondary transition-colors group-hover:border-border"
                    >
                      {node.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 하단 엔터프라이즈 거버넌스 원칙 & CTA 배너 */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(52,173,92,0.8)]" />
              <h3 className="text-base font-semibold text-text-primary sm:text-lg">
                엔터프라이즈 AI 신뢰성(Trust) 보장 체계
              </h3>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed text-text-secondary sm:text-sm">
              인터넷 지식에만 의존하는 일반 LLM과 달리, Gemini Enterprise는 내부
              BigQuery·Firestore의 실제 팩트 데이터에 100% Grounding되고 고위험 작업에는 인간
              승인(HITL)을 강제하여 비즈니스 리스크를 원천 차단합니다.
            </p>
          </div>
          <Link
            to="/experience"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>도메인 에이전트 체험하기</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
