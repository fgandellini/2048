import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { EndGame } from './EndGame'

describe('EndGame', () => {
  test('Renders the end game modal', async () => {
    const { container } = render(
      <EndGame
        title="Game Over"
        message="You lost"
        cta="Try Again"
        onClose={() => {}}
      />,
    )

    expect(container.getElementsByClassName('end-game-background').length).toBe(
      1,
    )
    expect(container.getElementsByClassName('end-game').length).toBe(1)
    expect(screen.getByText('Game Over')).toBeInTheDocument()
    expect(screen.getByText('You lost')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })
})
