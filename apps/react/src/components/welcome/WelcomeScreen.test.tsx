import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { WelcomeScreen } from './WelcomeScreen'

describe('WelcomeScreen', () => {
  test('Renders the welcome screen', async () => {
    const { container } = render(<WelcomeScreen onStart={() => {}} />)

    expect(container.getElementsByClassName('welcome-screen').length).toBe(1)
    expect(container.getElementsByClassName('theme-selector').length).toBe(1)
    expect(container.getElementsByClassName('size-selector').length).toBe(1)
    expect(screen.getByText('Welcome to 2048')).toBeInTheDocument()
    expect(screen.getByText('Start Game!')).toBeInTheDocument()
  })

  test('Starts the game', () => {
    const onStart = jest.fn()
    render(<WelcomeScreen onStart={onStart} />)

    const startButton = screen.getByText('Start Game!')
    startButton.click()

    expect(onStart).toHaveBeenCalledWith({
      type: 'game-started',
      size: 6, // default size
      theme: 'classic', // default theme
    })
  })
})
