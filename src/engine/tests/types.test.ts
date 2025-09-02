import { describe, it, expect } from 'vitest'
import { newGame, other } from '../types'

describe('types', () => {
  describe('newGame', () => {
    it('should create a new game with X as first player by default', () => {
      const game = newGame()
      expect(game.currentPlayer).toBe('X')
      expect(game.board).toEqual(Array(9).fill(null))
      expect(game.result).toBe('ongoing')
      expect(game.moveCount).toBe(0)
      expect(game.moveHistory).toEqual([])
    })

    it('should create a new game with specified first player', () => {
      const game = newGame('O')
      expect(game.currentPlayer).toBe('O')
    })

    it('should set startTime to current timestamp', () => {
      const game = newGame()
      expect(typeof game.startTime).toBe('number')
      expect(game.startTime).toBeGreaterThan(0)
    })
  })

  describe('other', () => {
    it('should return O when input is X', () => {
      expect(other('X')).toBe('O')
    })

    it('should return X when input is O', () => {
      expect(other('O')).toBe('X')
    })
  })
})
