import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeSelector } from './ThemeSelector'

describe('ThemeSelector', () => {
  test('Renders the theme selector', async () => {
    const { container } = render(
      <ThemeSelector theme="classic" onSelectTheme={() => {}} />,
    )

    expect(container.getElementsByClassName('theme-selector').length).toBe(1)
    expect(screen.getByText('SELECT GAME THEME')).toBeInTheDocument()
    expect(screen.getByText('Classic')).toBeInTheDocument()
    expect(screen.getByText('Plants')).toBeInTheDocument()
    expect(screen.getByText('Blind')).toBeInTheDocument()
  })

  test('Renders the classic theme', async () => {
    const { container } = render(
      <ThemeSelector theme="classic" onSelectTheme={() => {}} />,
    )

    expect(
      container.getElementsByClassName('theme-selector-description').length,
    ).toBe(1)
    expect(screen.getByText('CLASSIC')).toBeInTheDocument()
    expect(
      screen.getByText('(a.k.a. March 9th, 2014 nostalgia)'),
    ).toBeInTheDocument()
    expect(container.getElementsByClassName('tile').length).toBe(3)
    expect(container.getElementsByClassName('tile').item(0)).toHaveTextContent(
      '8',
    )
    expect(container.getElementsByClassName('tile').item(1)).toHaveTextContent(
      '8',
    )
    expect(container.getElementsByClassName('tile').item(2)).toHaveTextContent(
      '16',
    )
  })

  test('Renders the blind theme', async () => {
    const { container } = render(
      <ThemeSelector theme="blind" onSelectTheme={() => {}} />,
    )

    expect(
      container.getElementsByClassName('theme-selector-description').length,
    ).toBe(1)
    expect(screen.getByText('BLIND')).toBeInTheDocument()
    expect(screen.getByText('(only the braves)')).toBeInTheDocument()
    expect(container.getElementsByClassName('tile').length).toBe(3)
    expect(container.getElementsByClassName('tile').item(0)).toHaveTextContent(
      '',
    )
    expect(container.getElementsByClassName('tile').item(1)).toHaveTextContent(
      '',
    )
    expect(container.getElementsByClassName('tile').item(2)).toHaveTextContent(
      '',
    )
  })

  test('Renders the blind theme', async () => {
    const { container } = render(
      <ThemeSelector theme="plants" onSelectTheme={() => {}} />,
    )

    expect(
      container.getElementsByClassName('theme-selector-description').length,
    ).toBe(1)
    expect(screen.getByText('PLANTS')).toBeInTheDocument()
    expect(screen.getByText('(without zombies)')).toBeInTheDocument()
    expect(container.getElementsByClassName('tile').length).toBe(3)
    expect(container.getElementsByClassName('tile').item(0)).toHaveTextContent(
      '🍀',
    )
    expect(container.getElementsByClassName('tile').item(1)).toHaveTextContent(
      '🍀',
    )
    expect(container.getElementsByClassName('tile').item(2)).toHaveTextContent(
      '🪴',
    )
  })

  test('Allows to switch between themes', async () => {
    const onSelectTheme = jest.fn()

    render(<ThemeSelector theme="classic" onSelectTheme={onSelectTheme} />)

    const plants = screen.getByText('Plants')
    const blind = screen.getByText('Blind')

    plants.click()
    expect(onSelectTheme).toHaveBeenCalledWith('plants')

    blind.click()
    expect(onSelectTheme).toHaveBeenCalledWith('blind')
  })
})
