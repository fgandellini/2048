type Props = {
  title: string
  message: string
  cta: string
  onClose: () => void
}

/**
 * The end game screen
 *
 * It's responsible for rendering the end game screen with a title, message, and a call to action.
 */
export const EndGame = ({ title, message, cta, onClose }: Props) => (
  <div className="end-game-background">
    <div className="nes-container is-dark end-game">
      <h1>{title}</h1>
      <p>{message}</p>
      <button className="nes-btn is-warning is-dark" onClick={onClose}>
        {cta}
      </button>
    </div>
  </div>
)
