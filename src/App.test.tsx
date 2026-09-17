import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders only the hero on the home page', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: /엔터프라이즈 AI 에이전트를/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /제조 & 스마트 팩토리/ })).not.toBeInTheDocument()
  })

  it('navigates to the architecture screen', async () => {
    renderApp('/')
    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: 'AI 아키텍처' }))
    expect(screen.getByRole('heading', { name: /AI는 어떻게 판단하는가/ })).toBeInTheDocument()
  })

  it('shows the domain grid on the experience page', () => {
    renderApp('/experience')
    expect(screen.getByRole('heading', { name: /6개 산업 도메인/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /제조 & 스마트 팩토리/ })).toBeInTheDocument()
  })

  it('navigates from a domain card on the experience page to its playground', async () => {
    renderApp('/experience')
    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: /제조 & 스마트 팩토리/ }))
    expect(
      screen.getByRole('heading', { name: /제조 & 스마트 팩토리 데모 체험/ }),
    ).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown domain id', () => {
    renderApp('/playground/unknown-domain')
    expect(screen.getByRole('heading', { name: /도메인을 찾을 수 없습니다/ })).toBeInTheDocument()
  })

  it('redirects unknown paths back to the home page', () => {
    renderApp('/does-not-exist')
    expect(screen.getByRole('heading', { name: /엔터프라이즈 AI 에이전트를/ })).toBeInTheDocument()
  })
})
