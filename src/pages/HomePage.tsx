import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="hero-aurora">
        <span className="hero-aurora-blob hero-aurora-blob--blue" />
        <span className="hero-aurora-blob hero-aurora-blob--purple" />
        <span className="hero-aurora-blob hero-aurora-blob--green" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 py-24 text-center md:py-30">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-text-secondary">
          GEMINI ENTERPRISE · EXPERIENCE CENTER
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
          엔터프라이즈 AI 에이전트를
          <br />
          <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            직접 지휘
          </span>
          해 보세요.
        </h1>

        <p className="max-w-xl text-lg text-text-secondary">
          6개 산업 도메인의 Gemini Enterprise 에이전트가 실제 데이터에 근거해 어떻게 판단하는지,
          프롬프트 하나로 직접 눌러봅니다.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/architecture"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
          >
            AI 아키텍처 확인하기
          </Link>
          <Link
            to="/experience"
            className="rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(137,32,255,0.55)] transition-opacity hover:opacity-90"
          >
            체험하기 →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage
