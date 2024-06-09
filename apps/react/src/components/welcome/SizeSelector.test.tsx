import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { SizeSelector } from './SizeSelector'

describe('SizeSelector', () => {
  test('Renders the size selector', async () => {
    const { container } = render(
      <SizeSelector size={4} onSelectSize={() => {}} />,
    )

    expect(container.getElementsByClassName('size-selector').length).toBe(1)
    expect(screen.getByText('SELECT DIFFICULY')).toBeInTheDocument()
    expect(screen.getByText('Easy (8x8)')).toBeInTheDocument()
    expect(screen.getByText('Normal (6x6)')).toBeInTheDocument()
    expect(screen.getByText('Hard (4x4)')).toBeInTheDocument()
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  test('Allows to select a given board size', async () => {
    const onSelectSize = jest.fn()
    const customSize = 10

    // By passing a custom size, enable the selection of the default sizes,
    // the click would result in a no-op otherwise.
    render(<SizeSelector size={customSize} onSelectSize={onSelectSize} />)

    const easy = screen.getByText('Easy (8x8)')
    const normal = screen.getByText('Normal (6x6)')
    const hard = screen.getByText('Hard (4x4)')

    easy.click()
    expect(onSelectSize).toHaveBeenCalledWith(8)

    normal.click()
    expect(onSelectSize).toHaveBeenCalledWith(6)

    hard.click()
    expect(onSelectSize).toHaveBeenCalledWith(4)
  })

  test('Allows to select a custom board size', async () => {
    const onSelectSize = jest.fn()

    render(<SizeSelector size={4} onSelectSize={onSelectSize} />)

    const custom = screen.getByText('Custom')

    custom.click()
    expect(onSelectSize).toHaveBeenCalledWith(10)
  })

  test('Allows to insert a custom board size', async () => {
    const onSelectSize = jest.fn()

    const { container } = render(
      <SizeSelector size={10} onSelectSize={onSelectSize} />,
    )
    const customSizeInput = container
      .getElementsByClassName('custom-size-input')
      .item(0)

    expect(customSizeInput).toHaveDisplayValue('10')

    fireEvent.change(customSizeInput as Element, { target: { value: '23' } })
    expect(customSizeInput).toHaveDisplayValue('23')
    expect(onSelectSize).toHaveBeenCalledWith(23)
  })

  test('Custom size input does not trigger in case of invalid input', async () => {
    const onSelectSize = jest.fn()

    const { container } = render(
      <SizeSelector size={10} onSelectSize={onSelectSize} />,
    )
    const customSizeInput = container
      .getElementsByClassName('custom-size-input')
      .item(0)

    fireEvent.change(customSizeInput as Element, { target: { value: '' } })
    expect(customSizeInput).toHaveDisplayValue('')
    expect(onSelectSize).not.toHaveBeenCalled()
  })
})
