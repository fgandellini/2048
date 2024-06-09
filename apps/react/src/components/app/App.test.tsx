import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import * as appManager from '../../game-logic/app-manager'
import { App } from './App'

describe('App', () => {
  test('Renders the app', async () => {
    const { container } = render(<App />)

    expect(container.getElementsByClassName('app').length).toBe(1)
  })

  test('Renders the welcome screen as first page', async () => {
    const { container } = render(<App />)

    expect(container.getElementsByClassName('welcome-screen').length).toBe(1)
  })

  test('Starts the game', async () => {
    const { container } = render(<App />)

    const startButton = screen.getByText('Start Game!')
    act(() => startButton.click())

    expect(container.getElementsByClassName('board').length).toBe(1)
  })

  test('Renders the app in the won state', async () => {
    jest.spyOn(appManager, 'getInitialState').mockReturnValue({
      state: 'in-game',
      theme: 'classic',
      game: {
        state: 'won',
        board: {
          size: 4,
          grid: [{ value: 2048 }, null, null, null],
        },
      },
    })

    const { container } = render(<App />)

    expect(screen.getByText('You Won!')).toBeInTheDocument()
    // the screen includes the last board state
    expect(container.getElementsByClassName('board').length).toBe(1)
  })

  test('Renders the app in the lost state', async () => {
    jest.spyOn(appManager, 'getInitialState').mockReturnValue({
      state: 'in-game',
      theme: 'classic',
      game: {
        state: 'lost',
        board: {
          size: 2,
          grid: [{ value: 2 }, { value: 4 }, { value: 4 }, { value: 2 }],
        },
      },
    })

    const { container } = render(<App />)

    expect(screen.getByText('Game Over')).toBeInTheDocument()
    // the screen includes the last board state
    expect(container.getElementsByClassName('board').length).toBe(1)
  })
})
