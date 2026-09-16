import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}

describe('App', () => {
  it('renders the home page by default', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /vite \+ react \+ tailwind/i })).toBeInTheDocument()
  })

  it('increments the counter on click', async () => {
    renderApp()
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('navigates to the about page', async () => {
    renderApp()
    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: /about/i }))
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })
})
