import type { GameState, Result, Player } from './types'

export type DifficultyLevel = 'beginner' | 'moderate' | 'hard'

export interface ScoreBreakdown {
  result: Result
  resultMultiplier: number
  levelMultiplier: number
  moveCount: number
  timeSeconds: number
  timeMultiplier: number
  baseScore: number
  finalScore: number
}

/**
 * Level multipliers for scoring
 */
export const LEVEL_MULTIPLIERS: Record<DifficultyLevel, number> = {
  beginner: 1.0,
  moderate: 1.2,
  hard: 1.5
}

/**
 * Result multipliers for scoring
 */
export const RESULT_MULTIPLIERS: Record<Result, number> = {
  win: 1.0,
  draw: 0.5,
  ongoing: 0.0
}

/**
 * Calculates the final score based on the exact formula:
 * Score = round(1000 * L * R * (1 / (1 + 0.02*K + 0.01*T)))
 * 
 * @param gameState - Current game state
 * @param player - Player to calculate score for ('X' or 'O')
 * @param level - Difficulty level
 * @returns Score breakdown with final score
 */
export function calculateScore(
  gameState: GameState,
  player: Player,
  level: DifficultyLevel
): ScoreBreakdown {
  // Determine result from player's perspective
  let result: Result = gameState.result
  if (gameState.result === 'win') {
    // Check if this player won
    result = gameState.currentPlayer === player ? 'win' : 'ongoing' // loss = 0
  }
  
  // Get multipliers
  const resultMultiplier = RESULT_MULTIPLIERS[result]
  const levelMultiplier = LEVEL_MULTIPLIERS[level]
  
  // Calculate time in seconds
  const timeSeconds = (Date.now() - gameState.startTime) / 1000
  
  // Apply the exact formula
  const K = gameState.moveCount
  const T = timeSeconds
  const L = levelMultiplier
  const R = resultMultiplier
  
  const timeMultiplier = 1 / (1 + 0.02 * K + 0.01 * T)
  const baseScore = 1000 * L * R
  const finalScore = Math.round(baseScore * timeMultiplier)
  
  return {
    result,
    resultMultiplier,
    levelMultiplier,
    moveCount: K,
    timeSeconds: T,
    timeMultiplier,
    baseScore,
    finalScore
  }
}

/**
 * Quick score calculation without breakdown
 */
export function getScore(
  gameState: GameState,
  player: Player,
  level: DifficultyLevel
): number {
  return calculateScore(gameState, player, level).finalScore
}
