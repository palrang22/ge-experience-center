/**
 * "에이전트 채팅 시작" 버튼이 여러 번 눌려도 매번 새 탭이 뜨지 않도록,
 * window.open의 name 매칭에만 기대지 않고 실제 창 참조를 직접 들고 재사용한다.
 * 모듈 스코프 변수라 도메인을 바꿔서 PlaygroundScenario가 리마운트돼도 참조가 유지된다
 * (React state로 두면 리마운트마다 초기화돼서 재사용이 깨진다).
 */
let chatWindow: Window | null = null

export function openChatPane(url: string) {
  if (chatWindow && !chatWindow.closed) {
    chatWindow.location.href = url
    chatWindow.focus()
    return
  }
  chatWindow = window.open(url, 'ge-chat-pane')
}
