import { describe, expect, it } from 'vitest'
import {
  canMove,
  createEmptyBoard,
  createTile,
  findFarthestPosition,
  getCell,
  hasTile,
  isBoardEqual,
  move,
  setCell,
} from './board'
import { boardToMatrix } from './board-debugging-utils'

describe('Board', () => {
  it('Creates a empty square board of given size', () => {
    expect(boardToMatrix(createEmptyBoard(3))).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])
  })

  it('Creates tiles', () => {
    expect(createTile(2)).toEqual({ value: 2 })
  })

  it('Sets and gets tiles', () => {
    const board = createEmptyBoard(6)
    const coords = { x: 1, y: 2 }
    const tile = { value: 2 }

    const newBoard = setCell(board, coords, tile)

    expect(getCell(newBoard, coords)).toBe(tile)
  })

  it('Has tile', () => {
    const board = createEmptyBoard(6)
    const coords = { x: 1, y: 2 }
    const tile = { value: 128 }

    const newBoard = setCell(board, coords, tile)

    expect(hasTile(newBoard, tile)).toBe(true)
    expect(hasTile(newBoard, { value: 2 })).toBe(false)
  })

  it('Has tile takes obstacles into account', () => {
    let board = createEmptyBoard(6)
    const tile = { value: 128 }
    const obstacle = { obstacle: true as const }

    board = setCell(board, { x: 1, y: 2 }, tile)
    board = setCell(board, { x: 1, y: 3 }, obstacle)

    expect(hasTile(board, tile)).toBe(true)
    expect(hasTile(board, { value: 2 })).toBe(false)
  })

  it('The board can move if there is at least one reachable empty cell', () => {
    let board = createEmptyBoard(3)
    board = setCell(board, { x: 0, y: 0 }, { value: 2 })
    board = setCell(board, { x: 1, y: 0 }, { value: 4 })
    board = setCell(board, { x: 2, y: 0 }, { value: 2 })
    board = setCell(board, { x: 0, y: 1 }, null)
    board = setCell(board, { x: 1, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 4 })
    board = setCell(board, { x: 0, y: 2 }, { value: 2 })
    board = setCell(board, { x: 1, y: 2 }, { value: 4 })
    board = setCell(board, { x: 2, y: 2 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [2   , 4, 2],
      [null, 2, 4],
      [2   , 4, 2],
    ])

    expect(canMove(board)).toBe(true)
  })

  it('The board can move if there are mergeable tiles', () => {
    let board = createEmptyBoard(3)
    board = setCell(board, { x: 0, y: 0 }, { value: 2 })
    board = setCell(board, { x: 1, y: 0 }, { value: 4 })
    board = setCell(board, { x: 2, y: 0 }, { value: 4 })
    board = setCell(board, { x: 0, y: 1 }, { value: 4 })
    board = setCell(board, { x: 1, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 4 })
    board = setCell(board, { x: 0, y: 2 }, { value: 2 })
    board = setCell(board, { x: 1, y: 2 }, { value: 4 })
    board = setCell(board, { x: 2, y: 2 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [2, 4, 4],
      [4, 2, 4],
      [2, 4, 2],
    ])

    expect(canMove(board)).toBe(true)
  })

  it('The board cannot move if full and no mergeable tiles', () => {
    let board = createEmptyBoard(3)
    board = setCell(board, { x: 0, y: 0 }, { value: 2 })
    board = setCell(board, { x: 1, y: 0 }, { value: 4 })
    board = setCell(board, { x: 2, y: 0 }, { value: 2 })
    board = setCell(board, { x: 0, y: 1 }, { value: 4 })
    board = setCell(board, { x: 1, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 4 })
    board = setCell(board, { x: 0, y: 2 }, { value: 2 })
    board = setCell(board, { x: 1, y: 2 }, { value: 4 })
    board = setCell(board, { x: 2, y: 2 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [2, 4, 2],
      [4, 2, 4],
      [2, 4, 2],
    ])

    expect(canMove(board)).toBe(false)
  })

  it('The board cannot move if full (obstacles included) and no mergeable tiles', () => {
    let board = createEmptyBoard(3)
    board = setCell(board, { x: 0, y: 0 }, { value: 2 })
    board = setCell(board, { x: 1, y: 0 }, { value: 4 })
    board = setCell(board, { x: 2, y: 0 }, { value: 2 })
    board = setCell(board, { x: 0, y: 1 }, { value: 4 })
    board = setCell(board, { x: 1, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { obstacle: true })
    board = setCell(board, { x: 0, y: 2 }, { value: 2 })
    board = setCell(board, { x: 1, y: 2 }, { value: 4 })
    board = setCell(board, { x: 2, y: 2 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [2, 4, 2  ],
      [4, 2, 'X'],
      [2, 4, 2  ],
    ])

    expect(canMove(board)).toBe(false)
  })

  it('The board cannot move if there are unreachable cells', () => {
    let board = createEmptyBoard(3)
    board = setCell(board, { x: 0, y: 0 }, { obstacle: true })
    board = setCell(board, { x: 1, y: 0 }, { value: 2 })
    board = setCell(board, { x: 2, y: 0 }, { value: 1 })
    board = setCell(board, { x: 0, y: 1 }, { obstacle: true })
    board = setCell(board, { x: 1, y: 1 }, { obstacle: true })
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 0, y: 2 }, null)
    board = setCell(board, { x: 1, y: 2 }, { obstacle: true })
    board = setCell(board, { x: 2, y: 2 }, { value: 1 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      ['X' , 2   , 1],
      ['X' , 'X' , 2],
      [null, 'X' , 1],
    ])

    expect(canMove(board)).toBe(false)
  })

  it('Finds the farthest empty tile on the right', () => {
    let board = createEmptyBoard(6)
    const t1 = {
      tile: { value: 4 },
      coords: { x: 2, y: 1 },
    }
    const t2 = {
      tile: { value: 2 },
      coords: { x: 4, y: 1 },
    }
    const t3 = {
      tile: { value: 8 },
      coords: { x: 4, y: 4 },
    }

    board = setCell(board, t1.coords, t1.tile)
    board = setCell(board, t2.coords, t2.tile)
    board = setCell(board, t3.coords, t3.tile)

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 4   , null, 2   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, 8   , null],
      [null, null, null, null, null, null],
    ])

    // tile 1
    expect(findFarthestPosition(board, t1.coords, 'right')).toEqual({
      farthest: { x: 3, y: 1 },
      next: t2, // hit tile 2
    })
    expect(findFarthestPosition(board, t1.coords, 'left')).toEqual({
      farthest: { x: 0, y: 1 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t1.coords, 'up')).toEqual({
      farthest: { x: 2, y: 0 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t1.coords, 'down')).toEqual({
      farthest: { x: 2, y: 5 },
      next: null, // out of bounds
    })

    // tile 2
    expect(findFarthestPosition(board, t2.coords, 'right')).toEqual({
      farthest: { x: 5, y: 1 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t2.coords, 'left')).toEqual({
      farthest: { x: 3, y: 1 },
      next: t1, // hit tile 1
    })
    expect(findFarthestPosition(board, t2.coords, 'up')).toEqual({
      farthest: { x: 4, y: 0 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t2.coords, 'down')).toEqual({
      farthest: { x: 4, y: 3 },
      next: t3, // hit tile 3
    })

    // tile 3
    expect(findFarthestPosition(board, t3.coords, 'right')).toEqual({
      farthest: { x: 5, y: 4 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t3.coords, 'left')).toEqual({
      farthest: { x: 0, y: 4 },
      next: null, // out of bounds
    })
    expect(findFarthestPosition(board, t3.coords, 'up')).toEqual({
      farthest: { x: 4, y: 2 },
      next: t2, // hit tile 2
    })
    expect(findFarthestPosition(board, t3.coords, 'down')).toEqual({
      farthest: { x: 4, y: 5 },
      next: null, // out of bounds
    })
  })

  it('Finds the farthest empty tile on the right taking obstacles into account', () => {
    let board = createEmptyBoard(4)
    const t = {
      tile: { value: 4 },
      coords: { x: 0, y: 1 },
    }

    board = setCell(board, t.coords, t.tile)
    board = setCell(board, { x: 2, y: 1 }, { obstacle: true })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null],
      [4   , null, 'X' , null],
      [null, null, null, null],
      [null, null, null, null],
    ])

    expect(findFarthestPosition(board, t.coords, 'right')).toEqual({
      farthest: { x: 1, y: 1 },
      next: null,
    })
  })

  it('Checks if two empty boards are equal', () => {
    let board1 = createEmptyBoard(6)
    let board2 = createEmptyBoard(6)

    expect(isBoardEqual(board1, board2)).toBe(true)
  })

  it('Checks if two boards are equal', () => {
    let board1 = createEmptyBoard(6)
    board1 = setCell(board1, { x: 5, y: 0 }, { value: 2 })

    let board2 = createEmptyBoard(6)
    board2 = setCell(board2, { x: 5, y: 0 }, { value: 2 })

    expect(isBoardEqual(board1, board2)).toBe(true)
  })

  it('Checks if two boards are equal taking obstacles into account', () => {
    let board1 = createEmptyBoard(6)
    board1 = setCell(board1, { x: 5, y: 0 }, { value: 2 })

    let board2 = createEmptyBoard(6)
    board2 = setCell(board2, { x: 5, y: 0 }, { value: 2 })

    expect(isBoardEqual(board1, board2)).toBe(true)
  })

  it('Checks if two boards are different', () => {
    let board1 = createEmptyBoard(6)
    board1 = setCell(board1, { x: 5, y: 0 }, { value: 2 })

    let board2 = createEmptyBoard(6)
    board2 = setCell(board2, { x: 4, y: 0 }, { value: 2 })

    expect(isBoardEqual(board1, board2)).toBe(false)
  })

  it('Moves the board to the right', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 4 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, 4   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, 2,    4   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the right taking obstacles into account', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 0, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 4 })
    board = setCell(board, { x: 4, y: 1 }, { obstacle: true })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [2   , null, 4   , null, 'X' , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , 4   , 'X' , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the right and merges tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, 2   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the right and merges tiles taking obstacles into account', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 0, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { obstacle: true })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [2   , null, 2   , null, 'X' , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, 4   , 'X' , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the right and only merges the farthest tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 0, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [2   , null, 2   , null, 2   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
        [null, null, null, null, null, null],
        [null, null, null, null, 2   , 4   ],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ])
  })

  it('Moves the board to the left', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 4 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, 4   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'left')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [2   , 4   , null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the left and merges tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, 2   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'left')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [4   , null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board to the left and only merges the farthest tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 0, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 4, y: 1 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [2   , null, 2   , null, 2   , null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'left')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
        [null, null, null, null, null, null],
        [4   , 2   , null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ])
  })

  it('Moves the board up', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 4 }, { value: 4 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 4,    null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, 2   , null, null, null],
      [null, null, 4   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board up and merges tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 4 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, 4   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })

  it('Moves the board up and only merges the farthest tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 3 }, { value: 2 })
    board = setCell(board, { x: 2, y: 5 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
        [null, null, null, null, null, null],
        [null, null, 2   , null, null, null],
        [null, null, null, null, null, null],
        [null, null, 2   , null, null, null],
        [null, null, null, null, null, null],
        [null, null, 2   , null, null, null],
      ])

    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
        [null, null, 4   , null, null, null],
        [null, null, 2   , null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ])
  })

  it('Moves the board down', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 4 }, { value: 4 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 4,    null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'down')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, 4   , null, null, null],
    ])
  })

  it('Moves the board down and merges tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 4 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'down')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 4   , null, null, null],
    ])
  })

  it('Moves the board down and only merges the farthest tiles', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 3 }, { value: 2 })
    board = setCell(board, { x: 2, y: 5 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
    ])

    board = move(board, 'down')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, null, null],
      [null, null, 4   , null, null, null],
    ])
  })

  it('Real world scenario with multiple moves', () => {
    let board = createEmptyBoard(6)
    board = setCell(board, { x: 4, y: 0 }, { value: 4 })
    board = setCell(board, { x: 2, y: 1 }, { value: 2 })
    board = setCell(board, { x: 2, y: 3 }, { value: 2 })
    board = setCell(board, { x: 4, y: 3 }, { value: 2 })
    board = setCell(board, { x: 0, y: 4 }, { value: 2 })
    board = setCell(board, { x: 2, y: 5 }, { value: 2 })

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, 4   , null],
      [null, null, 2   , null, null, null],
      [null, null, null, null, null, null],
      [null, null, 2   , null, 2   , null],
      [2   , null, null, null, null, null],
      [null, null, 2   , null, null, null],
    ])

    board = move(board, 'right')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 2   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 2   ],
      [null, null, null, null, null, 2   ],
    ])

    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 2   ],
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 2   ],
      [null, null, null, null, null, 8   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])

    // with another move to the top,
    // the board stays the same
    board = move(board, 'up')

    // prettier-ignore
    expect(boardToMatrix(board)).toEqual([
      [null, null, null, null, null, 4   ],
      [null, null, null, null, null, 2   ],
      [null, null, null, null, null, 8   ],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ])
  })
})
