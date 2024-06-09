import { useCallback, useState } from 'react'
import { GameStartedAction } from '../../game-logic/app-manager'
import { Theme } from '../../game-logic/theme-manager'
import { ObstaclesSelector } from './ObstaclesSelector'
import { SizeSelector } from './SizeSelector'
import { ThemeSelector } from './ThemeSelector'

const DEFAULT_THEME = 'classic'
const DEFAULT_SIZE = 6
const DEFAULT_OBSTACLES = 0

type Props = {
  onStart: (action: GameStartedAction) => void
}

/**
 * The welcome screen
 *
 * It's responsible for rendering the welcome screen.
 * The welcome screen allows the player to select the game size and theme.
 */
export const WelcomeScreen = ({ onStart }: Props) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [obstacles, setObstacles] = useState(DEFAULT_OBSTACLES)

  const startGame = () =>
    onStart({ type: 'game-started', theme, size, obstacles })

  const canStartGame = useCallback(
    () => canPlaceObstacles(size, obstacles),
    [size, obstacles],
  )

  return (
    <div className="welcome-screen">
      <h1 className="nes-text is-dark is-centered">Welcome to 2048</h1>

      <ThemeSelector theme={theme} onSelectTheme={setTheme} />

      <SizeSelector size={size} onSelectSize={setSize} />

      <ObstaclesSelector
        obstacles={obstacles}
        onSelectObstacles={setObstacles}
      />

      <button
        className={`nes-btn is-primary is-dark ${
          !canStartGame() ? 'is-disabled' : ''
        }`}
        onClick={startGame}
        disabled={!canStartGame()}
      >
        Start Game!
      </button>
    </div>
  )
}

/**
 * Check if the number of obstacles can be placed on the board
 * @param size the size of the board
 * @param obstacles the number of obstacles to place
 * @returns true if the obstacles can be placed on the board, false otherwise
 */
const canPlaceObstacles = (size: number, obstacles: number) =>
  size ** 2 > obstacles
