import type { Board, Obstacle, Tile } from './board'
import { indexToCoords } from './converters'

export type Matrix<T> = Array<Array<T>>

/**
 * Render a cell to a number (if tile), 'X' (if obstacle) or null (if empty)
 * @param cell the cell to render
 * @returns a number, 'X' or null
 */
const renderCell = (cell: Tile | Obstacle | null): number | 'X' | null => {
  if (cell === null) return null
  if ('obstacle' in cell) return 'X'
  return cell.value
}

/**
 * Convert a board to an array of tile values (or null)
 * @param board the board to convert
 * @returns an array of tile values (or null)
 */
export const boardToArray = (board: Board): Array<number | 'X' | null> =>
  board.grid.map(renderCell)

/**
 * Convert a board to a string
 * @param board the board to convert
 * @returns a string representation of the board
 * @example
 * const board = initBoard(3)
 * console.log(boardToString(board))
 * // null, null, null,
 * // null, 1   , null,
 * // null, null, null,
 */
export const boardToString = (board: Board): string =>
  matrixToString(boardToMatrix(board))

/**
 * Convert a board to a matrix of tile values (or null)
 * @param board the board to convert
 * @returns a matrix of tile values (or null)
 */
export const boardToMatrix = (board: Board): Matrix<number | 'X' | null> =>
  board.grid.reduce((matrix, cell, index) => {
    const { x, y } = indexToCoords(board.size, index)
    matrix[y]![x] = renderCell(cell)

    return matrix
  }, createEmptyMatrix(board.size))

/**
 * Create an empty matrix
 * @param size the size of the matrix
 * @returns an empty matrix
 */
const createEmptyMatrix = (size: number): Matrix<number | 'X' | null> =>
  new Array(size).fill(null).map(() => new Array(size).fill(null))

/**
 * Convert a matrix to string
 * @param matrix the matrix to convert
 * @returns a string representation of the matrix
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9],
 * ]
 * console.log(matrixToString(matrix))
 * // 1, 2, 3
 * // 4, 5, 6
 * // 7, 8, 9
 */
const matrixToString = (matrix: Matrix<number | 'X' | null>): string =>
  matrix
    .map(row => row.map(cell => String(cell).padEnd(4, ' ')).join(','))
    .join('\n')
