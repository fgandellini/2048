import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Board } from './Board'

describe('Board', () => {
  test('Renders the board', async () => {
    const board = { size: 4, grid: [{ value: 2 }, null, null, null] }
    const { container } = render(<Board theme="classic" board={board} />)

    expect(container.getElementsByClassName('board').length).toBe(1)
    expect(container.getElementsByClassName('board-classic').length).toBe(1)
    expect(container.getElementsByClassName('tile').length).toBe(1)
    expect(container.getElementsByClassName('empty-cell').length).toBe(3)
  })
})
