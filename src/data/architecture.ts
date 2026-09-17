export interface ArchitectureNode {
  name: string
  tag?: string
  description: string
}

export interface ArchitectureLayer {
  id: string
  step: string
  name: string
  nameKo: string
  badge: string
  color: string
  borderColor: string
  glowColor: string
  description: string
  nodes: ArchitectureNode[]
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'sources',
    step: '01',
    name: 'Enterprise Data Sources',
    nameKo: '원천 데이터 수집 계층',
    badge: 'Raw Telemetry & Documents',
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    glowColor: 'rgba(56, 189, 248, 0.2)',
    description:
      'IoT 센서 스트림, 코어뱅킹 거래 원장, ERP·MES 자원 내역, 클라우드 텔레메트리, 현장 수기 전표 등 기업의 모든 원천 데이터를 안전하게 연결합니다.',
    nodes: [
      {
        name: 'IoT / SCADA',
        tag: 'Streaming',
        description: '공장 설비 및 센서의 실시간 가동률·진동·온도 시계열 데이터',
      },
      {
        name: 'Core Banking',
        tag: 'Ledger',
        description: '계좌 거래 원장, 여신 한도 내역 및 DSR 규제 기준 데이터',
      },
      {
        name: 'ERP · MES',
        tag: 'Operations',
        description: '전사 재고 수불부, 생산 지시서, 구매 협력사 단가표',
      },
      {
        name: 'Telemetry',
        tag: 'Infra Logs',
        description: '쿠버네티스 인프라 로그, API 메트릭 및 인시던트 데이터',
      },
      {
        name: 'Scan · OCR',
        tag: 'Unstructured',
        description: '현장 수기 점검표, 외부 감사 보고서, 영수증 원본 이미지',
      },
    ],
  },
  {
    id: 'grounding',
    step: '02',
    name: 'Data Grounding Layer',
    nameKo: '사실 근거(Grounding) 계층',
    badge: 'Zero-Hallucination Anchor',
    color: '#414aff',
    borderColor: 'rgba(65, 74, 255, 0.4)',
    glowColor: 'rgba(65, 74, 255, 0.25)',
    description:
      '빅쿼리 데이터 웨어하우스와 파이어스토어 운영 저장소가 에이전트의 모든 판단에 엄격한 사실 근거를 제공하여 환각을 원천 차단합니다.',
    nodes: [
      {
        name: 'BigQuery',
        tag: 'Analytics DW',
        description: '페타바이트 규모의 정형·반정형 데이터 초고속 SQL 쿼리 및 분석 엔진',
      },
      {
        name: 'Firestore',
        tag: 'Operational Store',
        description: '에이전트 실시간 세션 상태, 대시보드 뷰어 및 A2UI 영속성 저장소',
      },
      {
        name: 'Cloud Storage',
        tag: 'Blob Storage',
        description: '비정형 원본 문서, 전표 고해상도 이미지, 다운로드 가능한 생성 보고서',
      },
      {
        name: 'Data Catalog',
        tag: 'Metadata & Governance',
        description: '테이블 스키마, 컬럼 메타데이터, 부서별 데이터 소유 구조 및 계통 관리',
      },
    ],
  },
  {
    id: 'agent',
    step: '03',
    name: 'Gemini Enterprise Agent Core',
    nameKo: '지능형 오케스트레이션 코어',
    badge: 'Autonomous Multi-Agent Brain',
    color: '#8920ff',
    borderColor: 'rgba(137, 32, 255, 0.45)',
    glowColor: 'rgba(137, 32, 255, 0.28)',
    description:
      '심층 추론, 다단계 실행 계획 수립, 픽셀 단위 멀티모달 비전 판독 및 이전 맥락을 기억하는 세션 메모리를 결합한 의사결정 두뇌 계층입니다.',
    nodes: [
      {
        name: 'Reasoning Core',
        tag: 'Deep Reasoning',
        description: '복합 비즈니스 의사결정 로직 분석 및 부서 간 단절 리스크 적발',
      },
      {
        name: 'Tool Planner',
        tag: 'Execution Plan',
        description: '사용자 목표를 분석해 최적의 데이터 쿼리 및 도구 호출 순서를 자율 편성',
      },
      {
        name: 'Multimodal Vision',
        tag: 'Vision Understanding',
        description: '수기 문서 및 도면의 글자·표·체크박스를 라인 단위로 분해 판독',
      },
      {
        name: 'Session Memory',
        tag: 'Contextual State',
        description: '이전 대화 맥락, 도메인 임계치, 사용자 권한 체계를 일관되게 유지',
      },
    ],
  },
  {
    id: 'tooling',
    step: '04',
    name: 'Tooling & Autonomy Layer',
    nameKo: '자율 실행 도구 계층',
    badge: 'Dynamic Tool Execution',
    color: '#a78bfa',
    borderColor: 'rgba(167, 139, 250, 0.4)',
    glowColor: 'rgba(167, 139, 250, 0.22)',
    description:
      '격리된 백그라운드 샌드박스에서 파이썬 코드를 실행하고, 최신 웹 지식을 탐색하며 일일 배치 스케줄러와 엔터프라이즈 도구를 자율 연동합니다.',
    nodes: [
      {
        name: 'Code Sandbox',
        tag: 'Python Runtime',
        description: '격리된 샌드박스에서 Python 데이터 분석 실행 및 웹앱 자율 코딩',
      },
      {
        name: 'Web Research',
        tag: 'Live Web Grounding',
        description: '실시간 웹 검색을 통해 최신 원자재 시세 및 글로벌 규제 동향 조사',
      },
      {
        name: 'Cron Scheduler',
        tag: 'Automated Operations',
        description: 'Cron 표현식 기반의 매일 정기 스캔, 일일 감사 및 위험 알림 등록',
      },
      {
        name: 'Workspace MCP',
        tag: 'Enterprise Connectors',
        description: '사내 메일, 메신저, 캘린더 등 엔터프라이즈 업무 도구 자율 호출',
      },
    ],
  },
  {
    id: 'delivery',
    step: '05',
    name: 'Governed Delivery Layer',
    nameKo: '통제된 산출물 계층',
    badge: 'Human-Governed Outputs',
    color: '#34ad5c',
    borderColor: 'rgba(52, 173, 92, 0.4)',
    glowColor: 'rgba(52, 173, 92, 0.22)',
    description:
      'HITL(인간 개입 승인) 게이트를 거쳐 검증된 안전한 산출물만 경영진용 인터랙티브 대시보드, 시뮬레이터, 이사회 보고서 형태로 전달됩니다.',
    nodes: [
      {
        name: 'HITL 승인 게이트',
        tag: 'Human Approval',
        description: '고위험 안건·자금 집행·규정 예외 건에 대해 담당자의 최종 결재 강제',
      },
      {
        name: 'Live Dashboard',
        tag: 'Interactive Web',
        description: '채팅 요약이 아닌 브라우저에서 직접 클릭·드릴다운하는 호스팅 대시보드',
      },
      {
        name: 'Simulator App',
        tag: 'What-If Simulation',
        description: '변수 변경에 따른 파급효과와 ROI를 실시간 시뮬레이션하는 독립 웹앱',
      },
      {
        name: 'Board Report',
        tag: 'Executive PDF',
        description: '내부 팩트와 외부 리서치를 융합한 최고경영진·이사회 보고용 완결 문서',
      },
    ],
  },
]
