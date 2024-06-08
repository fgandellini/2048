import type { Coords } from './board'

/**
 * Convert an index to coordinates on a board of a given size
 * @param size the size of the board
 * @param index the index to convert
 * @returns the calculated coordinates
 */
export const indexToCoords = (size: number, index: number): Coords => ({
  x: index % size,
  y: Math.floor(index / size),
})

/**
 * Convert coordinates to an index on a board of a given size
 * @param size the size of the board
 * @param coords the coordinates to convert
 * @returns the calculated index
 */
export const coordsToIndex = (size: number, { x, y }: Coords): number =>
  x + y * size
