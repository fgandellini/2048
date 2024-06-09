import * as b from './board'
import type { Board, Direction, Tile } from './board'

/**
 * The Game Manager
 * --------------------------------------------------
 *
 * This module contains the game manager, which is responsible
 * for managing the state of the game.
 *
 * It exposes a functions to
 * - start a new game
 * - transition the game from a given state to the next, given a player action.
 *
 * The game state is immutable, every transition returns a new game state.
 * This is useful for tracking the game state and history.
 */

/**
 * Types
 * --------------------------------------------------
 */

/**
 * The state of a game
 */
export type GameState = {
  state: 'playing' | 'won' | 'lost'
  board: Board
}

/**
 * Actions that can be performed by the player
 * to transition the game state
 */
type Action = { type: 'move'; direction: Direction }

/**
 * Game Manager
 * --------------------------------------------------
 */

/**
 * Starts a new game
 * @param size the size of the board
 * @returns the initial game state
 * @note the game starts with a tile of value 2 placed randomly on the board
 */
export const startGame = (size: number, obstacles: number): GameState => ({
  board: setRandomTile(b.createEmptyBoard(size), b.createTile(2))!,
  state: 'playing',
})

/**
 * Transitions the game state given a player action
 * @param state the current game state
 * @param action the player action
 * @returns the next game state
 */
export const transition = (state: GameState, action: Action): GameState => {
  // if we're not playing, we don't need to do anything
  if (state.state !== 'playing') {
    return state
  }

  switch (action.type) {
    case 'move':
      return move(state, action.direction)
    default:
      return state
  }
}

/**
 * Gets the indexes of the empty tiles on the board
 * @param board the board to get the empty tiles from
 * @returns an array of indexes of the empty tiles
 */
const getEmptyTileIndexes = (board: Board) =>
  board.grid.reduce<number[]>(
    (indexes, tile, index) => (tile === null ? [...indexes, index] : indexes),
    [],
  )

/**
 * Sets a random tile on the board
 * @param board the board to set the tile on
 * @param tile the tile to set
 * @returns the board with the tile set in a random empty cell or null if there are no empty cells
 */
const setRandomTile = (board: Board, tile: Tile): Board | null => {
  const emptyTileIndexes = getEmptyTileIndexes(board)
  if (emptyTileIndexes.length === 0) {
    return null
  }

  const selectedIndex = Math.floor(Math.random() * emptyTileIndexes.length)
  const insertIndex = emptyTileIndexes[selectedIndex]
  if (insertIndex === undefined) {
    return null
  }

  return b.setTile(board, insertIndex, tile)
}

/**
 * Moves the board in a given direction
 * @param state the current game state
 * @param direction the direction to move the board
 * @returns the next game state
 * @note the game can be in one of the following states:
 * - playing: the player can keep playing
 * - won: the board includes a 2048 tile, the player has won the game
 * - lost: there are no empty cells nor avilable moves, the player has lost the game
 */
const move = (state: GameState, direction: Direction): GameState => {
  // the player lost if no move is possible
  if (!b.canMove(state.board)) {
    return { board: state.board, state: 'lost' }
  }

  // the player can move, we need to update the board
  const newBoard = b.move(state.board, direction)

  // the board didn't change, it's a no-op move
  // we can return the same state
  if (b.isBoardEqual(newBoard, state.board)) {
    return state
  }

  // the board has changed, we need to update the state

  // the player won if the board includes a 2048 tile
  if (b.hasTile(newBoard, { value: 2048 })) {
    return { board: newBoard, state: 'won' }
  }

  // the player can keep playing,
  // we need to add a new tile to the board
  const newBoardWithRandomTile = setRandomTile(newBoard, b.createTile(1))

  // this should never happen, but just in case
  if (newBoardWithRandomTile === null) {
    return { board: newBoard, state: 'lost' }
  }

  return {
    board: newBoardWithRandomTile,
    state: 'playing',
  }
}
