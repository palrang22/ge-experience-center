import { useEffect, useRef, useState } from 'react'
import type { ArchitectureLayer } from '@/data/architecture'

interface Architecture3DCanvasProps {
  layers: ArchitectureLayer[]
  selectedLayerIndex: number | null
  onSelectLayer: (layerIndex: number | null) => void
}

interface Node3D {
  x: number
  y: number
  z: number
  label: string
  layer: number
  core: boolean
  col: string
}

interface Edge3D {
  ia: number
  ib: number
  phase: number
}

function project(
  p: { x: number; y: number; z: number },
  rx: number,
  ry: number,
  w: number,
  h: number,
  fov: number,
  dist: number,
) {
  const cy = Math.cos(ry)
  const sy = Math.sin(ry)
  const cx = Math.cos(rx)
  const sx = Math.sin(rx)

  const x1 = p.x * cy - p.z * sy
  let z1 = p.x * sy + p.z * cy
  const y1 = p.y * cx - z1 * sx
  z1 = p.y * sx + z1 * cx

  const s = fov / (fov + z1 + dist)
  return { x: w / 2 + x1 * s, y: h / 2 + y1 * s, s, z: z1 }
}

export default function Architecture3DCanvas({
  layers,
  selectedLayerIndex,
  onSelectLayer,
}: Architecture3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)

  // 뷰 회전 각도 및 상태 참조
  const viewRef = useRef({
    rx: -0.32,
    ry: 0.6,
    trx: -0.32,
    try_: 0.6,
    auto: true,
    focus: -1,
  })

  // selectedLayerIndex 동기화
  useEffect(() => {
    viewRef.current.focus = selectedLayerIndex ?? -1
  }, [selectedLayerIndex])

  // autoRotate 동기화
  useEffect(() => {
    viewRef.current.auto = autoRotate
  }, [autoRotate])

  const handleReset = () => {
    viewRef.current.trx = -0.32
    viewRef.current.try_ = 0.6
    viewRef.current.auto = true
    setAutoRotate(true)
    onSelectLayer(null)
  }

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return

    const ctx = cv.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // HiDPI 대응 리사이즈
    let width = cv.clientWidth || 600
    let height = cv.clientHeight || 560

    const fit = () => {
      const rect = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      cv.width = Math.max(1, Math.round(rect.width * dpr))
      cv.height = Math.max(1, Math.round(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    fit()
    const ro = new ResizeObserver(() => fit())
    ro.observe(cv)

    // 3D 노드 구성 (Y축으로 쌓고, 각 레이어 노드를 원형 배치)
    const nodes: Node3D[] = []
    const SPAN = 140
    const RING = 180

    layers.forEach((layer, li) => {
      const y = (li - (layers.length - 1) / 2) * SPAN
      const core = li === 2 // Gemini Enterprise Core는 중앙 코어 반경
      const radius = core ? 88 : RING
      const count = layer.nodes.length

      layer.nodes.forEach((node, ni) => {
        const angle = (ni / count) * Math.PI * 2 + li * 0.55
        nodes.push({
          x: Math.cos(angle) * radius,
          y,
          z: Math.sin(angle) * radius,
          label: node.name,
          layer: li,
          core,
          col: layer.color,
        })
      })
    })

    // 인접 레이어 간 엣지 연결 (브레이드 구조)
    const edges: Edge3D[] = []
    for (let li = 0; li < layers.length - 1; li++) {
      const a: number[] = []
      const b: number[] = []
      nodes.forEach((n, i) => {
        if (n.layer === li) a.push(i)
        else if (n.layer === li + 1) b.push(i)
      })

      a.forEach((ia, k) => {
        const targetA = b[k % b.length]
        const targetB = b[(k + 1) % b.length]
        if (targetA !== undefined) edges.push({ ia, ib: targetA, phase: Math.random() })
        if (targetB !== undefined && targetB !== targetA) {
          edges.push({ ia, ib: targetB, phase: Math.random() })
        }
      })
    }

    let dragging = false
    let lastX = 0
    let lastY = 0
    let startDownX = 0
    let startDownY = 0
    let hasMoved = false
    let hoverIdx = -1
    let t = 0
    let animId: number

    let lastProjected: { x: number; y: number; s: number; z: number }[] = []

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      hasMoved = false
      startDownX = e.clientX
      startDownY = e.clientY
      viewRef.current.auto = false
      setAutoRotate(false)
      lastX = e.clientX
      lastY = e.clientY
      cv.setPointerCapture(e.pointerId)
    }

    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      try {
        cv.releasePointerCapture(e.pointerId)
      } catch {
        // 이미 릴리즈된 경우 무시
      }

      // 드래그가 아닌 단순 클릭인 경우: 노드 선택 또는 빈 영역 클릭으로 선택 해제
      if (!hasMoved) {
        if (hoverIdx >= 0) {
          const clickedLayer = nodes[hoverIdx].layer
          // 이미 선택된 레이어를 한 번 더 클릭하면 선택 해제, 아니면 해당 레이어 선택
          onSelectLayer(viewRef.current.focus === clickedLayer ? null : clickedLayer)
        } else {
          // 노드가 아닌 캔버스 빈 영역(바깥부분) 클릭 시 선택 해제 (모든 그래프 불 켜짐)
          onSelectLayer(null)
        }
      }
    }

    const onPointerLeave = () => {
      dragging = false
      hoverIdx = -1
    }

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        if (!hasMoved && Math.hypot(e.clientX - startDownX, e.clientY - startDownY) > 5) {
          hasMoved = true
        }
        viewRef.current.try_ += (e.clientX - lastX) * 0.007
        viewRef.current.trx += (e.clientY - lastY) * 0.005
        viewRef.current.trx = Math.max(-1.1, Math.min(1.1, viewRef.current.trx))
        lastX = e.clientX
        lastY = e.clientY
        return
      }

      const rect = cv.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      hoverIdx = -1
      let best = 24
      lastProjected.forEach((p, i) => {
        const d = Math.hypot(p.x - mx, p.y - my)
        if (d < best) {
          best = d
          hoverIdx = i
        }
      })

      cv.style.cursor = hoverIdx >= 0 ? 'pointer' : 'grab'
    }

    cv.addEventListener('pointerdown', onPointerDown)
    cv.addEventListener('pointerup', onPointerUp)
    cv.addEventListener('pointerleave', onPointerLeave)
    cv.addEventListener('pointermove', onPointerMove)

    const renderFrame = () => {
      const v = viewRef.current
      t += 1

      if (v.auto && !prefersReducedMotion) {
        v.try_ += 0.0022
      }
      v.rx += (v.trx - v.rx) * 0.09
      v.ry += (v.try_ - v.ry) * 0.09

      ctx.clearRect(0, 0, width, height)

      const scale = Math.min(width / 680, height / 580)
      const fov = 1100
      const dist = 500

      const proj = nodes.map((n) =>
        project(
          { x: n.x * scale, y: n.y * scale, z: n.z * scale },
          v.rx,
          v.ry,
          width,
          height,
          fov,
          dist,
        ),
      )
      lastProjected = proj

      // 1) 엣지(연결선) 및 데이터 펄스 렌더링
      edges.forEach((e) => {
        const pa = proj[e.ia]
        const pb = proj[e.ib]
        const nodeA = nodes[e.ia]
        const nodeB = nodes[e.ib]

        const isDimmed = v.focus >= 0 && nodeA.layer !== v.focus && nodeB.layer !== v.focus
        const isHighlighted = v.focus >= 0 && (nodeA.layer === v.focus || nodeB.layer === v.focus)

        if (isHighlighted) {
          // 선택했을 때의 선 투명도: 기존 1.0(불투명)에서 은은하고 부드러운 0.32 투명도로 완화
          ctx.globalAlpha = 0.32 * Math.min(1.2, Math.max(0.6, pa.s))
          ctx.strokeStyle = nodeA.col
          ctx.lineWidth = 1.0
        } else if (isDimmed) {
          ctx.globalAlpha = 0.035
          ctx.strokeStyle = 'rgba(125, 211, 252, 1)'
          ctx.lineWidth = 0.6
        } else {
          // 아무것도 선택되지 않았을 때 (기본 상태 - 모든 그래프 불 켜짐)
          ctx.globalAlpha = 0.22 * Math.min(pa.s, pb.s) * 1.2
          ctx.strokeStyle = 'rgba(125, 211, 252, 1)'
          ctx.lineWidth = 0.75
        }

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
        ctx.globalAlpha = 1

        // 펄스 광원 이동
        if (!prefersReducedMotion && !isDimmed) {
          const u = (t * 0.0055 + e.phase) % 1
          const px = pa.x + (pb.x - pa.x) * u
          const py = pa.y + (pb.y - pa.y) * u
          const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 7)
          pulseGlow.addColorStop(0, 'rgba(0, 229, 255, 0.85)')
          pulseGlow.addColorStop(1, 'rgba(0, 229, 255, 0)')

          ctx.fillStyle = pulseGlow
          ctx.beginPath()
          ctx.arc(px, py, 7, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // 2) 노드 (Z-축 깊이 역순 정렬)
      const order = proj.map((p, i) => ({ i, z: p.z })).sort((a, b) => b.z - a.z)

      order.forEach(({ i }) => {
        const p = proj[i]
        const n = nodes[i]
        const isDimmed = v.focus >= 0 && n.layer !== v.focus
        const isHover = hoverIdx === i
        const isLayerFocused = v.focus === n.layer

        const radius = (n.core ? 8.5 : 6.5) * p.s * (isHover ? 1.4 : 1)

        // 외곽 글로우
        const glowRadius = radius * (isLayerFocused || isHover ? 4.5 : 3.5)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
        g.addColorStop(0, n.col)
        g.addColorStop(0.32, `${n.col}66`)
        g.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.globalAlpha = isDimmed ? 0.15 : 0.95
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // 중앙 화이트 코어
        ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.3)' : '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 0.45, 0, Math.PI * 2)
        ctx.fill()

        // 텍스트 라벨 (앞쪽 노드 또는 호버 노드)
        if (!isDimmed && (isHover || p.z < 0)) {
          ctx.globalAlpha = isHover ? 1 : Math.min(1, (p.s - 0.45) * 3)
          ctx.font = `${isHover ? 600 : 500} ${Math.round(11 * Math.max(0.85, p.s))}px Pretendard, sans-serif`
          ctx.fillStyle = isHover ? '#ffffff' : 'rgba(215, 230, 255, 0.85)'
          ctx.textAlign = 'center'
          ctx.fillText(n.label, p.x, p.y - radius * 2.2)
        }
        ctx.globalAlpha = 1
      })

      // 3) 좌측 레이어 가이드 텍스트
      layers.forEach((layer, li) => {
        const y = (li - (layers.length - 1) / 2) * SPAN * scale
        const p = project({ x: -300 * scale, y, z: 0 }, v.rx, v.ry, width, height, fov, dist)
        const isLayerFocused = v.focus === li
        const isOtherFocused = v.focus >= 0 && !isLayerFocused

        ctx.globalAlpha = isOtherFocused ? 0.2 : isLayerFocused ? 1 : 0.75
        ctx.font = `600 ${Math.round(11 * Math.max(0.85, p.s))}px Pretendard, sans-serif`
        ctx.fillStyle = layer.color
        ctx.textAlign = 'right'
        ctx.fillText(`L${layer.step} · ${layer.nameKo}`, p.x, p.y)
        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(renderFrame)
    }

    animId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      cv.removeEventListener('pointerdown', onPointerDown)
      cv.removeEventListener('pointerup', onPointerUp)
      cv.removeEventListener('pointerleave', onPointerLeave)
      cv.removeEventListener('pointermove', onPointerMove)
    }
  }, [layers, onSelectLayer])

  return (
    <div className="relative flex h-full min-h-[540px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface-1/90 via-surface-0 to-surface-1/80 shadow-2xl backdrop-blur-md">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {/* 상단 컨트롤 버튼 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all backdrop-blur-md ${
            autoRotate
              ? 'border-brand-blue/60 bg-brand-blue/20 text-brand-blue shadow-[0_0_12px_rgba(65,74,255,0.4)]'
              : 'border-border bg-surface-1/80 text-text-secondary hover:text-text-primary'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${autoRotate ? 'bg-brand-blue animate-pulse' : 'bg-text-secondary'}`}
          />
          <span>자동 회전</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-border bg-surface-1/80 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-text-secondary/50 hover:text-text-primary backdrop-blur-md"
        >
          시점 초기화
        </button>
      </div>

      {/* 좌측 하단 조작 안내 */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-border/40 bg-surface-0/70 px-3 py-1.5 backdrop-blur-md">
        <svg
          className="h-3.5 w-3.5 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
        <span className="font-mono text-[11px] tracking-wider text-text-secondary uppercase">
          Drag to rotate · Click node or card to focus · Click outside to reset
        </span>
      </div>
    </div>
  )
}
