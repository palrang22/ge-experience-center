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
  watch: string
}

export const generatorSteps: GeneratorStep[] = [
  {
    step: 1,
    title: '회사 도메인 입력 및 리서치',
    images: ['/demo-generator-guide/demo-generator-1.png'],
    desc: "화면 상단 'CUSTOMER DOMAIN' 입력창에 소개하고 싶은 회사의 도메인(예: example.co.kr)을 입력하고 RESEARCH 버튼을 누르세요. 잘 모르겠다면 아래 'Pick from Gallery'에서 미리 준비된 업종 템플릿을 골라도 됩니다. TARGET PERSONA는 기본값(Auto)을 그대로 두면 AI가 적합한 담당자 역할을 알아서 골라줍니다.",
    watch: '리서치가 끝나면 회사 프로필과 예상 업무 과제(Business Challenges)가 자동으로 정리되어 나타납니다.',
  },
  {
    step: 2,
    title: '자동화 워크플로우 선택 및 시나리오 생성',
    images: [
      '/demo-generator-guide/demo-generator-2.png',
      '/demo-generator-guide/demo-generator-3.png',
    ],
    desc: "리서치 결과로 나온 'AGENT-AUTOMATABLE WORKFLOWS' 목록에서 데모로 보여주고 싶은 업무 워크플로우 2~3개를 체크한 뒤 'APPLY SELECTED WORKFLOWS'를 누르세요. 선택한 워크플로우를 반영한 비즈니스 시나리오 초안이 뜨면 내용만 확인하고 넘어가면 됩니다.",
    watch: "화면이 파란색 'SYNTHESIZING...' 진행바로 바뀌면 다음 단계(배포 스크립트 생성)로 자동 진행된 것입니다.",
  },
  {
    step: 3,
    title: '합성 데이터 · 배포 스크립트 컴파일 진행 확인',
    images: ['/demo-generator-guide/demo-generator-4.png'],
    desc: '이 단계는 별도 조작 없이 지켜보기만 하면 됩니다. 회사에 맞는 가상 고객·설비·인력 데이터와 Google Cloud 아키텍처, Cloud Shell용 배포 스크립트(.sh)가 실시간 로그와 함께 자동 생성됩니다. 보통 2~3분 정도 걸립니다.',
    watch: '완료되면 그 회사만의 가상 데이터 테이블(고객사·클라우드 서비스·엔지니어·프로젝트 등)과 데이터 관계도를 함께 확인할 수 있습니다.',
  },
  {
    step: 4,
    title: '첨부파일 다운로드 및 추천 데모 실행',
    images: [
      '/demo-generator-guide/demo-generator-9.png',
      '/demo-generator-guide/demo-generator-10.png',
    ],
    desc: "화면 하단 'EXTERNAL DOMAIN FILES'에서 PDF·엑셀·이미지 첨부파일을 다운로드하세요. 이 파일들은 잠시 뒤 에이전트 채팅에서 직접 업로드해 사용합니다. 그 아래 'RECOMMENDED DEMO FLOW'에는 이 회사 전용으로 맞춤 생성된 프롬프트 4단계가 준비되어 있습니다.",
    watch: '프롬프트 옆 COPY 버튼으로 복사해서 화면 하단 채팅창에 순서대로 붙여넣으면 방금 만든 나만의 에이전트 데모가 시작됩니다.',
  },
]
