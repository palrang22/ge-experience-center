import { useState } from 'react'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <section className="flex flex-col items-start gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vite + React + Tailwind</h1>
      <p className="text-slate-600">
        Edit <code className="rounded bg-slate-100 px-1 py-0.5">src/pages/HomePage.tsx</code> and
        save to test HMR.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Count is {count}
      </button>
    </section>
  )
}

export default HomePage
