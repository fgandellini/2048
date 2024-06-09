type Tag<T extends { state: string }> = T['state']

type MatchingState<T, S extends string> = Extract<T, { state: S }>

/**
 * Match a state with a set of cases
 * @param current The current state
 * @param cases The cases to match
 * @returns The result of the matching case
 * @example
 * const state = { state: 'welcome' }
 *
 * match(state, {
 *  welcome: () => 'Welcome!',
 * 'in-game': () => 'In game!',
 * })
 *
 * // => 'Welcome!'
 */
export const match = <State extends { state: string }, Return>(
  current: State,
  cases: { [S in Tag<State>]: (s: MatchingState<State, S>) => Return },
): Return => (cases as any)[current.state](current)
