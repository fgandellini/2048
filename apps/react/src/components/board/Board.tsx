import {
  Board as GameBoard,
  isObstacle,
  isTile,
} from '@2048/game-engine/src/board'
import { useEffect } from 'react'
import { Theme, getTheme } from '../../game-logic/theme-manager'
import { Tile } from './Tile'

type Props = {
  theme: Theme
  board: GameBoard
}

/**
 * The game board
 *
 * It's responsible for rendering the game board based on the current state.
 *
 * When the component is mounted, it sets the size of the
 * board based on the size of the grid using CSS custom properties.
 *
 * The board is rendered as a grid of tiles, obstacles or empty cells.
 * Empty tiles are used to fill the (CSS) grid.
 */

export const Board = ({ theme, board }: Props) => {
  // on component mount,
  // set the size of the board based on the size of the grid
  // using CSS custom properties
  useEffect(() => {
    document.documentElement.style.setProperty('--size', String(board.size))
  }, [])

  return (
    <div
      className={`board board-${theme}`}
      style={{ backgroundColor: getTheme(theme).boardColor }}
    >
      {board.grid.map((cell, index) => {
        if (isTile(cell)) {
          return <Tile key={index} theme={theme} value={cell.value} />
        }
        if (isObstacle(cell)) {
          return <Obstacle key={index} theme={theme} />
        }
        return <EmptyCell key={index} />
      })}
    </div>
  )
}

const EmptyCell = () => <div className="empty-cell" />

type ObstacleProps = { theme: Theme }
export const Obstacle = ({ theme }: ObstacleProps) => {
  if (theme === 'classic') {
    return <div className="obstacle obstacle-classic">X</div>
  }
  if (theme === 'plants') {
    return <div className="obstacle obstacle-plants">🪨</div>
  }
  if (theme === 'blind') {
    return <div className="obstacle obstacle-blind" />
  }
}
