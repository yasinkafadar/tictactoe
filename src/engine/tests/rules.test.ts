import { describe, it, expect } from 'vitest'
import { checkWin, checkDraw, countPlayerMarks, getPlayerMarkIndices, WIN_LINES } from '../rules'
import type { Mark } from '../types'

describe('rules', () => {
  describe('WIN_LINES', () => {
    it('should contain exactly 8 winning combinations', () => {
      expect(WIN_LINES).toHaveLength(8)
    })

    it('should contain all horizontal lines', () => {
      const horizontalLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
      horizontalLines.forEach(line => {
        expect(WIN_LINES).toContainEqual(line)
      })
    })

    it('should contain all vertical lines', () => {
      const verticalLines = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
      verticalLines.forEach(line => {
        expect(WIN_LINES).toContainEqual(line)
      })
    })

    it('should contain both diagonal lines', () => {
      const diagonalLines = [[0, 4, 8], [2, 4, 6]]
      diagonalLines.forEach(line => {
        expect(WIN_LINES).toContainEqual(line)
      })
    })
  })

  describe('checkWin', () => {
    it('should detect horizontal win', () => {
      const board: Mark[] = ['X', 'X', 'X', null, null, null, null, null, null]
      const result = checkWin(board, 'X')
      expect(result.hasWin).toBe(true)
      expect(result.winLine).toEqual([0, 1, 2])
    })

    it('should detect vertical win', () => {
      const board: Mark[] = ['O', null, null, 'O', null, null, 'O', null, null]
      const result = checkWin(board, 'O')
      expect(result.hasWin).toBe(true)
      expect(result.winLine).toEqual([0, 3, 6])
    })

    it('should detect diagonal win', () => {
      const board: Mark[] = ['X', null, null, null, 'X', null, null, null, 'X']
      const result = checkWin(board, 'X')
      expect(result.hasWin).toBe(true)
      expect(result.winLine).toEqual([0, 4, 8])
    })

    it('should not detect win for incomplete line', () => {
      const board: Mark[] = ['X', 'X', null, null, null, null, null, null, null]
      const result = checkWin(board, 'X')
      expect(result.hasWin).toBe(false)
      expect(result.winLine).toBeUndefined()
    })

    it('should not detect win for opponent', () => {
      const board: Mark[] = ['X', 'X', 'X', null, null, null, null, null, null]
      const result = checkWin(board, 'O')
      expect(result.hasWin).toBe(false)
      expect(result.winLine).toBeUndefined()
    })
  })

  describe('checkDraw', () => {
    it('should detect full board draw', () => {
      const board: Mark[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
      const result = checkDraw(board, 9, 1000000000000)
      expect(result).toBe(true)
    })

    it('should detect move cap draw', () => {
      const board: Mark[] = ['X', 'O', null, null, null, null, null, null, null]
      const result = checkDraw(board, 60, 1000000000000)
      expect(result).toBe(true)
    })

    it('should detect time cap draw', () => {
      const board: Mark[] = ['X', 'O', null, null, null, null, null, null, null]
      const result = checkDraw(board, 5, Date.now() - 181000) // 181 seconds ago
      expect(result).toBe(true)
    })

    it('should not detect draw for ongoing game', () => {
      const board: Mark[] = ['X', 'O', null, null, null, null, null, null, null]
      const result = checkDraw(board, 5, Date.now())
      expect(result).toBe(false)
    })
  })

  describe('countPlayerMarks', () => {
    it('should count player marks correctly', () => {
      const board: Mark[] = ['X', 'O', 'X', null, 'O', null, 'X', null, null]
      expect(countPlayerMarks(board, 'X')).toBe(3)
      expect(countPlayerMarks(board, 'O')).toBe(2)
    })

    it('should return 0 for empty board', () => {
      const board: Mark[] = Array(9).fill(null)
      expect(countPlayerMarks(board, 'X')).toBe(0)
      expect(countPlayerMarks(board, 'O')).toBe(0)
    })
  })

  describe('getPlayerMarkIndices', () => {
    it('should return correct indices for player marks', () => {
      const board: Mark[] = ['X', 'O', 'X', null, 'O', null, 'X', null, null]
      expect(getPlayerMarkIndices(board, 'X')).toEqual([0, 2, 6])
      expect(getPlayerMarkIndices(board, 'O')).toEqual([1, 4])
    })

    it('should return empty array for player with no marks', () => {
      const board: Mark[] = ['X', 'X', 'X', null, null, null, null, null, null]
      expect(getPlayerMarkIndices(board, 'O')).toEqual([])
    })
  })
})
