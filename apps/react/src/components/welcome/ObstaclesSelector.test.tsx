import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ObstaclesSelector } from './ObstaclesSelector'

describe('ObstaclesSelector', () => {
  test('Renders the obstacles selector', async () => {
    const { container } = render(
      <ObstaclesSelector obstacles={0} onSelectObstacles={() => {}} />,
    )

    expect(container.getElementsByClassName('obstacles-selector').length).toBe(
      1,
    )
    expect(screen.getByText('SELECT OBSTACLES')).toBeInTheDocument()
    expect(screen.getByText('Peaceful (none)')).toBeInTheDocument()
    expect(screen.getByText('Easy (2)')).toBeInTheDocument()
    expect(screen.getByText('Normal (4)')).toBeInTheDocument()
    expect(screen.getByText('Hard (8)')).toBeInTheDocument()
  })

  test('Allows to select the number of obstacles', async () => {
    const onSelectObstacles = jest.fn()

    render(
      <ObstaclesSelector obstacles={0} onSelectObstacles={onSelectObstacles} />,
    )

    const easy = screen.getByText('Easy (2)')
    const normal = screen.getByText('Normal (4)')
    const hard = screen.getByText('Hard (8)')

    easy.click()
    expect(onSelectObstacles).toHaveBeenCalledWith(2)

    normal.click()
    expect(onSelectObstacles).toHaveBeenCalledWith(4)

    hard.click()
    expect(onSelectObstacles).toHaveBeenCalledWith(8)
  })
})
