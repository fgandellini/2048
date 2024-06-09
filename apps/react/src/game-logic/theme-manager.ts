/**
 * Theme manager
 *
 * It's responsible for managing the themes of the game.
 *
 * There's almost zero logic in this module, tests are not needed.
 */

export type Theme = Themes['name']

type ClassicTheme = {
  name: 'classic'
  boardColor: string
  tileColors: Map<number, string>
}

type BlindTheme = {
  name: 'blind'
  boardColor: string
  tileColors: Map<number, string>
}

type PlantsTheme = {
  name: 'plants'
  boardColor: string
  tileColors: Map<number, string>
  tileIcons: Map<number, string>
}

export type Themes = ClassicTheme | BlindTheme | PlantsTheme

type MatchingTheme<T extends string> = Extract<Themes, { name: T }>

export const getTheme = <T extends Theme>(theme: T): MatchingTheme<T> => {
  switch (theme) {
    default:
    case 'classic':
      return {
        name: 'classic',
        boardColor: '#3C3A32',
        tileColors: new Map([
          [1, '#FFFFFF'],
          [2, '#EEE4DA'],
          [4, '#EDE0C8'],
          [8, '#F2B179'],
          [16, '#F59563'],
          [32, '#F67C5F'],
          [64, '#F65E3B'],
          [128, '#EDCF72'],
          [256, '#EDCC61'],
          [512, '#EDC850'],
          [1024, '#EDC53F'],
          [2048, '#EDC22E'],
        ]),
      } as any
    case 'blind':
      return {
        name: 'blind',
        boardColor: '#3C3A32',
        tileColors: new Map([
          [1, '#080808'],
          [2, '#101010'],
          [4, '#181818'],
          [8, '#202020'],
          [16, '#282828'],
          [32, '#303030'],
          [64, '#383838'],
          [128, '#404040'],
          [256, '#484848'],
          [512, '#505050'],
          [1024, '#585858'],
          [2048, '#606060'],
        ]),
      } as any
    case 'plants':
      return {
        name: 'plants',
        boardColor: '#3C3A32',
        tileColors: new Map([
          [1, '#119c62'],
          [2, '#108e5a'],
          [4, '#0e8151'],
          [8, '#0d7348'],
          [16, '#0b6540'],
          [32, '#0a5737'],
          [64, '#08492e'],
          [128, '#073c26'],
          [256, '#052e1d'],
          [512, '#042014'],
          [1024, '#02120c'],
          [2048, '#010503'],
        ]),
        tileIcons: new Map([
          [1, '🌱'],
          [2, '🌿'],
          [4, '☘️'],
          [8, '🍀'],
          [16, '🪴'],
          [32, '🌾'],
          [64, '🌺'],
          [128, '🌷'],
          [256, '🌹'],
          [512, '🌳'],
          [1024, '🌲'],
          [2048, '🎄'],
        ]),
      } as any
  }
}
