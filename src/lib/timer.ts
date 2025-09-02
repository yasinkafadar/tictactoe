import type { GameState } from '../engine/types'

export interface TimerState {
  elapsed: number
  remaining: number
  isRunning: boolean
  formatted: string
}

/**
 * Calculates elapsed time from game start
 */
export function getElapsedTime(gameState: GameState): number {
  return Date.now() - gameState.startTime
}

/**
 * Calculates remaining time until time cap
 */
export function getRemainingTime(gameState: GameState, timeCapMs: number = 180000): number {
  const elapsed = getElapsedTime(gameState)
  return Math.max(0, timeCapMs - elapsed)
}

/**
 * Formats time in mm:ss.t format (minutes:seconds.tenths)
 */
export function formatTime(timeMs: number): string {
  const totalSeconds = Math.max(0, timeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const tenths = Math.floor((totalSeconds % 1) * 10)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`
}

/**
 * Gets complete timer state for a game
 */
export function getTimerState(gameState: GameState, timeCapMs: number = 180000): TimerState {
  const elapsed = getElapsedTime(gameState)
  const remaining = getRemainingTime(gameState, timeCapMs)
  const isRunning = gameState.result === 'ongoing'
  
  // Show remaining time while running, elapsed time when finished
  const displayTime = isRunning ? remaining : elapsed
  const formatted = formatTime(displayTime)
  
  return {
    elapsed,
    remaining,
    isRunning,
    formatted
  }
}

/**
 * Hook-like function for timer updates (returns current state)
 * To be used with React effects or intervals
 */
export function useTimer(gameState: GameState, timeCapMs?: number): TimerState {
  return getTimerState(gameState, timeCapMs)
}
