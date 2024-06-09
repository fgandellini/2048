import { useState } from 'react'

type SizeSelectorProps = {
  size: number
  onSelectSize: (size: number) => void
}

/**
 * The size selector
 *
 * It's responsible for rendering the size selector.
 * The size selector allows the player to select the size of the board.
 *
 * The user can choose between 3 predefined sizes (4x4, 6x6, 8x8) or a custom size.
 * The custom size must be a number between 1 and 50.
 */
export const SizeSelector = ({ size, onSelectSize }: SizeSelectorProps) => {
  const isCustomSize = size !== 4 && size !== 6 && size !== 8

  return (
    <div className="nes-container with-title is-dark size-selector">
      <h3 className="title">SELECT DIFFICULY</h3>
      <label htmlFor="size-8">
        <input
          type="radio"
          className="nes-radio is-dark"
          id="size-8"
          name="size"
          checked={size === 8}
          onChange={() => onSelectSize(8)}
        />
        <span>Easy (8x8)</span>
      </label>
      <label htmlFor="size-6">
        <input
          type="radio"
          className="nes-radio is-dark"
          id="size-6"
          name="size"
          checked={size === 6}
          onChange={() => onSelectSize(6)}
        />
        <span>Normal (6x6)</span>
      </label>
      <label htmlFor="size-4">
        <input
          type="radio"
          className="nes-radio is-dark"
          id="size-4"
          name="size"
          checked={size === 4}
          onChange={() => onSelectSize(4)}
        />
        <span>Hard (4x4)</span>
      </label>
      <label htmlFor="size-custom">
        <input
          type="radio"
          className="nes-radio is-dark"
          id="size-custom"
          name="size"
          checked={isCustomSize}
          onChange={() => onSelectSize(10)}
        />
        <span>Custom</span>
        {isCustomSize && (
          <CustomSizeSelector onSelectCustomSize={onSelectSize} />
        )}
      </label>
    </div>
  )
}

type CustomSizeSelectorProps = {
  onSelectCustomSize: (size: number) => void
}

const CustomSizeSelector = ({
  onSelectCustomSize,
}: CustomSizeSelectorProps) => {
  const [customSize, setCustomSize] = useState('10')

  return (
    <>
      <input
        type="number"
        className="nes-input custom-size-input"
        value={customSize}
        onChange={({ currentTarget }) => {
          setCustomSize(currentTarget.value)

          const customSize = Number(currentTarget.value)
          if (customSize >= 1 && customSize <= 50) {
            onSelectCustomSize(customSize)
          }
        }}
      />
      x{customSize}
    </>
  )
}
