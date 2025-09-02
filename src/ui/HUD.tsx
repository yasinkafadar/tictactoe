import React, { useState, useEffect } from 'react'
import type { GameState, Player } from '../engine/types'
import type { DifficultyLevel } from '../engine/scoring'
import { getTimerState } from '../lib/timer'
import { calculateScore } from '../engine/scoring'

interface HUDProps {
  gameState: GameState
  difficulty: DifficultyLevel
  playerScore: number
  opponentScore: number
}

export default function HUD({ gameState, difficulty, playerScore, opponentScore }: HUDProps) {
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
            <span className="hud__turn-player">{currentPlayerName} ({gameState.currentPlayer})</span>
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

      {gameState.result !== 'ongoing' && (
        <div className="hud__row hud__row--status">
          <div className="hud__status">
            <span className={`hud__status-text hud__status-text--${gameState.result}`}>
              {gameState.result === 'win' 
                ? `${gameState.currentPlayer === 'X' ? 'You' : 'CPU'} Win!`
                : gameState.result === 'draw' 
                ? 'Draw!'
                : 'Game Over'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
