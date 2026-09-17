import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// docs/design/hero-ref.png의 4방향 뾰족한 유리 스파클. 실루엣은 극좌표 공식
// r(θ) = innerR + (outerR-innerR) * |cos(2θ)|^power 로 만들고(숫자 하나로 뾰족함/허리 깊이 조절),
// ExtrudeGeometry(평평한 판)를 쓰는 대신 중심이 볼록하고 가장자리로 갈수록 얇아지는 쿠션형
// 곡면을 위/아래 두 장 만들어 맞붙였다 — 레퍼런스처럼 도톰하게 부푼 유리 덩어리 느낌을 내기 위해서다.
// z 프로파일은 cos(uπ/2)의 제곱을 쓴다 — 그냥 cos만 쓰면 가장자리(u=1)에서 기울기가 0이 아니라
// 위/아래 두 장이 뾰족한 능선으로 만난다. 제곱을 취하면 u=1에서 기울기가 정확히 0이 돼서
// 두 장이 수평 접선으로 매끄럽게 이어진다(렌즈 단면처럼).
function useSparkleGeometry() {
  return useMemo(() => {
    const radial = 400
    const rings = 100
    const outerR = 3
    const innerR = 2.1
    const power = 2
    const bulge = 1.2

    const rAt = (theta: number) => innerR + (outerR - innerR) * Math.abs(Math.cos(2 * theta)) ** power

    const pos: number[] = []
    const idx: number[] = []
    let base = 0

    for (const sign of [1, -1]) {
      const start = base
      for (let j = 0; j <= rings; j += 1) {
        const u = j / rings
        for (let i = 0; i < radial; i += 1) {
          if (j === 0) {
            pos.push(0, 0, sign * bulge)
          } else {
            const theta = (i / radial) * Math.PI * 2
            const r = rAt(theta) * u
            const z = sign * bulge * Math.cos((u * Math.PI) / 2) ** 2
            pos.push(r * Math.cos(theta), r * Math.sin(theta), z)
          }
        }
      }
      for (let j = 0; j < rings; j += 1) {
        for (let i = 0; i < radial; i += 1) {
          const a = start + j * radial + i
          const b = start + j * radial + ((i + 1) % radial)
          const c = start + (j + 1) * radial + i
          const d = start + (j + 1) * radial + ((i + 1) % radial)
          if (sign > 0) idx.push(a, c, b, b, c, d)
          else idx.push(a, b, c, b, d, c)
        }
      }
      base += (rings + 1) * radial
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geometry.setIndex(idx)
    geometry.computeVertexNormals()
    geometry.center()
    return geometry
  }, [])
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function Sparkle() {
  const geometry = useSparkleGeometry()
  const meshRef = useRef<THREE.Mesh>(null)
  const axis = useMemo(() => new THREE.Vector3(1, 1, 0).normalize(), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return
    meshRef.current.rotateOnWorldAxis(axis, delta * 0.16)
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.35, 0.5, 0]}>
      <meshPhysicalMaterial
        transmission={0.5} // 뒤가 비치되 완전 유리는 아님
        thickness={1.0}
        roughness={0.15} // 0이 아니라 살짝 줌 — 플라스틱은 유리만큼 매끈 안 함
        ior={1}
        transparent
        opacity={0.7} // 반투명 플라스틱 질감
        iridescence={0} // 무지개 원하면 유지, 싫으면 0
        iridescenceIOR={1}
        iridescenceThicknessRange={[100, 400]}
        clearcoat={0.2}
        clearcoatRoughness={0.1} // 표면에 얇은 코팅 광 — 플라스틱 느낌의 핵심
        color="#231a38"
      />
    </mesh>
  )
}

// 사이트 브랜드 3색(블루/퍼플/그린)을 큐브맵 라이트로 사방에 배치해서, 반투명 표면 반사에
// 은은하게 비치게 한다(제미나이 4색 대신 우리 팔레트로 교체). frames=1로 한 번만 구워서
// 매 프레임 다시 렌더링하지 않게 해 키오스크 성능 부담을 줄인다.
function ColorEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <group>
        <Lightformer form="rect" intensity={2.4} color="#414AFF" position={[0, 3.2, -2]} scale={[4, 3, 1]} />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#8920FF"
          position={[3.2, -1.5, -2]}
          scale={[3.5, 3.5, 1]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#34AD5C"
          position={[-3.2, -1.5, -2]}
          scale={[3.5, 3.5, 1]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* 은은한 흰색 채움광 — 유리질 하이라이트용 */}
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, 6]} scale={8} />
      </group>
    </Environment>
  )
}

function HeroGlassSparkle({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`hero-sparkle-scene ${className}`.trim()}>
      <Canvas
        camera={{ position: [0, 0, 17], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.15} />
        <ColorEnvironment />
        <Sparkle />
      </Canvas>
    </div>
  )
}

export default HeroGlassSparkle
