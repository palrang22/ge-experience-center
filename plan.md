# GE Experience Center v2 — 구현 계획

> Phase 0의 결정은 `docs/consent-docs/2026-09-17-decisions.md`에서 확정됐다. 아래 계획은 그 답변을 반영한 확정 버전이다. 답변이 없던 항목(아키텍처 화면의 최종 시안)은 해당 Phase에서 실제 시안 2개를 만들어 사용자가 직접 고르게 한다.

## Phase 0 — 결정 확보 (완료)

`docs/consent-docs/2026-09-17-decisions.md` 참조. 핵심 결정 요약:

- 네비게이션: 상단 메뉴 / 화면 전환: `react-router-dom` 라우트 분리
- 데모 시나리오: 도메인별로 유동적 3~4단계
- 1차 스코프: 6개 도메인 전부 (신소재/원자재 세트 제외)
- 도메인 카드: 숫자 태그 없이 아이콘 + 에이전트 이름 + 짧은 예시만
- 외부 GE 채팅: **Chrome 네이티브 stacked split view**(2026-02, Chrome 145+)를 키오스크 셋업 시 수동으로 1회 구성. iframe/팝업 둘 다 기각 — iframe은 X-Frame-Options로 원천 차단(Phase 1 확인), 팝업은 "윈도우창 느낌"이 나서 키오스크 톤에 안 맞음(2026-09-17 확정)
- 무인 대기 1분 후 확인 팝업(예/아니오) → 처음 화면으로 리셋
- 데모 첨부 파일: 축소된 시나리오에 맞게 일부 새로 제작
- 테마: 다크 우선 제작 → 라이트 추가 → 토글. 포인트 컬러 `#000000` / `#414AFF` / `#8920FF` / `#34AD5C` (+ 필요시 Google Cloud 컬러)
- 아키텍처("AI는 어떻게 판단하는가") 화면: 구현 우선순위 최하위, A(정적 다이어그램)/B(아이콘 카드) 두 시안을 만들어서 직접 보고 결정

## Phase 1 — 기술 스파이크: 외부 채팅 연동 방식 (완료, 확정: Chrome 네이티브 split view)

- **iframe 임베드 검증 결과: 불가.** `curl`로 `vertexaisearch.cloud.google.com`의 에이전트 세션 URL 응답 헤더를 확인한 결과 `X-Frame-Options: SAMEORIGIN`(로그인 화면은 `DENY`)이 내려온다. 다른 오리진에서는 절대 iframe으로 못 넣는다. 리버스 프록시로 헤더를 벗기는 우회는 구글 로그인/OAuth 흐름이 깨지고 ToS상 바람직하지 않아 기각.
- **팝업창(위치 지정)도 기각.** 자동화는 되지만 브라우저 창 테두리/타이틀바가 보여서 전체화면 키오스크 톤이 깨짐 — 사용자가 명시적으로 거부(2026-09-17).
- **최종 확정: Chrome 145+(2026-02 출시)의 네이티브 stacked split view.**
  - 키오스크 셋업 시(하루 시작 시 1회, 수동) 운영자가 브라우저 창 아래쪽 가장자리로 탭을 드래그해서 상/하 스택형 분할을 만든다. 위쪽 = 우리 체험 웹앱, 아래쪽 = 대기 안내 화면(placeholder).
  - 아래쪽 탭에는 `window.name = 'ge-chat-pane'`을 부여해 둔다.
  - 웹앱의 "채팅 시작" 버튼은 `openChatPane(agentSessionUrl)`(`src/lib/chatPane.ts`)을 호출한다. **최초 구현은 `window.open(url, 'ge-chat-pane')`만 호출했는데, 실제 브라우저에서 클릭할 때마다 매번 새 탭이 열리는 버그가 있었다(2026-09-17 발견).** name 매칭에만 기대지 않고, 모듈 스코프 변수에 실제 창 참조를 들고 있다가 `!closed`면 `location.href`만 바꾸는 방식으로 교체해서 고침 — 이러면 도메인을 바꿔서 React 컴포넌트가 리마운트돼도(모듈 변수라 리마운트에 영향 안 받음) 같은 창을 계속 재사용한다.
  - Phase 6의 유휴 타임아웃 리셋도 같은 `openChatPane(idlePageUrl)`로 아래쪽을 대기 화면으로 되돌린다.
  - **미검증 리스크**: split view로 묶인 탭을 이렇게 스크립트로 내비게이션했을 때 분할 레이아웃이 유지되는지는 실제로 확인 못 함(automation 툴이 브라우저 탭 UI 자체는 조작 불가). 탭 그룹 방식 유추상 유지될 가능성이 높지만, **Phase 9 QA 또는 키오스크 셋업 리허설에서 반드시 실측 확인**할 것. 깨질 경우를 대비해 "분할이 깨지면 운영자가 재구성" 정도의 수동 복구 절차를 운영 가이드에 남겨둔다(자동 복구 불가 — Chrome이 split view 생성을 여는 공개 API를 제공하지 않음).
  - 운영 부담: 브라우저 재시작/탭 종료로 분할이 깨지면 운영자가 다시 수동으로 잡아야 한다. 이는 감수하기로 함.

## Phase 2 — 라우팅/IA 뼈대 (완료)

- `react-router-dom`으로 라우트 구성: `/domains`(기본), `/architecture`, `/playground/:domainId` (`src/App.tsx`)
- 상단 메뉴 컴포넌트(`src/layouts/AppLayout.tsx`): 도메인 선택 / AI 아키텍처 / (선택된 도메인이 있으면) 체험으로 이동. 선택 상태는 `SelectedDomainContext`로 관리, `PlaygroundPage`가 URL의 `domainId`를 컨텍스트에 반영.
- 다크 테마 토큰(`src/index.css`의 `@theme`): `brand-black/blue/purple/green` 포인트 컬러 + `surface-0/1/2`, `border`, `text-primary/secondary`. 이후 모든 화면이 이 토큰을 씀.
- 각 라우트는 아직 placeholder 콘텐츠(`DomainsPage`, `ArchitecturePage`, `PlaygroundPage`) — 실제 UI는 Phase 3/4/8에서 채움.
- 세로 40인치 기준 레이아웃 그리드(1~2열 중심, 가로 캐러셀·탭 바 금지)는 각 화면 콘텐츠를 채우는 Phase 3부터 적용.

## Phase 3 — 도메인 선택 화면 (`/domains`) (완료)

- 6개 도메인 카드(`src/data/domains.tsx`, `src/components/DomainCard.tsx`): 아이콘 + 에이전트 이름 + 짧은 사용 예시 한 줄. 숫자/규제 태그 완전히 제거. 원본 사이트에서 6개 도메인의 정확한 에이전트명/예시 문구를 직접 확인해서 재사용함(제조/금융/유통/IT·DevOps/미디어/공공행정).
- 아이콘은 이모지가 아니라 직접 그린 line-stroke SVG(`src/components/icons/DomainIcons.tsx`)로, 포인트 컬러 3개(blue/purple/green)를 순환 배치해 "AI 느낌" 없이 편집디자인 톤 유지.
- 카드 클릭 → `/playground/:domainId`로 라우트 이동(스크롤 아님, 화면 전환). `PlaygroundPage`는 존재하지 않는 도메인 id에 대해 "도메인을 찾을 수 없습니다" 안내 + 복귀 링크를 보여줌.

## Phase 4 — 데모 체험 화면 (`/playground/:domainId`) (완료)

- 시나리오 콘텐츠(단계/프롬프트/첨부파일/확인 포인트)는 `docs/demo-scenarios.md`를 `src/data/scenarios.ts`로 그대로 옮겨서 사용. ~~단, 그 문서는 원본 사이트 시나리오를 재사용하지 않고 완전히 새로 창작한 내용이라 2026-09-17 리뷰에서 사용자 확인을 요청한 상태~~ → **해결됨(Phase 5 참조)**: `demo-scenarios.md`가 v2로 리라이트되어 원본 7단계의 실제 프롬프트/파일을 재사용하는 방식으로 바뀌었고, `scenarios.ts`도 v2에 맞춰 다시 동기화했다(도메인별 단계 수가 v1과 달라졌음: 제조/금융/미디어 4단계, 유통/IT 3단계, 공공 3단계).
- `src/components/ScenarioStepCard.tsx`: 단계 카드(WOW 배지, 프롬프트 복사 버튼, 첨부파일 확장자 배지, 확인 포인트, 완료 체크박스). 아코디언(접기/펼치기) 없이 전부 펼쳐서 보여줌 — 클릭 수를 줄이는 게 목적이라 원본의 "펼쳐야 보이는" 구조를 없앰.
- `agentChatUrl`(`src/data/domains.tsx`에 6개 도메인 모두 추가, 원본 사이트에서 실측): "에이전트 채팅 시작" 클릭 시 `openChatPane(agentChatUrl)` 호출 → Phase 1에서 확정한 split view 하단 탭 내비게이션(재사용 버그 수정 내역은 Phase 5.1 참조). 우리 웹앱은 채팅 UI 자체를 그리지 않음.
- 도메인이 바뀌면 완료 체크 상태가 자연스럽게 초기화되도록 `key={domain.id}`로 하위 컴포넌트를 리마운트하는 방식 사용(effect에서 setState 직접 호출하지 않음 — `react-hooks/set-state-in-effect` 린트 규칙 위반 회피).
- 클립보드 복사는 `navigator.clipboard.writeText` 실패를 조용히 무시(권한 차단 시에도 프롬프트 텍스트는 화면에 그대로 보이므로 체험에 지장 없음).

## Phase 5 — 데모 데이터 재제작 (완료)

- `docs/demo-scenarios.md`가 v2로 리라이트되면서(2026-09-17) "완전 새 창작"에서 "원본 7단계의 실제 프롬프트/파일을 그대로 재사용하며 3~4단계로 압축"으로 방향이 바뀌었고, 원본 사이트의 실제 첨부파일이 `assets/demo-data/<파일명>`에 그대로 존재함을 `curl`로 직접 검증함(3개 샘플 200 OK + 크기 일치).
- 신규 제작 없이 **원본 파일 23개(고유 기준, 금융 1개는 2단계·4단계에서 재사용)를 그대로 다운로드**해 `public/demo-data/<domainId>/`에 저장. 도메인 폴더: `manufacturing`, `finance`, `retail`, `it-devops`, `media`, `public-sector`.
- 검증 필요했던 두 결정: (1) 회사명/지명(한성정밀·대원정밀·씨네맥스 코리아 등 가상 고유명사)을 리브랜딩할지 → **원본 그대로 재사용** 확정. (2) Vision 단계 첨부 이미지 2개 → 1개로 줄일지 → **2개 유지(원본 그대로)** 확정. 기록: `docs/consent-docs/2026-09-17-phase5-decisions.md`.
- 참고: `handwritten_*.jpg`로 명명된 파일들은 실제 바이너리가 전부 PNG(매직바이트 `89 50 4E 47`)다. 원본 사이트도 동일하게 서빙하던 것이라 그대로 유지 — 브라우저/뷰어는 확장자가 아니라 콘텐츠로 포맷을 인식하므로 표시에는 문제없음.
- `src/data/scenarios.ts`를 v2 내용으로 전면 재작성(제조/금융 4단계, 유통/IT 3단계, 미디어 4단계, 공공 3단계 — v1 초안의 단계 수와 다름, Phase 4가 최신 데이터를 쓰도록 동기화 완료).
- `ScenarioStepCard`의 첨부파일 칩을 실제 다운로드 링크(`/demo-data/<domainId>/<file>`)로 변경. `npm run dev` 상태에서 실제 200 OK로 서빙되는 것까지 확인함.

## Phase 5.1 — 홈 랜딩페이지 · 네비게이션 · 폰트 · 채팅 재사용 버그 수정 (2026-09-17, 완료)

사용자가 실제로 써보고 준 피드백 여러 건 + 제가 테스트하다 발견한 버그 1건. 여러 라운드로 계속 조정됐어서 **최종 상태만 아래(Phase 5.2)에 정리하고, 여기는 그 과정에서 고친 버그/인프라성 변경만 남긴다.**

- **채팅 재사용 버그 수정**: 위 Phase 1/4 설명 참조. `window.open(url, name)`의 name 매칭만으로는 실제 클릭 시 매번 새 탭이 열려서, `src/lib/chatPane.ts`의 `openChatPane()`(모듈 스코프 창 참조 재사용)으로 교체.
- **폰트 통일**: 한글은 시스템 폰트, 영문/숫자는 로드되지 않은 `JetBrains Mono` fallback이라 폰트가 섞여 보이는 문제가 있었음. `pretendard` npm 패키지를 설치(CDN 의존 없이 자체 호스팅 — 키오스크가 오프라인/네트워크 불안정해도 깨지지 않게)하고 `src/index.css`에서 `--font-sans`/`--font-mono` 둘 다 Pretendard로 통일. `npm install`이 아니라 **`pnpm add`로 설치해야 함**(이 리포는 `pnpm-lock.yaml` 기반이라 npm으로 설치하면 arborist 오류로 깨짐 — 실제로 한 번 겪음).
- **디자인 원칙 명확화(CLAUDE.md)**: "그라데이션 금지"가 아니라 "아무데나 습관 없이 쓰지 말라"는 뜻이었음. 홈 랜딩처럼 첫인상을 주는 화면은 레퍼런스(`docs/design/landing-page-ref.png` = Trading Landing Page/Roobinium 등)처럼 그라데이션·그래픽·모션을 의도적으로 적극 사용해도 됨. 도메인 카드/체험 같은 정보 중심 화면은 여전히 단색 포인트 컬러 위주.

## Phase 5.2 — 정보구조 재조정: "도메인 선택"과 "체험" 통합 (2026-09-17, 완료, 최종 상태)

사용자 피드백: "상단 탭 '도메인 선택'이 '체험'이랑 사실 똑같은거 아냐?" + "6개 산업 도메인/how to experience를 메인화면에 두지 말고 체험 탭으로 분리해". 최종적으로 다음 구조로 정리했다.

- **라우트**: `/`(홈, 순수 히어로만) · `/architecture` · `/experience`(도메인 그리드 + 체험 순서 3단계 — 예전 `/domains`와 같은 역할이지만 "체험" 탭이 이 화면으로 직접 연결됨) · `/playground/:domainId`.
- **상단 메뉴는 3개로 고정**: 홈 / AI 아키�텍처 / 체험. "도메인 선택"이라는 별도 탭은 없앰 — 체험 탭 자체가 도메인 고르는 화면(`/experience`)으로 연결되고, 카드를 누르면 `/playground/:domainId`로 이어짐.
- **"체험" 탭은 이제 항상 활성화된 진짜 링크다.** 예전엔 도메인을 먼저 골라야 나타나는 조건부 표시였는데, 이제 `/experience`(고르는 화면) 자체가 있으니 조건이 필요 없어졌다. 대신 `/experience`나 `/playground/*`에 있을 때 "체험" 탭이 계속 눌린 상태로 보이도록 `AppLayout`에서 `useLocation`으로 경로 접두사를 직접 확인해서 하이라이트한다(`react-router`의 `NavLink` 자동 매칭만으로는 `/playground/*`까지 커버가 안 돼서 수동으로 처리).
- **`SelectedDomainContext`/`SelectedDomainProvider` 완전히 삭제.** "체험" 탭을 조건부로 켜고 끄기 위해 만들었던 전역 상태였는데, 위 변경으로 더 이상 아무도 안 읽어서 죽은 코드가 됐다 — 지우는 게 맞다고 판단해서 삭제(`src/context/` 디렉터리 전체 제거).
- **홈(`/`)은 순수 히어로만 남긴다.** 6개 도메인 그리드와 "HOW TO EXPERIENCE" 3단계는 전부 `/experience`로 옮김(`src/pages/ExperiencePage.tsx` 신설). 히어로에는 배지 + 헤드라인 + 서브카피 + CTA 버튼 2개("AI 아키텍처 확인하기" → `/architecture`, "체험하기" → `/experience`)만 남고, 예전에 있던 통계 행(6/3~4/100%/HITL)은 "의미 없는 숫자"라는 피드백으로 삭제.
- **히어로 그래픽**: `docs/design/landing-page-ref.png`(Roobinium Trading Landing Page 레퍼런스)를 직접 열어서 확인 — 중앙 정렬 텍스트 + 그 아래 크고 부드럽게 움직이는 그라데이션 오브. `src/index.css`에 `.hero-orb`(라디얼 그라데이션 블루→퍼플→그린 + `hero-orb-float` 8초 keyframe, `prefers-reduced-motion` 존중)를 만들어서 재현. 순수 CSS라 이미지/3D 라이브러리 의존 없음.

## Phase 5.3 — 도메인 카드: 반응형 그리드 → 원본 사이트식 가로 스크롤 캐러셀 (2026-09-17, 완료)

Phase 5.2 직후 "화면 가로폭 줄여도 1개로 보이게 하지 마, 최대 2개까지, 넓어지면 3/4개로 늘어나게 해줘"라고 해서 `grid-cols-2 md:grid-cols-3 xl:grid-cols-4`로 고쳤는데, 바로 이어서 "너무 구리다, 그냥 원본 사이트(`#domains`) 따라가자"로 방향이 바뀌었다. **그리드 반응형 접근은 폐기.**

- **레이아웃**: `/experience`의 도메인 섹션을 CSS 그리드에서 `flex overflow-x-auto snap-x snap-mandatory` 가로 스크롤 레일로 교체. 카드는 `flex-[0_0_clamp(300px,31%,400px)] snap-start`로 고정폭(원본과 동일한 clamp 값) — 화면이 넓어져도 카드가 늘어나지 않고 옆으로 더 보인다. 이전 좌우 화살표(‹ ›) 버튼도 그대로 추가(`railRef.scrollBy`).
- **마우스 인터랙션**: 원본 사이트를 크롬 devtools 없이 `javascript_exec`로 직접 뜯어봐서(`document.styleSheets` 순회로 `.dcard`/`.dcard::before`/`.dcard::after` 규칙 원문 추출, `dispatchEvent(mousemove)`로 인라인 스타일 변화 관찰) 정확한 메커니즘을 확인했다:
  - 카드마다 `--c1`/`--c2` 두 색(도메인당 다른 시안/블루/퍼플/그린 톤, 원본 값 그대로 재사용).
  - 마우스 위치를 퍼센트로 `--mx`/`--my`에 저장 → `::after`가 그 위치에 320px 라디얼 글로우(`color-mix(--c1 26%, transparent)`)를 그림.
  - 호버 시 `::before`가 mask 트릭으로 `--c1`→투명→`--c2` 대각선 그라데이션 테두리를 그림(`border-color: transparent`로 바꿔서 진짜 테두리 대신 이걸 보여줌).
  - `rotateY = (mx비율-0.5)*9deg`, `rotateX = (0.5-my비율)*9deg`, `translateY(-8px)` — 마우스 위치에 따라 카드가 살짝 그쪽으로 기울고 떠오름. 원본의 실측값과 공식이 정확히 일치하는 걸 확인(역산해서 계수 9 도출).
  - `src/components/DomainCard.tsx`에 `useRef` + `onMouseMove`/`onMouseLeave`로 구현(리렌더 없이 `card.style.setProperty`로 직접 DOM 갱신 — React state로 하면 마우스 움직일 때마다 리렌더돼서 성능이 나쁨). CSS는 `src/index.css`의 `.tilt-card`(원본의 `.dcard`를 이름만 바꿔 재구현).
  - 카드 내부 콘텐츠(아이콘/이름/에이전트 배지/설명/소요시간/키워드 칩/"체험하기" 버튼)는 기존 그대로 유지 — 이번 변경은 카드를 감싸는 레이아웃과 마우스 인터랙션/글로우 색상만 바꾼 것.
- **후속 다듬기(같은 날)**: (1) 스크롤바가 보여서 거슬린다 → `.no-scrollbar`(`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`)로 숨김, 스크롤 기능은 유지. (2) 카드 호버 시 위쪽이 잘림 → `overflow-x-auto`를 걸면 CSS 스펙상 `overflow-y`도 자동으로 `auto`(클리핑)가 되는 걸 몰랐던 게 원인 — `translateY(-8px)` 뜨는 것 + 글로우가 잘리지 않도록 레일에 `py-6` 여유 패딩 추가로 해결(overflow-y를 명시적으로 visible로 못 풀길래 패딩으로 우회). (3) "카드를 선택하면..." 안내문이 큰 화면에서도 줄바꿈됨 → 문단에 걸려있던 `max-w-xl`이 원인, 제거하고 부모에 `flex-1 min-w-0`을 줘서 가로 폭을 실제로 다 쓰게 함.
- **버그 하나 더(같은 날, 2차 피드백)**: 마우스가 카드 가장자리로 가면 320px 정사각형 스포트라이트(`::after`)가 카드의 둥근 모서리 밖으로 삐져나와 보임 — `.tilt-card`에 `overflow: hidden`이 빠져 있었던 게 원인(원본 `.dcard`엔 있었는데 포팅하면서 빠뜨림). 추가해서 해결. 색상도 도메인별로 다른 6가지 톤 대신 **보라 하나로 통일**(`src/lib/domainCardTheme.ts`의 `GLOW`를 `PURPLE_GLOW`(`#c084fc`→`#8920ff`) 하나만 쓰도록 변경).
- **3차 피드백**: "위로 가면 안 나오는데 아래로 가면 아직 나온다" — `overflow: hidden`은 카드 자기 자신의 `box-shadow`는 못 자른다(그건 스펙상 예외). 그런데 호버 시 `box-shadow`가 `0 40px 90px -30px`로 **아래쪽으로만 크게 치우쳐** 있어서(원본 `.dcard:hover`값 그대로 가져온 것) 위쪽은 거의 안 보이고 아래쪽만 삐져나왔던 것. `0 0 45px -12px`로 오프셋 없이 사방으로 고르게 퍼지는 작은 글로우로 교체해서 해결.

## Phase 5.4 — 상단 탭바: 물방울 인디케이터 (2026-09-17, 완료)

"탭바 양옆으로 움직일 때 물방울 애니메이션 + 그라데이션 색상" 요청. `AppLayout.tsx`에 구현:

- 탭 배경(`bg-brand-blue` 단색)을 없애고, 탭 뒤에 절대 위치 `<span className="nav-blob">` 하나를 두고 `left`/`width`를 JS로 재서 활성/호버 탭 위로 이동시킴. 텍스트 색만 있음(active=흰색, 아님=text-secondary).
- **호버로 움직임**: 마우스가 다른 탭에 올라가면 그 탭 쪽으로 블롭이 따라가고, 탭바에서 마우스가 나가면(`onMouseLeave`) 실제 활성 라우트 탭으로 복귀. `hoveredIndex ?? activeIndex`로 표시 인덱스 결정.
- **물방울 느낌**: `left`/`width` 전환에 오버슈트 있는 `cubic-bezier(0.34, 1.56, 0.64, 1)`를 써서 늘어나며 이동하게 하고, 위치가 바뀔 때마다 `nav-blob-squish` 클래스를 강제로 떼고 다시 붙여서(`classList.remove` → `offsetWidth` 강제 리플로우 → `classList.add`) 스케일이 찌그러졌다 펴지는 keyframe(`nav-blob-squish-kf`)을 매번 재생.
- **색상**: 단색 파랑 → `linear-gradient(90deg, blue, purple 60%, green)` 그라데이션 + 보라 톤 글로우(box-shadow).
- 위치 측정은 `getBoundingClientRect` 기반이라 `resize` 이벤트에도 재계산.
- **후속 피드백(같은 날)**: (1) "마우스 따라오지 말고 클릭할 때만 움직여야지" → `hoveredIndex`/`onMouseEnter`/`onMouseLeave` 전부 제거, 오직 `activeIndex`(실제 라우트)만으로 위치를 정함 — 탭을 눌러 라우트가 바뀔 때만 슬라이드+스퀴시가 재생됨. (2) "탭 하나 폭에 그라데이션 3색이 너무 정신없다, 2색만 은은하게" → 블루→퍼플→그린 3색을 블루→퍼플 2색으로 줄이고, 각 색을 `color-mix(..., white 10%)`로 살짝 밝게 섞고 글로우 강도(box-shadow의 color-mix 비율/블러)도 낮춤.

## Phase 5.5 — 채팅 연동: Chrome split view 안내 모달 (2026-09-17, 완료)

사용자가 Gemini와 나눈 대화를 공유하며 "위젯으로 임베드 가능한지" 물어봐서 조사함 — 결론: Google 공식 문서상 위젯 임베드는 **Agent Search의 '검색 앱(Search App)'에만** 있는 기능이고, 우리가 쓰는 `vertexaisearch.cloud.google.com/.../r/agent/<id>/session/-`는 그와 다른 **'에이전트(Agent)' 세션**이라 해당 없음(문서에 언급 자체가 없음, 실측 `X-Frame-Options: SAMEORIGIN`과도 일치). "API 기반 커스텀 UI"(Agent Platform API/Interactions API)는 실제로 존재하지만 **GCP 서비스 계정 인증이 필요한 백엔드**를 새로 만들어야 해서 스코프가 완전히 달라짐 — 사용자가 "지금 방식(Chrome split view) 유지"로 결정.

대신 운영자가 매번 수동으로 알아서 split view를 잡는 게 아니라, **앱 안에서 직접 안내하는 모달**을 만들기로 함:

- **`AgentChatCard`(플레이그라운드 좌측 카드)를 원상복구**: `/experience`의 `DomainCard`와 달리 여기는 클릭 대상이 아니라 정보만 보여주는 **정적 카드**로 되돌림(마우스 틸트/스포트라이트 전부 제거). 카드 안의 CTA만 실제 `<button>`으로 분리 — 누르면 카드 전체가 아니라 이 버튼만 동작.
- **`SplitViewGuideModal` 신설**(`src/components/SplitViewGuideModal.tsx`): 카드의 "에이전트 채팅 시작" 버튼을 누르면 바로 채팅으로 가는 게 아니라 이 모달이 뜬다. 사용자가 실제로 크롬에서 우클릭해서 캡처한 스크린샷 2장(`docs/design/splitview-guide-1.png`, `-2.png` → `public/guide/`로 복사)을 그대로 보여주고, 각 이미지 밑에 "1. 우클릭 → 분할 뷰에서 링크 열기", "2. 주소창 왼쪽 분할 아이콘 → 스택형으로 표시" 설명, 그 아래 "3. 닫기를 누르고 오른쪽 가이드의 1번부터 진행해주세요."
- **진짜 실행 버튼은 모달 안에 있다**: 모달 하단의 "에이전트 채팅 시작"이 실제 `<a href={agentChatUrl}>`다 — 우클릭하면 크롬이 그 href로 진짜 링크 컨텍스트 메뉴("분할 뷰에서 링크 열기" 포함)를 띄운다. 좌클릭은 `preventDefault` 후 기존 `openChatPane()`(재사용 창)으로 처리해서 안내를 안 읽고 그냥 눌러도 동작은 하게 함.
- **후속 다듬기(같은 날)**: 모달 폭을 `max-w-lg` → `max-w-4xl`로 거의 꽉 차게, 설명 글자를 `text-xs` → `text-base`로 키움(제목 `text-lg` 대비 1~2단계만 작게), 닫기 버튼을 텍스트 "닫기" → 원형 "×" 아이콘으로. 스크린샷 두 장의 실제 픽셀 크기가 달라서(234×285, 157×285) `w-full`로 늘렸더니 높이가 안 맞고 너무 컸음 — `h-48 w-auto`로 높이 기준 정렬해서 둘 다 같은 높이로 맞춤.
- **3번째 이미지 추가**: "닫기를 누르고 오른쪽 가이드의 1번부터 진행해주세요"를 텍스트로만 따로 뒀었는데, "저 단계 옆에다가 똑같이" 넣으라는 피드백 — `splitview-guide-3.png`(오른쪽 데모 가이드의 1번 단계가 빨간 박스로 강조된 스크린샷)을 추가해서 1·2번과 동일한 이미지+캡션 형식의 3번째 항목으로 통일. 그리드도 `sm:grid-cols-2` → `sm:grid-cols-3`으로.

## Phase 6 — 키오스크 유휴 타임아웃 (보류)

- 키오스크 전용 기능이나 현재 웹 환경으로 운영되므로 사용자 요청에 의해 보류됨.

## Phase 7 — 라이트 테마 + 토글 (보류)

- 다크 테마 우선 완성 원칙에 따라 사용자 요청으로 보류.

## Phase 8 — 아키텍처 화면 (`/architecture`) (2026-09-17 완료)

사용자 피드백을 반영하여 두 가지 옵션을 모두 구현하고, 상단 토글로 실시간 비교할 수 있도록 완성함:

- **옵션 1 (3D 인터랙티브 캔버스)**:
  - 원작 데모의 순수 Canvas 2D + 3D 원근 투영 수학식(`project`)을 React 컴포넌트([`src/components/Architecture3DCanvas.tsx`](file:///C:/Users/USER/ge-experience-center/src/components/Architecture3DCanvas.tsx))로 완벽 포팅.
  - 마우스 드래그 3D 회전, [자동 회전] 토글, [시점 초기화], 엣지를 따라 흐르는 데이터 펄스 애니메이션 구현.
  - 우측 5단계 레이어 카드와 양방향 포커스 연동 (카드 호버 시 캔버스 내 해당 계층 집중 강조 & 타 계층 dimming, 캔버스 노드 호버 시 카드 반응).
- **옵션 2 (파이프라인 플로우 뷰)**:
  - 위→아래로 흐르는 모던한 수직 플로우차트 및 인터랙티브 카드 파이프라인.
  - 5개 계층 간 그라데이션 스트림 커넥터와 펄스 화살표, 21개 세부 노드 그리드 카드, 상단 퀵 점프/필터 지원.
- 상단 토글 버튼(`옵션 1 (3D 캔버스 뷰)` ↔ `옵션 2 (파이프라인 플로우 뷰)`)을 통해 사용자가 직접 두 시안을 눈으로 비교할 수 있게 함.

## Phase 10 — "에이전트 만들기"(`/generate`): 자사 도메인 스크립트 생성 체험 (2026-09-21, 착수)

기존 체험(6개 도메인 에이전트 테스트)과 별개로, **체험객이 자기 회사 도메인을 넣어서 그 회사 전용 에이전트를 만드는 스크립트를 뽑아보는 체험**을 추가한다. 상세 배경은 `CLAUDE.md`의 "신규 기능 — 에이전트 만들기" 섹션 참조. 여기는 구현 상태와 TODO만 추적한다.

- **현재 상태(작업 트리, 미커밋)**: `AppLayout.tsx`에 4번째 상단 메뉴 "에이전트 만들기"(`/generate`) 추가됨, `App.tsx`에 라우트 등록됨, `src/pages/GeneratePage.tsx`는 "준비 중입니다" 플레이스홀더. `public/demo-generator-guide/demo-generator-1.png` ~ `-10.png`(외부 GE Demo Generator 사이트 실제 화면 캡처 10장) 확보 완료.
- 겸사겸사 `SplitViewGuideModal`의 스크린샷 경로가 `public/guide/` → `public/splitview-guide/`로 정리됨(`docs/design/splitview-guide-*.png`, `public/guide/splitview-guide-*.png` 삭제 → `public/splitview-guide/`로 통합), 컴포넌트 import 경로도 함께 수정됨 — 내용 변경 아닌 파일 위치 정리.
- **외부 사이트**: Google Apps Script 웹앱(`https://script.google.com/a/macros/mz.co.kr/s/.../exec`). 도메인 입력 → 회사 리서치 → 자동화 워크플로우 선택 → 비즈니스 시나리오/Cloud Shell용 `.sh` 스크립트 생성 → 합성 데이터/아키텍처 다이어그램 확인 → 첨부파일 다운로드 → 맞춤 추천 데모 프롬프트 제공까지 이어지는 흐름(원본 10단계, 스크린샷으로 전부 캡처됨). UI가 영어라 한국어 가이드가 필요.
- **연동 방식**: 새로 스파이크하지 않고 Phase 1에서 확정한 Chrome split view + `SplitViewGuideModal`을 그대로 재사용(이 컴포넌트는 URL만 받는 범용 컴포넌트라 수정 불필요). `openChatPane()`(`src/lib/chatPane.ts`)도 재사용 가능 — split view 아래쪽에 GE Demo Generator URL을 띄우는 용도로 그대로 쓰면 됨.
- **TODO(구현 전 결정 필요)**:
  1. 원본 10단계를 몇 단계로 압축할지 확정. 가안: 4단계(①도메인 입력·리서치 ②워크플로우 선택·시나리오 생성 ③스크립트 컴파일 진행 확인 ④결과물 다운로드·추천 데모 실행) — 기존 "3~4단계로 축소" 원칙과 일치시킨 제안일 뿐, 실제 캡션 문구/스크린샷 매핑은 아직 작성 안 됨.
  2. 새 데이터 파일(가칭 `src/data/generatorGuide.ts`)에 압축된 단계별 {step, title, image, desc} 정의.
  3. 새 컴포넌트(가칭 `GeneratorStepCard`) 작성 — 기존 `ScenarioStepCard`(프롬프트 복사/첨부파일 배지 중심)는 이 용도에 안 맞아 재사용 불가, 스크린샷 표시 + 한국어 설명 + 완료 체크만 있는 단순한 카드로 새로 만든다.
  4. `GeneratePage.tsx`를 `PlaygroundPage.tsx`와 같은 좌(정적 카드 + 시작 버튼 + `SplitViewGuideModal`)/우(단계별 가이드 카드) 2단 레이아웃으로 채운다. 다만 좌측 카드는 도메인 정보(`Domain` 타입) 대신 "에이전트 만들기" 자체를 소개하는 고정 문구/아이콘이어야 하므로 `AgentChatCard`를 그대로 쓰기보다 비슷한 모양의 새 카드가 필요할 수 있음.
  5. **GE Demo Generator URL의 `mz.co.kr` 계정 인증 여부 확인** — Apps Script 배포 경로(`/a/macros/mz.co.kr/`)가 도메인 제한 배포일 가능성이 있어, 외부 체험객이 직접 접근 못 할 수 있다. 인증이 필요하다면 키오스크 브라우저에 사내 계정으로 매일 미리 로그인해두는 운영 절차가 추가로 필요(Chrome split view 수동 셋업과 함께 운영 가이드에 포함).
  6. 완료 후 QA(Phase 9)에 이 체험도 포함시켜야 함.

## 병렬 작업 가능 항목 (다른 터미널에서 동시 진행 가능)

- **Phase 8(아키텍처 화면)은 안전하게 병렬 가능.** `src/pages/ArchitecturePage.tsx` 하나만 건드리면 되고, 지금까지 손댄 파일(App.tsx/AppLayout.tsx/index.css/domains.tsx/scenarios.ts)과 전혀 겹치지 않는다. 다만 시안 A/B를 실제로 만들어 사용자가 직접 비교해야 하니, 완료돼도 "선택 확정"까지는 이 대화와 조율 필요.
- **Phase 6(유휴 타임아웃)은 병렬 가능하지만 파일이 조금 겹친다.** 새 훅/모달 컴포넌트는 독립적으로 만들 수 있지만, 그걸 어디선가 마운트하려면 `App.tsx` 또는 `AppLayout.tsx`를 건드리게 된다(방금 그 두 파일을 수정했음). 작업 시작 전에 최신 상태를 pull/sync하고 시작할 것.
- **Phase 7(라이트 테마)도 병렬 가능하지만 `src/index.css`를 건드린다** — 방금 폰트 토큰을 수정한 파일이라 병합 시 충돌 가능성 있음. 컬러 토큰 추가는 대부분 끝에 새로 append하는 방식이라 충돌 위험은 낮은 편.
- Phase 9(QA)는 나머지가 다 끝나야 의미가 있어서 병렬 대상이 아님.

## Phase 9 — QA

- 실제 키오스크 브라우저(Chrome 145+)에서 split view를 수동 구성한 뒤, 40인치 세로 비율(또는 근접 비율)로 전 화면 점검.
- **`window.open(url, 'ge-chat-pane')` 내비게이션이 split view를 깨지 않는지 실측 확인** (Phase 1에서 명시한 미검증 리스크).
- 6개 도메인 시나리오를 처음부터 끝까지 직접 실행, 아래쪽 채팅 탭 연동이 끊기지 않는지 확인.
- 유휴 타임아웃 동작 확인(1분 후 팝업 → 리셋, 채팅 탭도 대기 화면으로 복귀).
- 다크/라이트 토글 확인.
- `npm run lint`, `npm test`.

## 참고 — 기존 사이트에서 확인된 사실

- 실제 배포 앱 소스는 이 리포에 없음. v2는 새로 설계/구현.
- "에이전트 채팅 시작" 버튼은 `vertexaisearch.cloud.google.com`의 외부 세션 URL로 연결됨. 기존 사이트는 iframe이 아니라 새 창/팝업으로 열었음 — iframe 임베드는 Phase 1에서 `X-Frame-Options: SAMEORIGIN` 확인으로 불가능함이 확정됨(기존 사이트가 팝업을 쓴 이유였을 것).
- 기존 사이트에는 6개 도메인 외에 "R&D 신소재 품질 검증 세트", "글로벌 원자재 MD 공급망 세트"도 있었음 — 이번 스코프에서는 제외.
