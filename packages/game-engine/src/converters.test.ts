import { describe, expect, it } from 'vitest'
import { coordsToIndex, indexToCoords } from './converters'

describe('Converters', () => {
  it('indexToCoords converts from index to coords', () => {
    const size = 4
    expect(indexToCoords(size, 6)).toEqual({ x: 2, y: 1 })
  })

  it('coordsToIndex converts from coords to index', () => {
    const size = 4
    expect(coordsToIndex(size, { x: 2, y: 1 })).toEqual(6)
  })
})
