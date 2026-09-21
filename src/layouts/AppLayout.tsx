import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'home', to: '/', label: '홈' },
  { id: 'architecture', to: '/architecture', label: 'AI 아키텍처' },
  { id: 'experience', to: '/experience', label: '에이전트 사용해보기' },
  { id: 'generate', to: '/generate', label: '에이전트 만들기' },
] as const

const textClass = (isActive: boolean) =>
  `relative z-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'
  }`

function getRouteOrder(pathname: string): number {
  if (pathname.startsWith('/playground')) return 4
  if (pathname.startsWith('/generate')) return 3
  if (pathname.startsWith('/experience')) return 2
  if (pathname.startsWith('/architecture')) return 1
  return 0 // '/'
}

function AppLayout() {
  const location = useLocation()

  // 라우트 간 좌우 슬라이딩 트랜지션 방향 계산
  const currentOrder = getRouteOrder(location.pathname)
  const [prevRoute, setPrevRoute] = useState({ pathname: location.pathname, order: currentOrder })
  const [slideAnim, setSlideAnim] = useState('')

  if (prevRoute.pathname !== location.pathname) {
    let nextAnim = ''
    if (currentOrder > prevRoute.order) {
      nextAnim = 'page-slide-from-right'
    } else if (currentOrder < prevRoute.order) {
      nextAnim = 'page-slide-from-left'
    }
    setPrevRoute({ pathname: location.pathname, order: currentOrder })
    setSlideAnim(nextAnim)
  }

  // 라우트 이동 시 스크롤 최상단 리셋
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  // 특정 도메인 데모(/playground/*)를 보고 있을 때도 "체험" 탭이 계속 활성 상태로 보이게 한다.
  const isExperienceActive =
    location.pathname.startsWith('/experience') || location.pathname.startsWith('/playground')

  const activeIndex = isExperienceActive
    ? 2
    : location.pathname === '/architecture'
      ? 1
      : location.pathname === '/generate'
        ? 3
        : 0

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const blobRef = useRef<HTMLSpanElement>(null)
  const [blobRect, setBlobRect] = useState({ left: 0, width: 0 })

  // 물방울 위치 측정 (탭 변경 및 창 리사이즈 시)
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

  // 물방울 스퀴시 애니메이션: 탭이 바뀔 때마다 스퀴시 재생
  useLayoutEffect(() => {
    const blob = blobRef.current
    if (!blob) return
    blob.classList.remove('nav-blob-squish')
    void blob.offsetWidth
    blob.classList.add('nav-blob-squish')
  }, [activeIndex])

  const handleNavClick = (
    id: 'home' | 'architecture' | 'experience' | 'generate',
    e: React.MouseEvent,
  ) => {
    if (id === 'home' && location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // architecture/experience는 Link 기본 동작(라우트 이동)
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col text-text-primary">
      {/* 뷰포트에 고정된 배경 그라데이션 */}
      <div aria-hidden="true" className="bg-field pointer-events-none fixed inset-0 -z-10" />

      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-20 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
          <Link
            to="/"
            onClick={(e) => handleNavClick('home', e)}
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
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeIndex === index
              return (
                <Link
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  to={item.to}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={textClass(isActive)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div aria-hidden="true" />
        </div>
      </header>

      <main className="relative z-0 flex flex-1 flex-col overflow-x-hidden">
        <div
          key={location.pathname}
          className={`flex w-full flex-1 flex-col ${slideAnim}`}
          onAnimationEnd={() => setSlideAnim('')}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
