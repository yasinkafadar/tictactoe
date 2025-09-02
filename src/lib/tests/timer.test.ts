import { describe, it, expect, vi } from 'vitest'
import { getElapsedTime, getRemainingTime, formatTime, getTimerState, useTimer } from '../timer'
import { newGame } from '../../engine/types'
import type { GameState } from '../../engine/types'

const mockStartTime = 1000000000000

describe('timer', () => {
  describe('getElapsedTime', () => {
    it('should calculate elapsed time correctly', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 5000) // 5 seconds later
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const elapsed = getElapsedTime(gameState)
      expect(elapsed).toBe(5000)
    })
  })

  describe('getRemainingTime', () => {
    it('should calculate remaining time correctly', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 60000) // 1 minute elapsed
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const remaining = getRemainingTime(gameState, 180000) // 3 minute cap
      expect(remaining).toBe(120000) // 2 minutes remaining
    })

    it('should return 0 when time cap exceeded', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 200000) // 200 seconds elapsed
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const remaining = getRemainingTime(gameState, 180000) // 180 second cap
      expect(remaining).toBe(0)
    })

    it('should use default time cap of 180000ms', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 60000)
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const remaining = getRemainingTime(gameState)
      expect(remaining).toBe(120000) // 180000 - 60000
    })
  })

  describe('formatTime', () => {
    it('should format time in mm:ss.t format', () => {
      expect(formatTime(0)).toBe('00:00.0')
      expect(formatTime(1000)).toBe('00:01.0')
      expect(formatTime(1500)).toBe('00:01.5')
      expect(formatTime(60000)).toBe('01:00.0')
      expect(formatTime(65432)).toBe('01:05.4')
      expect(formatTime(125678)).toBe('02:05.6')
    })

    it('should handle negative values as zero', () => {
      expect(formatTime(-1000)).toBe('00:00.0')
      expect(formatTime(-500)).toBe('00:00.0')
    })

    it('should round tenths correctly', () => {
      expect(formatTime(1234)).toBe('00:01.2') // 1.234 -> 1.2
      expect(formatTime(1567)).toBe('00:01.5') // 1.567 -> 1.5
      expect(formatTime(1999)).toBe('00:01.9') // 1.999 -> 1.9
    })
  })

  describe('getTimerState', () => {
    it('should return complete timer state for ongoing game', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 45000) // 45 seconds elapsed
      
      const gameState: GameState = {
        ...newGame(),
        result: 'ongoing',
        startTime: mockStartTime
      }
      
      const timerState = getTimerState(gameState, 180000)
      
      expect(timerState.elapsed).toBe(45000)
      expect(timerState.remaining).toBe(135000)
      expect(timerState.isRunning).toBe(true)
      expect(timerState.formatted).toBe('02:15.0') // Shows remaining time
    })

    it('should return timer state for finished game', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 75000) // 75 seconds elapsed
      
      const gameState: GameState = {
        ...newGame(),
        result: 'win',
        startTime: mockStartTime
      }
      
      const timerState = getTimerState(gameState, 180000)
      
      expect(timerState.elapsed).toBe(75000)
      expect(timerState.remaining).toBe(105000)
      expect(timerState.isRunning).toBe(false)
      expect(timerState.formatted).toBe('01:15.0') // Shows elapsed time
    })

    it('should use default time cap', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 30000)
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const timerState = getTimerState(gameState)
      expect(timerState.remaining).toBe(150000) // 180000 - 30000
    })
  })

  describe('useTimer', () => {
    it('should return same result as getTimerState', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 12000)
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const useTimerResult = useTimer(gameState, 180000)
      const getTimerStateResult = getTimerState(gameState, 180000)
      
      expect(useTimerResult).toEqual(getTimerStateResult)
    })

    it('should work without time cap parameter', () => {
      vi.spyOn(Date, 'now').mockReturnValue(mockStartTime + 25000)
      
      const gameState: GameState = {
        ...newGame(),
        startTime: mockStartTime
      }
      
      const result = useTimer(gameState)
      expect(result.remaining).toBe(155000) // 180000 - 25000
    })
  })
})
