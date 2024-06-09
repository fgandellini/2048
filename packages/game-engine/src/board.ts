import { coordsToIndex } from './converters'

/**
 * The Board
 * --------------------------------------------------
 *
 * The board is a grid of tiles with a given size.
 * The size is the number of cells in a row or column.
 *
 * The grid is a flat array of tiles, where each tile is either a Tile or null.
 *
 * The grid is indexed from left to right, top to bottom.
 * The origin (x:0,y:0) is in the top left corner,
 * here's a visual representation of the coordinate system:
 *
 *     x --->
 *
 * y   +-----+-----+-----+-----+
 * |   | 0,0 | 1,0 | 2,0 | 3,0 |
 * |   +-----+-----+-----+-----+
 * v   | 0,1 | 1,1 | 2,1 | 3,1 |
 *     +-----+-----+-----+-----+
 *     | 0,2 | 1,2 | 2,2 | 3,2 |
 *     +-----+-----+-----+-----+
 *     | 0,3 | 1,3 | 2,3 | 3,3 |
 *     +-----+-----+-----+-----+
 *
 * The board exposes the following functionalities:
 * - create an empty board with a given size
 * - move the board in a given direction
 * - check if two boards are equal
 * - check if the board includes a tile with a given Tile or empty cells
 * - check if the board can move in any direction
 *
 * The board is immutable, every operation returns a new board.
 * This is useful for tracking the board state and history.
 *
 * This module also includes functionalities to manage Tiles:
 * - create a tile with a given value
 * - get a tile from a given position
 * - set a tile at a given position
 */

/**
 * Types
 * --------------------------------------------------
 */

/**
 * Coordinates of a cell in the board
 */
export type Coords = { x: number; y: number }

/**
 * A Tile is a cell in the board with a value
 */
export type Tile = { value: number }

/**
 * An obstacle is a cell in the board that won't move
 */
export type Obstacle = { obstacle: true }

/**
 * A Board is a grid of tiles
 *
 * The `size` parametere is guaranteed to be coherend
 * with grid array length (size x size) by construction
 */
export type Board = {
  size: number
  grid: ReadonlyArray<Tile | Obstacle | null>
}

/**
 * The direction of a board move
 */
export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Board
 * --------------------------------------------------
 */

/**
 * Creates an empty board with a given size
 * @param size the size of the board
 * @returns the board
 * @throws if the size is not a positive integer
 */
export const createEmptyBoard = (size: number): Board => {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`Invalid size (size=${size})`)
  }

  const grid = new Array(size ** 2).fill(null)
  return { size, grid }
}

/**
 * Moves the board in a given direction
 * @param board the board to move
 * @param direction the direction to move the board to
 * @returns the moved board
 */
export const move = (board: Board, direction: Direction): Board =>
  // calculates a set of steps to iterate over the board
  calulateSteps(board, direction)
    // moves the tiles in the given direction
    .reduce((newBoard, currentCoords) => {
      // takes the tile from the current position
      const tile = getCell(newBoard, currentCoords)
      if (!isTile(tile)) {
        return newBoard
      }

      // finds the farthest position in the given direction
      // and the very next tile in the same direction (if any)
      const { farthest, next } = findFarthestPosition(
        newBoard,
        currentCoords,
        direction,
      )

      // in case we have a "next" tile, we merge the current tile with it
      // otherwise we move the current tile to the farthest position
      return next !== null && isTileEqual(next.tile, tile)
        ? mergeTileTo(newBoard, currentCoords, farthest, next)
        : moveTileTo(newBoard, currentCoords, farthest)
    }, board)

/**
 * Checks if two boards are equal
 * @param board1 the first board to compare
 * @param board2 the second board to compare
 * @returns true if the boards are equal, false otherwise
 */
export const isBoardEqual = (board1: Board, board2: Board): boolean => {
  if (board1.size !== board2.size) {
    return false
  }

  if (board1.grid.length !== board2.grid.length) {
    return false
  }

  const grid1 = board1.grid
  const grid2 = board2.grid

  for (let i = 0; i < grid1.length; i++) {
    if (!isCellEqual(grid1[i]!, grid2[i]!)) {
      return false
    }
  }

  return true
}

/**
 * Checks if the board includes a tile with a given tile
 * @param board the board to check
 * @param tile the tile to look for
 * @returns true if the board includes a tile with the given value, false otherwise
 */
export const hasTile = (board: Board, tile: Tile): boolean =>
  board.grid.some(t => isTile(t) && isTileEqual(t, tile))

/**
 * Checks if the board can move in any direction
 * @param board the board to check
 * @returns true if the board can move in any direction, false otherwise
 */
export const canMove = (board: Board): boolean => {
  // if there are empty cells, we can move
  if (hasEmpty(board)) {
    return true
  }

  // if there are adjacent cells with the same value, we can move
  const directions: Array<Direction> = ['up', 'down', 'left', 'right']
  return directions.some(direction => {
    const newBoard = move(board, direction)
    return hasEmpty(newBoard)
  })
}

/**
 * Finds the farthest position in a given direction
 * @param board the board to look for the farthest position
 * @param cell the starting cell
 * @param direction the direction to look for
 * @returns
 * the farthest position and the next tile in the same direction (if any).
 * The next tile is useful for the merging logic.
 * @warning
 * This function is only exported for testing purposes,
 * it's not supposed to be used standalone.
 */
export const findFarthestPosition = (
  board: Board,
  cell: Coords,
  direction: Direction,
): { farthest: Coords; next: { tile: Tile; coords: Coords } | null } => {
  let previous: Coords = cell
  let next: Coords = cell

  do {
    previous = next
    next = step(previous, direction)
  } while (isCellInsideBoard(next, board.size) && isEmpty(getCell(board, next)))

  return {
    farthest: previous,
    // handy for the merging logic
    next:
      isCellInsideBoard(next, board.size) && isTile(getCell(board, next))
        ? {
            tile: getCell(board, next) as Tile,
            coords: next,
          }
        : null,
  }
}

/**
 * Type guard to check if a cell is a Tile
 * @param cell the cell to check
 * @returns true if the cell is a Tile, false otherwise
 */
export const isTile = (cell: Tile | Obstacle | null): cell is Tile =>
  cell !== null && 'value' in cell

/**
 * Type guard to check if a cell is empty
 */
export const isEmpty = (cell: Tile | Obstacle | null): cell is null =>
  cell === null

/**
 * Type guard to check if a cell is an Obstacle
 * @param cell the cell to check
 * @returns true if the cell is an Obstacle, false otherwise
 */
export const isObstacle = (cell: Tile | Obstacle | null): cell is Obstacle =>
  cell !== null && 'obstacle' in cell && cell.obstacle === true

/**
 * Checks if the board has empty cells
 * @param board the board to check
 * @returns true if the board has emptycells, false otherwise
 */
const hasEmpty = (board: Board): boolean => board.grid.some(isEmpty)

/**
 * Checks if two cells are equal
 * @param cell1 the first cell to compare
 * @param cell2 the second cell to compare
 * @returns true if the cells are equal, false otherwise
 */
const isCellEqual = (
  cell1: Tile | Obstacle | null,
  cell2: Tile | Obstacle | null,
): boolean => {
  if (isEmpty(cell1)) {
    return isEmpty(cell2)
  }

  if (isEmpty(cell2)) {
    return false
  }

  if (isObstacle(cell1)) {
    return isObstacle(cell2)
  }

  if (isObstacle(cell2)) {
    return false
  }

  if (isTile(cell1) && isTile(cell2)) {
    return isTileEqual(cell1, cell2)
  }

  return false
}

/**
 * Checks if two tiles are equal, taking null values into account
 * @param tile1 the first tile to compare
 * @param tile2 the second tile to compare
 * @returns true if the tiles are equal, false otherwise
 */
const isTileEqual = (tile1: Tile | null, tile2: Tile | null): boolean =>
  tile1 === null
    ? tile2 === null
    : tile2 !== null && tile1.value === tile2.value

/**
 * Calculates the steps to iterate over the board in a given direction
 * @param board the board to calculate the steps for
 * @param direction the direction to calculate the steps for
 * @returns the array of coordinates to iterate over the board.
 * @example
 * ```
 * iterate right: [
 *   (0,0), (0,1), (0,2),
 *   (1,0), (1,1), (1,2),
 *   (2,0), (2,1), (2,2),
 * ]
 *
 * iterate left: [
 *   (2,0), (2,1), (2,2),
 *   (1,0), (1,1), (1,2),
 *   (0,0), (0,1), (0,2),
 * ]
 *
 * iterate down: [
 *   (2,0), (1,0), (0,0),
 *   (2,1), (1,1), (0,1),
 *   (2,2), (1,2), (0,2),
 * ]
 *
 * iterate up: [
 *   (2,2), (1,2), (0,2),
 *   (2,1), (1,1), (0,1),
 *   (2,0), (1,0), (0,0),
 * ]
 * ```
 */
const calulateSteps = (
  board: Board,
  direction: Direction,
): ReadonlyArray<Coords> => {
  const indexes = new Array(board.size).fill(null).map((_, index) => index)

  const xs = direction === 'right' ? indexes : indexes.reverse()
  const ys = direction === 'down' ? indexes : indexes.reverse()

  // const xs = direction === 'left' ? indexes : indexes.reverse()
  // const ys = direction === 'up' ? indexes : indexes.reverse()

  return ys.map(y => xs.map(x => ({ x, y }))).flat()
}

/**
 * Steps a cell in a given direction
 * @param cell the cell to step from
 * @param direction the direction to step to
 * @returns the stepped cell coordinates
 */
const step = (cell: Coords, direction: Direction): Coords => {
  switch (direction) {
    case 'up':
      return { x: cell.x, y: cell.y - 1 }
    case 'down':
      return { x: cell.x, y: cell.y + 1 }
    case 'left':
      return { x: cell.x - 1, y: cell.y }
    case 'right':
      return { x: cell.x + 1, y: cell.y }
  }
}

/**
 * Checks if a cell is inside the board
 * @param cell the cell to check
 * @param size the size of the board
 * @returns true if the cell is inside the board, false otherwise
 */
const isCellInsideBoard = (cell: Coords, size: number): boolean =>
  cell.x >= 0 && cell.y >= 0 && cell.x < size && cell.y < size

/**
 * Creates a tile with a given value
 * @param value the value for the tile
 * @returns the tile
 */
export const createTile = (value: number): Tile => ({ value })

/**
 * Creates an obstacle
 * @returns the obstacle
 */
export const createObstacle = (): Obstacle => ({ obstacle: true })

/**
 * Moves a tile from a given position to another
 * @param board the board to move the tile from
 * @param from the position to move the tile from
 * @param to the position to move the tile to
 * @returns the new board
 * @throws if any position is out of bound (because it uses getTile and setTile)
 */
const moveTileTo = (board: Board, from: Coords, to: Coords): Board => {
  const tile = getCell(board, from)
  if (!isTile(tile)) {
    return board
  }

  const newBoard = setCell(board, from, null)
  return setCell(newBoard, to, tile)
}

/**
 * Merges a tile from a given position to another
 * @param board the board to merge the tile from
 * @param from the position to merge the tile from (cleared because of the merge)
 * @param farthest the farthest free cell (cleared because of the merge)
 * @param to the position to merge the tile to (a new tile with double value will be created here)
 * @returns the new board
 * @throws if any position is out of bound (because it uses setTile)
 */
const mergeTileTo = (
  board: Board,
  from: Coords,
  farthest: Coords,
  to: {
    tile: Tile
    coords: Coords
  },
): Board => {
  let newBoard = setCell(board, from, null)
  newBoard = setCell(newBoard, farthest, null)
  return setCell(newBoard, to.coords, createTile(to.tile.value * 2))
}

/**
 * Cells
 * --------------------------------------------------
 */

/**
 * Gets a cell from a given position
 * @param board the board to lookup the cell from
 * @param position the position (either index or coordinates)
 * @returns the cell at the given position
 * @throws if the position is out of bound
 */
export const getCell = (
  board: Board,
  position: number | Coords,
): Tile | Obstacle | null => {
  const index =
    typeof position === 'number'
      ? position
      : coordsToIndex(board.size, position)

  if (index < 0 || index >= board.grid.length) {
    throw new Error(`Out of bound (board=${board.grid} index=${index})`)
  }

  return board.grid[index]!
}

/**
 * Sets a cell at a given position
 * @param board the board to set the cell to
 * @param position the position (either index or coordinates)
 * @param cell the cell to set
 * @returns the new board
 * @throws if the position is out of bound
 */
export const setCell = (
  board: Board,
  position: number | Coords,
  cell: Tile | Obstacle | null,
): Board => {
  const index =
    typeof position === 'number'
      ? position
      : coordsToIndex(board.size, position)

  if (index < 0 || index >= board.grid.length) {
    throw new Error(`Out of bound (board=${board.grid} index=${index})`)
  }

  const grid = [
    ...board.grid.slice(0, index),
    cell,
    ...board.grid.slice(index + 1),
  ]

  return { size: board.size, grid }
}
