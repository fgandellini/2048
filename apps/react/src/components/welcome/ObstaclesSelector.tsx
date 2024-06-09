type ObstaclesSelectorProps = {
  obstacles: number
  onSelectObstacles: (obstacles: number) => void
}

/**
 * The obstacles selector
 *
 * It's responsible for rendering the obstacles selector.
 * The obstacles selector allows the player to select the obstacles to include in the board.
 *
 * The user can choose how many obstacles to add to the board, the options are: none, 2, 4, or 8.
 */
export const ObstaclesSelector = ({
  obstacles,
  onSelectObstacles,
}: ObstaclesSelectorProps) => (
  <div className="nes-container with-title is-dark obstacles-selector">
    <h3 className="title">SELECT OBSTACLES</h3>
    <label htmlFor="obstacles-0">
      <input
        type="radio"
        className="nes-radio is-dark"
        id="obstacles-0"
        name="obstacles"
        checked={obstacles === 0}
        onChange={() => onSelectObstacles(0)}
      />
      <span>Peaceful (none)</span>
    </label>
    <label htmlFor="obstacles-2">
      <input
        type="radio"
        className="nes-radio is-dark"
        id="obstacles-2"
        name="obstacles"
        checked={obstacles === 2}
        onChange={() => onSelectObstacles(2)}
      />
      <span>Easy (2)</span>
    </label>
    <label htmlFor="obstacles-4">
      <input
        type="radio"
        className="nes-radio is-dark"
        id="obstacles-4"
        name="obstacles"
        checked={obstacles === 4}
        onChange={() => onSelectObstacles(4)}
      />
      <span>Normal (4)</span>
    </label>
    <label htmlFor="obstacles-8">
      <input
        type="radio"
        className="nes-radio is-dark"
        id="obstacles-8"
        name="obstacles"
        checked={obstacles === 8}
        onChange={() => onSelectObstacles(8)}
      />
      <span>Hard (8)</span>
    </label>
  </div>
)
