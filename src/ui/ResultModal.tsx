import { useEffect, useRef } from 'react'
import type { GameState } from '../engine/types'
import type { DifficultyLevel } from '../engine/ai'
import type { ScoreBreakdown } from '../engine/scoring'
import { calculateScore } from '../engine/scoring'

interface ResultModalProps {
  gameState: GameState
  difficulty: DifficultyLevel
  onRematch: () => void
  onClose: () => void
  isOpen: boolean
}

export default function ResultModal({ 
  gameState, 
  difficulty, 
  onRematch, 
  onClose, 
  isOpen 
}: ResultModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || gameState.result === 'ongoing') {
    return null
  }

  const playerScore = calculateScore(gameState, 'X', difficulty)
  const opponentScore = calculateScore(gameState, 'O', difficulty)

  const getResultMessage = () => {
    if (gameState.result === 'draw') {
      return "It's a Draw!"
    }
    if (gameState.result === 'win') {
      return gameState.currentPlayer === 'X' ? 'You Win!' : 'CPU Wins!'
    }
    return 'Game Over'
  }

  const getResultClass = () => {
    if (gameState.result === 'draw') return 'draw'
    if (gameState.result === 'win' && gameState.currentPlayer === 'X') return 'win'
    return 'loss'
  }

  const ScoreDetails = ({ score, label }: { score: ScoreBreakdown; label: string }) => (
    <div className="result-modal__score-details">
      <h4 className="result-modal__score-label">{label}</h4>
      <div className="result-modal__score-breakdown">
        <div className="result-modal__score-row">
          <span>Result:</span>
          <span>{score.result} (×{score.resultMultiplier})</span>
        </div>
        <div className="result-modal__score-row">
          <span>Difficulty:</span>
          <span>{difficulty} (×{score.levelMultiplier})</span>
        </div>
        <div className="result-modal__score-row">
          <span>Moves:</span>
          <span>{score.moveCount}</span>
        </div>
        <div className="result-modal__score-row">
          <span>Time:</span>
          <span>{score.timeSeconds.toFixed(1)}s</span>
        </div>
        <div className="result-modal__score-row result-modal__score-row--total">
          <span>Score:</span>
          <span className="result-modal__score-final">{score.finalScore}</span>
        </div>
      </div>
    </div>
  )

  return (
    <dialog 
      ref={dialogRef}
      className="result-modal"
      aria-labelledby="result-title"
      aria-describedby="result-description"
    >
      <div className="result-modal__content">
        <header className="result-modal__header">
          <h2 
            id="result-title" 
            className={`result-modal__title result-modal__title--${getResultClass()}`}
          >
            {getResultMessage()}
          </h2>
        </header>

        <div className="result-modal__body">
          <div id="result-description" className="result-modal__description">
            <p>
              {gameState.result === 'draw' 
                ? 'The game ended in a tie.'
                : gameState.result === 'win' && gameState.currentPlayer === 'X'
                ? 'Congratulations! You defeated the CPU.'
                : 'The CPU won this round. Better luck next time!'
              }
            </p>
          </div>

          <div className="result-modal__scores">
            <ScoreDetails score={playerScore} label="Your Score (X)" />
            <ScoreDetails score={opponentScore} label="CPU Score (O)" />
          </div>

          {gameState.winLine && (
            <div className="result-modal__win-info">
              <p>Winning line: {gameState.winLine.map(i => i + 1).join(', ')}</p>
            </div>
          )}
        </div>

        <footer className="result-modal__footer">
          <button 
            className="result-modal__button result-modal__button--primary"
            onClick={onRematch}
            autoFocus
          >
            Play Again
          </button>
          <button 
            className="result-modal__button result-modal__button--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </dialog>
  )
}
