import type { ComponentType, SVGProps } from 'react'
import {
  BankIcon,
  BroadcastIcon,
  CartIcon,
  CityIcon,
  CloudIcon,
  FactoryIcon,
} from '@/components/icons/DomainIcons'

export type DomainAccent = 'blue' | 'purple' | 'green'

export type Domain = {
  id: string
  nameKo: string
  nameEn: string
  agentName: string
  /** 카드 하단 키워드 칩으로 쪼개지는 짧은 사용 예시 3개, '·'로 구분 */
  example: string
  /** 카드 본문에 들어가는 1~2문장 설명 */
  description: string
  /** 카드에 표시되는 예상 체험 소요시간 — scenarios.ts의 실제 단계 수 기준 */
  duration: string
  accent: DomainAccent
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  /** vertexaisearch.cloud.google.com 에이전트 세션 URL. 'ge-chat-pane' 이름의 split view 하단 탭으로 연다(plan.md Phase 1). */
  agentChatUrl: string
}

const AGENT_BASE_URL =
  'https://vertexaisearch.cloud.google.com/home/cid/2740d298-7401-41ac-bcaa-9f8260bb9d30/r/agent'

export const domains: Domain[] = [
  {
    id: 'manufacturing',
    nameKo: '제조 & 스마트 팩토리',
    nameEn: 'SMART MANUFACTURING',
    agentName: '스마트 팩토리 보전운영 관제사',
    example: '공장 가동률 · 품질 이상 탐지 · 수율 및 공급망 최적화',
    description:
      '설비 이상 마모 진단과 구매·정비 데이터를 교차 대조해 부서 간 데이터 단절이 숨겨온 재무 리스크를 찾아냅니다.',
    duration: '약 8분 · 4단계',
    accent: 'blue',
    Icon: FactoryIcon,
    agentChatUrl: `${AGENT_BASE_URL}/7030209521105256625/session/-`,
  },
  {
    id: 'finance',
    nameKo: '금융 & 리스크',
    nameEn: 'FINANCIAL SERVICES & FINTECH',
    agentName: '금융 플랫폼 총괄 오퍼레이터',
    example: '여신 심사 · 대손충당금 예측 · 금융 규제 준수 및 리스크 분석',
    description:
      '제휴 마케팅 리드와 내부 행동 데이터를 대조해 규제 임계값을 넘는 숨은 리스크 고객을 색출합니다.',
    duration: '약 8분 · 4단계',
    accent: 'purple',
    Icon: BankIcon,
    agentChatUrl: `${AGENT_BASE_URL}/15149955520060260421/session/-`,
  },
  {
    id: 'retail',
    nameKo: '유통 & 공급망',
    nameEn: 'RETAIL & SUPPLY CHAIN',
    agentName: '공급망 총괄 오퍼레이터',
    example: '고객 세그먼트 분석 · 동적 가격 설정 · 재고 시뮬레이션',
    description:
      '현장 수기 검사 기록과 발주 데이터를 대조해 은폐되거나 축소 보고된 협력사 품질 리스크를 적발합니다.',
    duration: '약 6분 · 3단계',
    accent: 'green',
    Icon: CartIcon,
    agentChatUrl: `${AGENT_BASE_URL}/8647000479791572786/session/-`,
  },
  {
    id: 'it-devops',
    nameKo: 'IT & Cloud DevOps',
    nameEn: 'INFRASTRUCTURE & SECURITY',
    agentName: 'Network Ops Operator',
    example: 'Multi-Cloud 비용 최적화 · 보안 위협 탐지 · DevOps 자동화',
    description:
      '현장 작업 일지와 회선 감사 로그를 교차 분석해 내부 기록과 어긋나는 숨은 장애 위협을 찾아냅니다.',
    duration: '약 6분 · 3단계',
    accent: 'blue',
    Icon: CloudIcon,
    agentChatUrl: `${AGENT_BASE_URL}/18239319691174125563/session/-`,
  },
  {
    id: 'media',
    nameKo: '미디어 & 엔터테인먼트',
    nameEn: 'MEDIA & ENTERTAINMENT',
    agentName: '미디어 파이프라인 아키텍트',
    example: '광고 인벤토리 수익률 최적화 · 콘텐츠 개인화 엔진 · 디지털 자산 관리',
    description:
      '외부 감사 보고서와 내부 마스터 DB를 교차 검증해 가장 심각한 잠재적 저작권 분쟁 리스크를 밝혀냅니다.',
    duration: '약 8분 · 4단계',
    accent: 'purple',
    Icon: BroadcastIcon,
    agentChatUrl: `${AGENT_BASE_URL}/9286101942932774160/session/-`,
  },
  {
    id: 'public-sector',
    nameKo: '공공행정 & 스마트시티',
    nameEn: 'PUBLIC & SMART CITY',
    agentName: '스마트민원 행정관',
    example: '공공 서비스 안내 허브 · 디지털 시민 서비스 포털 · 다국어 시민 어시스턴트',
    description:
      '일일 감사 보고서와 접수 원장을 교차 대조해 부서 간 시스템 연계에서 누락된 행정 리스크를 밝혀냅니다.',
    duration: '약 6분 · 3단계',
    accent: 'green',
    Icon: CityIcon,
    agentChatUrl: `${AGENT_BASE_URL}/14660754267048901516/session/-`,
  },
]
