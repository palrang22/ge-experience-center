import { useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/architecture', label: 'AI 아키텍처', end: false },
  { to: '/experience', label: '체험', end: false },
] as const

const textClass = (isActive: boolean) =>
  `relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'
  }`

function AppLayout() {
  const location = useLocation()
  // 특정 도메인 데모(/playground/*)를 보고 있을 때도 "체험" 탭이 계속 활성 상태로 보이게 한다.
  const isExperienceActive =
    location.pathname.startsWith('/experience') || location.pathname.startsWith('/playground')
  const activeIndex = location.pathname === '/' ? 0 : isExperienceActive ? 2 : 1

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const blobRef = useRef<HTMLSpanElement>(null)
  const [blobRect, setBlobRect] = useState({ left: 0, width: 0 })

  // 물방울은 마우스 호버가 아니라 실제로 탭을 눌러서 라우트가 바뀔 때만 움직인다.
  useLayoutEffect(() => {
    function measure() {
      const nav = navRef.current
      const el = itemRefs.current[activeIndex]
      if (!nav || !el) return
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setBlobRect({ left: elRect.left - navRect.left, width: elRect.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIndex])

  useLayoutEffect(() => {
    // 물방울이 찌그러졌다 펴지는 느낌을 매번 새로 재생하기 위해 애니메이션 클래스를 강제로 떼고 다시 붙인다.
    const blob = blobRef.current
    if (!blob) return
    blob.classList.remove('nav-blob-squish')
    void blob.offsetWidth
    blob.classList.add('nav-blob-squish')
  }, [activeIndex])

  return (
    <div className="relative isolate flex min-h-screen flex-col text-text-primary">
      {/* 뷰포트에 고정된 배경 그라데이션 — 스크롤해도 콘텐츠 뒤에 그대로 붙어있다(참고: 원본 사이트 .bg-field).
          모든 라우트가 AppLayout 하나를 공유하므로 여기 한 군데만 깔면 전 화면에 적용된다.
          z-index를 auto인 채로 두면(DOM 순서에만 의존) position:fixed + header의 backdrop-blur가
          겹치면서 컴포지팅 레이어 순서가 브라우저마다 꼬여 본문 텍스트가 배경 뒤로 숨는 버그가 있었다
          (실사용자 리포트로 확인됨) — 그래서 배경/헤더/본문 3단 모두에 z-index를 명시적으로 준다.
          `isolate`로 이 래퍼를 독립 스태킹 컨텍스트로 만들어야 -z-10이 부모 배경 뒤로 다시 숨는 걸 막는다. */}
      <div aria-hidden="true" className="bg-field pointer-events-none fixed inset-0 -z-10" />
      {/* 탭바에 불투명 배경/구분선을 주지 않는다 — 배경 그라데이션이 헤더에서 끊기지 않고 한 화면처럼 이어지게 한다.
          backdrop-blur만 살짝 남겨서 스크롤되는 콘텐츠가 뒤로 겹쳐도 내비 글자는 읽힌다. */}
      <header className="sticky top-0 z-20 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
          <Link
            to="/"
            className="font-mono text-xs tracking-[0.2em] text-text-secondary transition-colors hover:text-text-primary"
          >
            GE EXPERIENCE CENTER
          </Link>

          <nav
            ref={navRef}
            className="relative flex items-center gap-1 rounded-full border border-border bg-surface-1 p-1"
          >
            <span
              ref={blobRef}
              aria-hidden="true"
              className="nav-blob absolute top-1 bottom-1 rounded-full"
              style={{ left: blobRect.left, width: blobRect.width }}
            />
            {NAV_ITEMS.map((item, index) =>
              item.to === '/experience' ? (
                <Link
                  key={item.to}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  to={item.to}
                  className={textClass(isExperienceActive)}
                >
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.to}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => textClass(isActive)}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div aria-hidden="true" />
        </div>
      </header>
      <main className="relative z-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
