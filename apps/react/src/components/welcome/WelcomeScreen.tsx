import { useState } from 'react'
import { GameStartedAction } from '../../game-logic/app-manager'
import { Theme } from '../../game-logic/theme-manager'
import { SizeSelector } from './SizeSelector'
import { ThemeSelector } from './ThemeSelector'

const DEFAULT_SIZE = 6
const DEFAULT_THEME = 'classic'

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
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  const startGame = () => onStart({ type: 'game-started', size, theme })

  return (
    <div className="welcome-screen">
      <h1 className="nes-text is-dark is-centered">Welcome to 2048</h1>

      <ThemeSelector theme={theme} onSelectTheme={setTheme} />

      <SizeSelector size={size} onSelectSize={setSize} />

      <button className="nes-btn is-primary is-dark" onClick={startGame}>
        Start Game!
      </button>
    </div>
  )
}
