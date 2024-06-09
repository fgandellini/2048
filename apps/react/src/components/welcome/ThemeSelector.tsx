import { ReactNode } from 'react'
import { Theme } from '../../game-logic/theme-manager'
import { Tile } from '../board/Tile'

const arrows = new URL('../../assets/arrows.svg', import.meta.url).toString()

type SizeSelectorProps = {
  theme: Theme
  onSelectTheme: (style: Theme) => void
}

/**
 * The theme selector
 *
 * It's responsible for rendering the theme selector.
 * The theme selector allows the player to select the theme
 * of the game and provides a description of the game rules.
 *
 * The user can choose between 3 predefined themes (classic, plants, blind).
 *
 * The classic theme is the original 2048 game.
 * The plants theme uses plants instead of numbers.
 * The blind theme has no numbers on the tiles and hard to distinguish color tiles.
 */
export const ThemeSelector = ({ theme, onSelectTheme }: SizeSelectorProps) => {
  return (
    <div className="nes-container with-title is-dark theme-selector">
      <h3 className="title">SELECT GAME THEME</h3>

      <div className="theme-selector-input">
        <label htmlFor="theme-classic">
          <input
            type="radio"
            className="nes-radio is-dark"
            id="theme-classic"
            name="game-style"
            checked={theme === 'classic'}
            onChange={() => onSelectTheme('classic')}
          />
          <span>Classic</span>
        </label>

        <label htmlFor="theme-plants">
          <input
            type="radio"
            className="nes-radio is-dark"
            id="theme-plants"
            name="game-style"
            checked={theme === 'plants'}
            onChange={() => onSelectTheme('plants')}
          />
          <span>Plants</span>
        </label>

        <label htmlFor="theme-blind">
          <input
            type="radio"
            className="nes-radio is-dark"
            id="theme-blind"
            name="game-style"
            checked={theme === 'blind'}
            onChange={() => onSelectTheme('blind')}
          />
          <span>Blind </span>
        </label>
      </div>

      <Description theme={theme}>
        {theme === 'classic' && (
          <div>
            <div>CLASSIC</div>
            <div>(a.k.a. March 9th, 2014 nostalgia)</div>
          </div>
        )}
        {theme === 'plants' && (
          <div>
            <div>PLANTS</div>
            <div>(without zombies)</div>
          </div>
        )}
        {theme === 'blind' && (
          <div>
            <div>BLIND</div>
            <div>(only the braves)</div>
          </div>
        )}
      </Description>
    </div>
  )
}

type DescriptionProps = {
  theme: Theme
  children?: ReactNode
}
const Description = ({ theme, children }: DescriptionProps) => {
  return (
    <div className="theme-selector-description">
      <img className="arrows-icon" src={arrows} alt="Arrow controls" />
      <div className="theme-selector-instructions">
        <div className={`title title-${theme}`}>{children}</div>
        <p>
          Use your <strong>arrow keys</strong> to move the tiles.
        </p>
        <p>
          When two tiles with the same number touch, they{' '}
          <strong>merge into one!</strong>
        </p>
        <p>
          Join the <strong>2048 tile</strong> to win the game!
        </p>
      </div>
      <div className="theme-selector-tile-example">
        <Tile value={8} theme={theme} />
        <Tile value={8} theme={theme} />
        <div className="equal-sign">=</div>
        <Tile value={16} theme={theme} />
      </div>
    </div>
  )
}
