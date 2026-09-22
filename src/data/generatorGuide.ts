/**
 * "에이전트 만들기"(/generate) 화면의 우측 가이드 콘텐츠.
 * 외부 GE Demo Generator(Google Apps Script 웹앱) 원본 흐름은 10단계지만,
 * 프로젝트 원칙("가장 임팩트 있는 단계만 남겨 3~4단계로 압축")에 맞춰 4단계로 재구성했다.
 * 스크린샷 원본은 public/demo-generator-guide/demo-generator-1.png ~ -10.png(전체 10장, 실제 캡처).
 * 콘텐츠가 바뀌면 CLAUDE.md의 "신규 기능 — 에이전트 만들기" 섹션도 함께 갱신할 것.
 */

export type GeneratorStep = {
  step: number
  title: string
  /** public/demo-generator-guide/ 아래 스크린샷 경로. 단계당 1~2장. */
  images: string[]
  desc: string
  /** 확인 포인트. 사용자가 직접 작성 예정 — 값이 있는 단계만 카드에 표시된다. */
  watch?: string
}

export const generatorSteps: GeneratorStep[] = [
  {
    step: 1,
    title: '1. 회사 도메인 입력 및 리서치',
    images: ['/demo-generator-guide/demo-generator-1.png'],
    desc: `1. 빨갛게 표시된 'CUSTOMER DOMAIN' 입력창에 소개하고 싶은 회사의 도메인(예: example.co.kr)을 입력하세요.
2. 'Auto'로 되어 있는 언어 선택창을 클릭하여 '한국어'로 변경해 주세요.
3. 'RESEARCH' 버튼을 누르면 구글 기반 기업 리서치가 시작됩니다.

💡 팁: 도메인이 바로 떠오르지 않는다면 아래 'Pick from Gallery'에서 미리 준비된 업종 템플릿을 선택해도 좋습니다.`,
  },
  {
    step: 2,
    title: '2. 리서치 결과 확인 및 워크플로우 선택',
    images: ['/demo-generator-guide/demo-generator-2.png'],
    desc: `1. 입력한 도메인에 대해 자동으로 정리된 **구글 리서치 요약 결과**를 확인합니다.
2. 'AGENT-AUTOMATABLE WORKFLOWS' 목록에서 데모로 시연하고 싶은 업무 워크플로우를 체크하세요.
3. 선택 후 'APPLY SELECTED WORKFLOWS' 버튼을 눌러 다음 단계로 진행합니다.`,
  },
  {
    step: 3,
    title: '3. 비즈니스 시나리오 확인 및 스크립트 생성 시작',
    images: ['/demo-generator-guide/demo-generator-3.png'],
    desc: `1. 선택한 워크플로우가 반영된 **비즈니스 시나리오 초안**을 확인하세요.
2. 'GENERATE SETUP SCRIPT & ASSETS' 버튼을 눌러 스크립트 및 데이터 생성을 시작하세요.
3. 팝업창이 나타나면 진행 확인 버튼을 한 번 더 눌러 최종 승인합니다.`,
  },
  {
    step: 4,
    title: '4. 스크립트 및 관련 에셋 생성 진행 확인',
    images: ['/demo-generator-guide/demo-generator-4.png'],
    desc: `회사에 맞춤화된 가상 고객·설비·인력 데이터와 배포 스크립트(.sh)가 실시간 로그와 함께 자동 생성됩니다.

⏱️ 예상 소요 시간: 약 3~4분 (완료될 때까지 잠시 화면을 지켜봐 주세요)`,
  },
  {
    step: 5,
    title: '5. 생성된 스크립트 확인 및 데모 프롬프트 실행',
    images: [
      '/demo-generator-guide/demo-generator-9.png',
      '/demo-generator-guide/demo-generator-10.png',
    ],
    desc: `1. 생성이 완료되면 화면을 아래로 스크롤하여 'STEP 4' 영역으로 이동하세요.
2. 'EXTERNAL DOMAIN FILES'에서 생성된 첨부파일(PDF·엑셀·이미지)를 확인할 수 있습니다.
3. 'RECOMMENDED DEMO FLOW'에서는 맞춤 생성된 프롬프트를 확인해볼 수 있습니다. 에이전트와 대화를 시작해 보세요!`,
  },
]
