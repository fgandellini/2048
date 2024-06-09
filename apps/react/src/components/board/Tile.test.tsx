import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Tile } from './Tile'

describe('Tile', () => {
  test('Renders a classic Tile', async () => {
    const { container } = render(<Tile theme="classic" value={2} />)

    expect(container.getElementsByClassName('tile').length).toBe(1)
    expect(container.getElementsByClassName('tile').item(0)).toHaveStyle({
      color: '#EEE4DA',
      borderColor: '#EEE4DA',
    })
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('Renders a blind Tile', async () => {
    const { container } = render(<Tile theme="blind" value={2} />)

    expect(container.getElementsByClassName('tile').length).toBe(1)
    expect(container.getElementsByClassName('tile').item(0)).toHaveStyle({
      backgroundColor: '#080808',
      borderColor: '#080808',
    })
    expect(container.getElementsByClassName('tile').item(0)).toHaveTextContent(
      '',
    )
  })

  test('Renders a plant Tile', async () => {
    const { container } = render(<Tile theme="plants" value={2} />)

    expect(container.getElementsByClassName('tile').length).toBe(1)
    expect(container.getElementsByClassName('tile').item(0)).toHaveStyle({
      borderColor: '#108e5a',
      fontSize: 'xx-large',
    })
    expect(screen.getByText('🌿')).toBeInTheDocument()
  })
})
