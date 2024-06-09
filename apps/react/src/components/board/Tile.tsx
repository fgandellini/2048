import { Theme, getTheme } from '../../game-logic/theme-manager'

type Props = {
  theme: Theme
  value: number
}

/**
 * The tile component
 *
 * It's responsible for rendering a single tile based on the current theme.
 *
 * The tile is rendered differently based on the theme:
 * - classic: tile with value and colored border
 * - blind: tile with background color, no value
 * - plants: tile with border color and plant icon
 */
export const Tile = ({ theme, value }: Props) => {
  switch (theme) {
    case 'classic':
      return <ClassicTile value={value} />
    case 'blind':
      return <BlindTile value={value} />
    case 'plants':
      return <PlantTile value={value} />
  }
}

const ClassicTile = ({ value }: { value: number }) => {
  const theme = getTheme('classic')
  const color = theme.tileColors.get(value)
  return (
    <div className="tile tile-classic" style={{ color, borderColor: color }}>
      {value}
    </div>
  )
}

const BlindTile = ({ value }: { value: number }) => {
  const theme = getTheme('blind')
  const color = theme.tileColors.get(value)
  return (
    <div
      className="tile tile-blind"
      style={{ backgroundColor: color, borderColor: color }}
    ></div>
  )
}

const PlantTile = ({ value }: { value: number }) => {
  const theme = getTheme('plants')
  const color = theme.tileColors.get(value)
  return (
    <div className="tile tile-plants" style={{ borderColor: color }}>
      {theme.tileIcons.get(value)}
    </div>
  )
}
