import { describe, it, expect, vi } from 'vitest'
import { calculateScore, getScore, LEVEL_MULTIPLIERS, RESULT_MULTIPLIERS } from '../scoring'
import { newGame } from '../types'
import type { GameState } from '../types'

// Mock Date.now for consistent testing
const mockStartTime = 1000000000000
const mockCurrentTime = mockStartTime + 60000 // 60 seconds later

vi.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime)

describe('scoring', () => {
  describe('LEVEL_MULTIPLIERS', () => {
    it('should have correct multipliers', () => {
      expect(LEVEL_MULTIPLIERS.beginner).toBe(1.0)
      expect(LEVEL_MULTIPLIERS.moderate).toBe(1.2)
      expect(LEVEL_MULTIPLIERS.hard).toBe(1.5)
    })
  })

  describe('RESULT_MULTIPLIERS', () => {
    it('should have correct multipliers', () => {
      expect(RESULT_MULTIPLIERS.win).toBe(1.0)
      expect(RESULT_MULTIPLIERS.draw).toBe(0.5)
      expect(RESULT_MULTIPLIERS.ongoing).toBe(0.0)
    })
  })

  describe('calculateScore', () => {
    it('should calculate score for a win correctly', () => {
      const gameState: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X', // X wins
        moveCount: 10,
        startTime: mockStartTime
      }

      const breakdown = calculateScore(gameState, 'X', 'beginner')

      expect(breakdown.result).toBe('win')
      expect(breakdown.resultMultiplier).toBe(1.0)
      expect(breakdown.levelMultiplier).toBe(1.0)
      expect(breakdown.moveCount).toBe(10)
      expect(breakdown.timeSeconds).toBe(60)
      expect(breakdown.baseScore).toBe(1000) // 1000 * 1.0 * 1.0
      
      // timeMultiplier = 1 / (1 + 0.02*10 + 0.01*60) = 1 / (1 + 0.2 + 0.6) = 1 / 1.8 ≈ 0.556
      expect(breakdown.timeMultiplier).toBeCloseTo(0.556, 3)
      expect(breakdown.finalScore).toBe(Math.round(1000 * 0.556)) // Should be 556
    })

    it('should calculate score for a loss correctly', () => {
      const gameState: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'O', // O wins, so X loses
        moveCount: 5,
        startTime: mockStartTime
      }

      const breakdown = calculateScore(gameState, 'X', 'hard')

      expect(breakdown.result).toBe('ongoing') // Loss = ongoing for calculation
      expect(breakdown.resultMultiplier).toBe(0.0)
      expect(breakdown.levelMultiplier).toBe(1.5)
      expect(breakdown.finalScore).toBe(0) // Loss always gives 0 points
    })

    it('should calculate score for a draw correctly', () => {
      const gameState: GameState = {
        ...newGame(),
        result: 'draw',
        moveCount: 20,
        startTime: mockStartTime
      }

      const breakdown = calculateScore(gameState, 'X', 'moderate')

      expect(breakdown.result).toBe('draw')
      expect(breakdown.resultMultiplier).toBe(0.5)
      expect(breakdown.levelMultiplier).toBe(1.2)
      expect(breakdown.baseScore).toBe(600) // 1000 * 1.2 * 0.5
      
      // timeMultiplier = 1 / (1 + 0.02*20 + 0.01*60) = 1 / (1 + 0.4 + 0.6) = 1 / 2.0 = 0.5
      expect(breakdown.timeMultiplier).toBe(0.5)
      expect(breakdown.finalScore).toBe(300) // 600 * 0.5
    })

    it('should handle different difficulty levels', () => {
      const gameState: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 6,
        startTime: mockStartTime
      }

      const beginnerScore = calculateScore(gameState, 'X', 'beginner')
      const moderateScore = calculateScore(gameState, 'X', 'moderate')
      const hardScore = calculateScore(gameState, 'X', 'hard')

      expect(beginnerScore.levelMultiplier).toBe(1.0)
      expect(moderateScore.levelMultiplier).toBe(1.2)
      expect(hardScore.levelMultiplier).toBe(1.5)

      // Higher difficulty should give higher score for same performance
      expect(hardScore.finalScore).toBeGreaterThan(moderateScore.finalScore)
      expect(moderateScore.finalScore).toBeGreaterThan(beginnerScore.finalScore)
    })

    it('should penalize longer games (more moves)', () => {
      const fastGame: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 5,
        startTime: mockStartTime
      }

      const slowGame: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 25,
        startTime: mockStartTime
      }

      const fastScore = calculateScore(fastGame, 'X', 'beginner')
      const slowScore = calculateScore(slowGame, 'X', 'beginner')

      expect(fastScore.finalScore).toBeGreaterThan(slowScore.finalScore)
    })

    it('should penalize longer games (more time)', () => {
      const fastGame: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 10,
        startTime: mockStartTime
      }

      const slowGame: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 10,
        startTime: mockStartTime - 60000 // Started 60 seconds earlier, so it took longer
      }

      const fastScore = calculateScore(fastGame, 'X', 'beginner')
      const slowScore = calculateScore(slowGame, 'X', 'beginner')

      expect(fastScore.finalScore).toBeGreaterThan(slowScore.finalScore)
    })
  })

  describe('getScore', () => {
    it('should return just the final score number', () => {
      const gameState: GameState = {
        ...newGame(),
        result: 'win',
        currentPlayer: 'X',
        moveCount: 8,
        startTime: mockStartTime
      }

      const score = getScore(gameState, 'X', 'beginner')
      const breakdown = calculateScore(gameState, 'X', 'beginner')

      expect(score).toBe(breakdown.finalScore)
      expect(typeof score).toBe('number')
    })
  })
})
