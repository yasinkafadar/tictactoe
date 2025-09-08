import { useState, useEffect } from 'react'
import type { GameState } from '../engine/types'
import type { DifficultyLevel } from '../engine/scoring'
import { getTimerState } from '../lib/timer'
import { calculateScore } from '../engine/scoring'
import { monitoring } from '../lib/monitoring'

interface HUDProps {
  gameState: GameState
  difficulty: DifficultyLevel
  playerScore: number
  opponentScore: number
  isCpuThinking: boolean
  onRematch: () => void
}

export default function HUD({ gameState, difficulty, playerScore, opponentScore, isCpuThinking, onRematch }: HUDProps) {
  const [timerState, setTimerState] = useState(() => getTimerState(gameState))

  // Update timer every 100ms when game is ongoing
  useEffect(() => {
    if (gameState.result !== 'ongoing') {
      setTimerState(getTimerState(gameState))
      return
    }

    const interval = setInterval(() => {
      setTimerState(getTimerState(gameState))
    }, 100)

    return () => clearInterval(interval)
  }, [gameState])

  const currentPlayerName = gameState.currentPlayer === 'X' ? 'You' : 'CPU'
  const difficultyDisplay = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)

  // Calculate current scores for display
  const playerScoreBreakdown = calculateScore(gameState, 'X', difficulty)
  const opponentScoreBreakdown = calculateScore(gameState, 'O', difficulty)

  // Game over result helpers
  const getResultMessage = () => {
    if (gameState.result === 'draw') {
      return "It's a Draw!"
    }
    if (gameState.result === 'win') {
      return gameState.currentPlayer === 'X' ? 'You Win!' : 'CPU Wins!'
    }
    return 'Game Over'
  }

  const getResultEmoji = () => {
    if (gameState.result === 'draw') return '🤝'
    if (gameState.result === 'win' && gameState.currentPlayer === 'X') return '🎉'
    return '😔'
  }

  const getResultClass = () => {
    if (gameState.result === 'draw') return 'draw'
    if (gameState.result === 'win' && gameState.currentPlayer === 'X') return 'win'
    return 'loss'
  }

  // Show game over display when game ends
  if (gameState.result !== 'ongoing') {
    return (
      <div className="hud hud--game-over">
        <div className="hud__game-over-header">
          <div className="hud__game-over-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" className="hud__logo-svg">
              <defs>
                <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#logoBg)"/>
              <line x1="10" y1="8" x2="10" y2="24" stroke="#fff" strokeWidth="2" opacity="0.9"/>
              <line x1="22" y1="8" x2="22" y2="24" stroke="#fff" strokeWidth="2" opacity="0.9"/>
              <line x1="6" y1="12" x2="26" y2="12" stroke="#fff" strokeWidth="2" opacity="0.9"/>
              <line x1="6" y1="20" x2="26" y2="20" stroke="#fff" strokeWidth="2" opacity="0.9"/>
              <line x1="7" y1="9" x2="9" y2="11" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="7" y2="11" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="10" r="2" fill="none" stroke="#3498db" strokeWidth="2.5"/>
              <line x1="19" y1="15" x2="21" y2="17" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="21" y1="15" x2="19" y2="17" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="hud__logo-text">Rolling Tic-Tac-Toe</span>
          </div>
          <div className="hud__game-over-emoji">{getResultEmoji()}</div>
          <h2 className={`hud__game-over-title hud__game-over-title--${getResultClass()}`}>
            {getResultMessage()}
          </h2>
          <p className="hud__game-over-subtitle">
            {gameState.result === 'draw' 
              ? 'The game ended in a tie.'
              : gameState.result === 'win' && gameState.currentPlayer === 'X'
              ? 'Congratulations! You defeated the CPU.'
              : 'The CPU won this round. Better luck next time!'
            }
          </p>
        </div>

        <div className="hud__game-over-scores">
          <div className="hud__score-card hud__score-card--player">
            <div className="hud__score-card-header">
              <span className="hud__score-card-label">You (X)</span>
              <span className="hud__score-card-value">{playerScore + playerScoreBreakdown.finalScore}</span>
            </div>
            <div className="hud__score-card-details">
              <div className="hud__score-detail">
                <span>Result:</span>
                <span>{playerScoreBreakdown.result} (×{playerScoreBreakdown.resultMultiplier})</span>
              </div>
              <div className="hud__score-detail">
                <span>Moves:</span>
                <span>{playerScoreBreakdown.moveCount}</span>
              </div>
              <div className="hud__score-detail">
                <span>Time:</span>
                <span>{playerScoreBreakdown.timeSeconds.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          <div className="hud__score-card hud__score-card--opponent">
            <div className="hud__score-card-header">
              <span className="hud__score-card-label">CPU (O)</span>
              <span className="hud__score-card-value">{opponentScore + opponentScoreBreakdown.finalScore}</span>
            </div>
            <div className="hud__score-card-details">
              <div className="hud__score-detail">
                <span>Result:</span>
                <span>{opponentScoreBreakdown.result} (×{opponentScoreBreakdown.resultMultiplier})</span>
              </div>
              <div className="hud__score-detail">
                <span>Moves:</span>
                <span>{opponentScoreBreakdown.moveCount}</span>
              </div>
              <div className="hud__score-detail">
                <span>Time:</span>
                <span>{opponentScoreBreakdown.timeSeconds.toFixed(1)}s</span>
              </div>
            </div>
          </div>
        </div>

        {gameState.winLine && (
          <div className="hud__win-info">
            <p>Winning line: {gameState.winLine.map(i => i + 1).join(', ')}</p>
          </div>
        )}

        <div className="hud__game-over-actions">
          <button 
            className="hud__rematch-button"
            onClick={() => {
              monitoring.trackUserInteraction('rematch', 'hud_button')
              onRematch()
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  // Regular game display
  return (
    <div className="hud">
      <div className="hud__row hud__row--main">
        <div className="hud__section">
          <h2 className="hud__title">Rolling Tic-Tac-Toe</h2>
          <p className="hud__difficulty">Difficulty: {difficultyDisplay}</p>
        </div>
        
        <div className="hud__section hud__section--timer">
          <div className="hud__timer">
            <span className="hud__timer-label">
              {timerState.isRunning ? 'Time Remaining' : 'Game Time'}
            </span>
            <span className="hud__timer-value">{timerState.formatted}</span>
          </div>
        </div>
      </div>

      <div className="hud__row hud__row--game-info">
        <div className="hud__section">
          <div className="hud__turn">
            <span className="hud__turn-label">Current Turn:</span>
            <span className="hud__turn-player">
              {isCpuThinking ? 'CPU is thinking...' : `${currentPlayerName} (${gameState.currentPlayer})`}
            </span>
          </div>
          <div className="hud__moves">
            <span className="hud__moves-label">Moves:</span>
            <span className="hud__moves-count">{gameState.moveCount}</span>
          </div>
        </div>

        <div className="hud__section hud__section--scores">
          <div className="hud__score">
            <span className="hud__score-label">You (X):</span>
            <span className="hud__score-value">{playerScore + playerScoreBreakdown.finalScore}</span>
          </div>
          <div className="hud__score">
            <span className="hud__score-label">CPU (O):</span>
            <span className="hud__score-value">{opponentScore + opponentScoreBreakdown.finalScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
