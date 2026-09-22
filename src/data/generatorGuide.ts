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
    title: '회사 도메인 입력 및 리서치',
    images: ['/demo-generator-guide/demo-generator-1.png'],
    desc: "빨갛게 표시된 'CUSTOMER DOMAIN' 입력창에 소개하고 싶은 회사의 도메인(예: example.co.kr)을 입력하고, Auto로 되어 있는 선택창에서 '한국어'를 찾아서 바꿔준 후 RESEARCH 버튼을 누르세요.\n\n아래 'Pick from Gallery'에서 미리 준비된 업종 템플릿을 골라도 됩니다.",
  },
  {
    step: 2,
    title: '자동화 워크플로우 선택 및 시나리오 생성',
    images: [
      '/demo-generator-guide/demo-generator-2.png',
    ],
    desc: "입력한 도메인에 대한 간단한 구글 리서치가 진행됩니다. 해당 내용을 읽어본 후, 다음 목록에서 데모로 보여주고 싶은 업무 워크플로우를 체크한 뒤 'APPLY SELECTED WORKFLOWS'를 누르세요.",
  },
  {
    step: 3,
    title: '자동화 워크플로우 선택 및 시나리오 생성',
    images: [
      '/demo-generator-guide/demo-generator-3.png',
    ],
    desc: "선택한 워크플로우를 반영한 비즈니스 시나리오 초안을 읽어본 후, 'GENERATE SETUP SCRIPT & ASSETS' 버튼을 눌러 스크립트와 에샛 생성을 시작하세요. 팝업창이 뜨면 버튼을 한 번 더 눌러 진행을 확인합니다.",
  },
  {
    step: 4,
    title: '스크립트 및 관련 에샛 생성중 화면 확인',
    images: ['/demo-generator-guide/demo-generator-4.png'],
    desc: '회사에 맞는 가상 고객·설비·인력 데이터와 스크립트가 실시간 로그와 함께 자동 생성됩니다.\n3~4분 정도 소요됩니다.',
  },
  {
    step: 5,
    title: '생성된 스크립트 확인 및 활용',
    images: [
      '/demo-generator-guide/demo-generator-9.png',
      '/demo-generator-guide/demo-generator-10.png',
    ],
    desc: "생성이 완료되면 스크롤을 내려 STEP 4를 바로 확인하세요.\n'EXTERNAL DOMAIN FILES'에서는 생성된 PDF·엑셀·이미지 첨부파일을 다운로드 할 수 있습니다. 이 파일들은 잠시 뒤 에이전트 채팅에서 직접 업로드해 사용합니다.\n그 아래 'RECOMMENDED DEMO FLOW'에는 이 회사 전용으로 맞춤 생성된 프롬프트가 준비되어 있습니다.",
  },
]
