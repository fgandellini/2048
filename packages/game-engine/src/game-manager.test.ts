import { describe, expect, it } from 'vitest'
import { boardToArray, boardToMatrix } from './board-debugging-utils'
import { startGame, transition } from './game-manager'
import { isBoardEqual, setTile } from './board'

describe('Game Manager', () => {
  it('Starts a game', () => {
    const game = startGame(4)
    const board = boardToArray(game.board)

    expect(board.length).toBe(16)
    expect(board.filter(tile => tile === 2).length).toBe(1)
    expect(board.filter(tile => tile === null).length).toBe(15)
    expect(game.status).toBe('playing')
  })

  it('Edge case, starts a game with a board of size 1', () => {
    const game = startGame(1)
    const board = boardToArray(game.board)

    expect(board.length).toBe(1)
    expect(board.filter(tile => tile === 2).length).toBe(1)
    expect(board.filter(tile => tile === null).length).toBe(0)
    expect(game.status).toBe('playing')
  })

  it('After a move, places a tile of value 1 in a random position', () => {
    let game = startGame(2)

    // tweak the game state to ensure
    // that the move doesn't result in a no-op
    game.board = setTile(game.board, { x: 0, y: 0 }, null)
    game.board = setTile(game.board, { x: 1, y: 0 }, { value: 2 })
    game.board = setTile(game.board, { x: 0, y: 1 }, null)
    game.board = setTile(game.board, { x: 1, y: 1 }, null)

    // prettier-ignore
    expect(boardToMatrix(game.board)).toEqual([
      [null, 2   ],
      [null, null],
    ])

    game = transition(game, { type: 'move', direction: 'left' })
    const board = boardToArray(game.board)

    expect(board.filter(tile => tile === 2).length).toBe(1) // the initial tile
    expect(board.filter(tile => tile === 1).length).toBe(1) // the new tile
    expect(board.filter(tile => tile === null).length).toBe(2) // the empty tiles
    expect(game.status).toBe('playing')
  })

  it("If the move is a no-op, doesn't a new tile", () => {
    let game = startGame(2)

    // tweak the game state to ensure
    // that the move results in a no-op
    game.board = setTile(game.board, { x: 0, y: 0 }, null)
    game.board = setTile(game.board, { x: 1, y: 0 }, { value: 2 })
    game.board = setTile(game.board, { x: 0, y: 1 }, null)
    game.board = setTile(game.board, { x: 1, y: 1 }, null)

    // prettier-ignore
    expect(boardToMatrix(game.board)).toEqual([
      [null, 2   ],
      [null, null],
    ])

    game = transition(game, { type: 'move', direction: 'right' })
    const board = boardToArray(game.board)

    expect(board.filter(tile => tile === 2).length).toBe(1) // the initial tile
    expect(board.filter(tile => tile === 1).length).toBe(0) // no new tiles
    expect(board.filter(tile => tile === null).length).toBe(3) // the empty tiles
    expect(game.status).toBe('playing')
  })

  it('Detects a win', () => {
    const game = startGame(2)

    // tweak the game state to generate a win
    game.board = setTile(game.board, { x: 0, y: 0 }, { value: 1024 })
    game.board = setTile(game.board, { x: 1, y: 0 }, null)
    game.board = setTile(game.board, { x: 0, y: 1 }, { value: 1024 })
    game.board = setTile(game.board, { x: 1, y: 1 }, null)

    expect(boardToMatrix(game.board)).toEqual([
      [1024, null],
      [1024, null],
    ])

    // move up so that the two 1024 tiles merge to a 2048 tile
    const wonGame = transition(game, { type: 'move', direction: 'up' })

    expect(wonGame.status).toBe('won')
    expect(wonGame.board.grid.some(tile => tile?.value === 2048)).toBe(true)
  })

  it('Detects a lose', () => {
    const game = startGame(2)

    // tweak the game state to generate a no move board
    game.board = setTile(game.board, { x: 0, y: 0 }, { value: 1 })
    game.board = setTile(game.board, { x: 1, y: 0 }, { value: 2 })
    game.board = setTile(game.board, { x: 0, y: 1 }, { value: 2 })
    game.board = setTile(game.board, { x: 1, y: 1 }, { value: 1 })

    // prettier-ignore
    expect(boardToMatrix(game.board)).toEqual([
      [1, 2],
      [2, 1],
    ])

    // move, the direction doesn't really matter
    const lostGame = transition(game, { type: 'move', direction: 'up' })

    expect(lostGame.status).toBe('lost')
    expect(isBoardEqual(lostGame.board, game.board)).toBe(true)
  })

  // it('Play a game', () => {
  //   console.log('init --------------------------------------------')
  //   let state = startGame(2)
  //   console.table(boardToMatrix(state.board))

  //   console.log('up --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'up' })
  //   console.table(boardToMatrix(state.board))

  //   console.log('right --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'right' })
  //   console.table(boardToMatrix(state.board))

  //   console.log('up --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'up' })
  //   console.table(boardToMatrix(state.board))

  //   console.log('right --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'right' })
  //   console.table(boardToMatrix(state.board))

  //   console.log('right --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'right' })
  //   console.table(boardToMatrix(state.board))

  //   console.log('up --------------------------------------------')
  //   state = transition(state, { type: 'move', direction: 'up' })
  //   console.table(boardToMatrix(state.board))
  // })
})
