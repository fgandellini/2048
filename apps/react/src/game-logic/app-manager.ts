import { Direction, GameState, startGame, transition } from '@2048/game-engine'
import { Theme } from '../game-logic/theme-manager'

/**
 * Main App State Machine
 * 
 * The app state machine is responsible for managing the state of the app.
 * 
 * The main state transitions are:
 * - `welcome` -> `in-game` when a game is started
 * - `in-game` -> `in-game` when a move is made
 * - `in-game` -> `welcome` when the game is restarted
 * 
 * Here's a diagram to illustrate the state machine:
 *                 
                                ┌───────┐          
          ┌── game-started ───►│in-game│◄─-┐
          │                    └─┬─┬───┘   |       
          │                      │ │       |      
    ┌─────┴─┐                    │ └───── moved       
    │welcome├── restarted ───────┘     
    └───────┘                                     
 */

type AppState =
  | {
      state: 'welcome'
    }
  | {
      state: 'in-game'
      theme: Theme
      game: GameState
    }

export type GameStartedAction = {
  type: 'game-started'
  theme: Theme
  size: number
  obstacles: number
}

export type RestartedAction = {
  type: 'restarted'
}

export type MovedAction = {
  type: 'moved'
  direction: Direction
}

type AppActions = GameStartedAction | RestartedAction | MovedAction

/**
 * Get the initial state of the app
 * @returns The initial state
 */
export const getInitialState = (): AppState => ({
  state: 'welcome',
})

/**
 * The app reducer: given a current state of the app and an action, returns the new state
 * @param current The current state
 * @param action The action to apply
 * @returns The new state
 */
export const appReducer = (current: AppState, action: AppActions): AppState => {
  switch (current.state) {
    case 'welcome':
      switch (action.type) {
        case 'game-started':
          return {
            state: 'in-game',
            theme: action.theme,
            game: startGame(action.size, action.obstacles),
          }
        default:
          return current
      }
    case 'in-game':
      switch (action.type) {
        case 'moved':
          return {
            state: 'in-game',
            theme: current.theme,
            game: transition(current.game, {
              type: 'move',
              direction: action.direction,
            }),
          }
        case 'restarted':
          return getInitialState()
        default:
          return current
      }
    default:
      return current
  }
}
