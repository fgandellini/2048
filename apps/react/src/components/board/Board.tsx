import { Board as GameBoard } from '@2048/game-engine/src/board'
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
 * The board is rendered as a grid of tiles.
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
      {board.grid.map((tile, index) =>
        tile !== null ? (
          <Tile key={index} theme={theme} value={tile.value} />
        ) : (
          <EmptyTile key={index} />
        ),
      )}
    </div>
  )
}

const EmptyTile = () => <div className="empty-tile" />
