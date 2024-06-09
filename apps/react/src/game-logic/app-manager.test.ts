import { appReducer, getInitialState } from './app-manager'

describe('app-manager (app state machine)', () => {
  test('Starts in the welcome state', async () => {
    const initialState = getInitialState()

    expect(initialState.state).toBe('welcome')
  })

  test('A game-started action transitions to the in-game state', async () => {
    const initialState = getInitialState()

    const newState = appReducer(initialState, {
      type: 'game-started',
      size: 2,
      theme: 'classic',
    })

    expect(newState).toEqual({
      state: 'in-game',
      theme: 'classic',
      game: {
        state: 'playing',
        board: {
          size: 2,
          grid: expect.arrayContaining([{ value: 2 }]),
        },
      },
    })
  })

  test('A moved action updates the board and keeps the game in in-game state', async () => {
    const initialState = {
      state: 'in-game' as const,
      theme: 'classic' as const,
      game: {
        state: 'playing' as const,
        board: {
          size: 2,
          grid: [{ value: 2 }, null, null, null],
        },
      },
    }

    const newState = appReducer(initialState, {
      type: 'moved',
      direction: 'right',
    })

    expect(newState).toEqual({
      state: 'in-game' as const,
      theme: 'classic' as const,
      game: {
        state: 'playing' as const,
        board: {
          size: 2,
          grid: expect.arrayContaining([{ value: 2 }, { value: 1 }]),
        },
      },
    })
  })

  test('A restarted action transitions to the welcome state', async () => {
    const initialState = {
      state: 'in-game' as const,
      theme: 'classic' as const,
      game: {
        state: 'playing' as const,
        board: {
          size: 2,
          grid: [{ value: 2 }, null, null, null],
        },
      },
    }

    const newState = appReducer(initialState, {
      type: 'restarted',
    })

    expect(newState).toEqual({ state: 'welcome' })
  })
})
