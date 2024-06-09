import type { Direction, GameState } from '@2048/game-engine'
import { useEffect, useReducer } from 'react'
import { appReducer, getInitialState } from '../../game-logic/app-manager'
import { Theme } from '../../game-logic/theme-manager'
import { Board } from '../board/Board'
import { WelcomeScreen } from '../welcome/WelcomeScreen'
import { EndGame } from './EndGame'
import { match } from './utils'

/**
 * Main component of the app
 *
 * It's responsible for rendering the app based on the current state
 * and handling user input that leads to state transitions.
 *
 * The app state management is fully centralized in this component,
 * transitions are performed using the useReducer hook.
 *
 * The app state machine is defined in the app-manager.ts file.
 *
 * This component also listens to keyboard events to handle user input.
 *
 * UX Flow:
 *
 * The first screen of the App is the WelcomeScreen, where the user
 * can start the game.
 * After starting the game, the BoardScreen is rendered, here the user
 * can play the game.
 * When the game is won or lost, the EndGame screen is rendered, the only available
 * action is to restart the game.
 */
export const App = () => {
  const [state, dispatch] = useReducer(appReducer, getInitialState())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection(event.key)
      if (direction !== null) {
        dispatch({ type: 'moved', direction })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="app">
      {match(state, {
        welcome: () => <WelcomeScreen onStart={dispatch} />,
        'in-game': ({ theme, game }) =>
          match(game, {
            playing: () => (
              <BoardScreen
                game={game}
                theme={theme}
                onRestart={() => dispatch({ type: 'restarted' })}
              />
            ),
            won: () => (
              <WonScreen
                game={game}
                theme={theme}
                onRestart={() => dispatch({ type: 'restarted' })}
              />
            ),
            lost: () => (
              <LostScreen
                game={game}
                theme={theme}
                onRestart={() => dispatch({ type: 'restarted' })}
              />
            ),
          }),
      })}
    </div>
  )
}

type BoardScreenProps = {
  game: GameState
  theme: Theme
  onRestart: () => void
}
const BoardScreen = ({ game, theme, onRestart }: BoardScreenProps) => (
  <>
    <Board board={game.board} theme={theme} />
    <button
      className="nes-btn is-error is-dark restart-game-button"
      onClick={onRestart}
    >
      I'm a loser
    </button>
  </>
)

type WonScreenProps = {
  game: GameState
  theme: Theme
  onRestart: () => void
}
const WonScreen = ({ game, theme, onRestart }: WonScreenProps) => (
  <>
    <Board board={game.board} theme={theme} />
    <EndGame
      title="You Won!"
      message="You won the game, congratulations!"
      cta="I want more!"
      onClose={onRestart}
    />
  </>
)

type LostScreenProps = {
  game: GameState
  theme: Theme
  onRestart: () => void
}
const LostScreen = ({ game, theme, onRestart }: LostScreenProps) => (
  <>
    <Board board={game.board} theme={theme} />
    <EndGame
      title="Game Over"
      message="You lost. Try again?"
      cta="I can do it!"
      onClose={onRestart}
    />
  </>
)

const keyToDirection = (key: string): Direction | null => {
  switch (key) {
    case 'ArrowUp':
      return 'up'
    case 'ArrowDown':
      return 'down'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowRight':
      return 'right'
    default:
      return null
  }
}
