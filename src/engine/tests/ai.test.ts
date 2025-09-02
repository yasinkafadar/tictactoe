import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLegalMoves,
  findImmediateWin,
  findImmediateBlock,
  calculateHeuristic,
  evaluateMove,
  getBeginnerMove,
  getModerateMove,
  getAIMove
} from '../ai'
import { newGame } from '../types'
import type { GameState } from '../types'

describe('AI', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = newGame()
  })

  describe('getLegalMoves', () => {
    it('should return all empty cells', () => {
      const moves = getLegalMoves(gameState)
      expect(moves).toHaveLength(9)
      expect(moves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    })

    it('should return only empty cells when board has marks', () => {
      gameState.board[0] = 'X'
      gameState.board[4] = 'O'
      
      const moves = getLegalMoves(gameState)
      expect(moves).toHaveLength(7)
      expect(moves).not.toContain(0)
      expect(moves).not.toContain(4)
    })

    it('should return empty array for full board', () => {
      gameState.board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
      
      const moves = getLegalMoves(gameState)
      expect(moves).toHaveLength(0)
    })
  })

  describe('findImmediateWin', () => {
    it('should find horizontal win opportunity', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      
      const winMove = findImmediateWin(gameState.board, 'X')
      expect(winMove).toBe(2)
    })

    it('should find vertical win opportunity', () => {
      gameState.board = ['X', 'O', null, 'X', 'O', null, null, 'O', null]
      
      const winMove = findImmediateWin(gameState.board, 'X')
      expect(winMove).toBe(6)
    })

    it('should find diagonal win opportunity', () => {
      gameState.board = ['X', 'O', null, 'O', 'X', null, null, 'O', null]
      
      const winMove = findImmediateWin(gameState.board, 'X')
      expect(winMove).toBe(8)
    })

    it('should return null when no win opportunity', () => {
      gameState.board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
      
      const winMove = findImmediateWin(gameState.board, 'X')
      expect(winMove).toBeNull()
    })

    it('should exclude specified cell', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      
      const winMove = findImmediateWin(gameState.board, 'X', 2)
      expect(winMove).toBeNull()
    })
  })

  describe('findImmediateBlock', () => {
    it('should find block for opponent win', () => {
      gameState.board = ['O', 'O', null, 'X', 'X', null, null, null, null]
      
      const blockMove = findImmediateBlock(gameState.board, 'O')
      expect(blockMove).toBe(2)
    })

    it('should work with different opponent', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      
      const blockMove = findImmediateBlock(gameState.board, 'X')
      expect(blockMove).toBe(2)
    })
  })

  describe('calculateHeuristic', () => {
    it('should give high score for near win', () => {
      // Test case where only X has near-win opportunity (no opponent near-win)
      gameState.board = ['X', 'X', null, 'O', null, null, null, null, null]
      
      const score = calculateHeuristic(gameState.board, 'X')
      expect(score).toBeGreaterThan(100) // Near win should be high
    })

    it('should give negative score for opponent near win', () => {
      // Test case where only O has near-win opportunity (no X near-win)
      gameState.board = ['O', 'O', null, 'X', null, null, null, null, null]
      
      const score = calculateHeuristic(gameState.board, 'X')
      expect(score).toBeLessThan(0) // Opponent near win should be negative
    })

    it('should prefer center position', () => {
      const emptyBoard = Array(9).fill(null)
      emptyBoard[4] = 'X'
      
      const score = calculateHeuristic(emptyBoard, 'X')
      expect(score).toBeGreaterThan(0)
    })

    it('should prefer corner positions', () => {
      const emptyBoard = Array(9).fill(null)
      emptyBoard[0] = 'X'
      
      const score = calculateHeuristic(emptyBoard, 'X')
      expect(score).toBeGreaterThan(0)
    })
  })

  describe('evaluateMove', () => {
    it('should give high score for winning move', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const score = evaluateMove(gameState, 2, 'X')
      expect(score).toBe(1000) // Winning move should be 1000
    })

    it('should give good score for blocking move', () => {
      gameState.board = ['O', 'O', null, 'X', 'X', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const score = evaluateMove(gameState, 2, 'X')
      expect(score).toBeGreaterThan(0) // Blocking should be positive
    })

    it('should return -Infinity for invalid move', () => {
      gameState.board[0] = 'X'
      
      const score = evaluateMove(gameState, 0, 'X')
      expect(score).toBe(-Infinity)
    })
  })

  describe('getBeginnerMove', () => {
    it('should return a valid move', () => {
      const move = getBeginnerMove(gameState, 'O')
      
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.score).toBeGreaterThan(0)
      expect(move.reason).toBeTruthy()
    })

    it('should sometimes block immediate threats', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      
      // Test multiple times to catch the 50% blocking behavior
      let blockedCount = 0
      const iterations = 100
      
      for (let i = 0; i < iterations; i++) {
        const move = getBeginnerMove(gameState, 'O')
        if (move.cell === 2) blockedCount++
      }
      
      // Should block at least some of the time (not always 0%)
      expect(blockedCount).toBeGreaterThan(0)
      // But not always (not 100%)
      expect(blockedCount).toBeLessThan(iterations)
    })

    it('should prefer center and corners over sides', () => {
      const moves = []
      const iterations = 50
      
      for (let i = 0; i < iterations; i++) {
        const move = getBeginnerMove(gameState, 'O')
        moves.push(move.cell)
      }
      
      // Should prefer center (4) and corners (0, 2, 6, 8) over sides (1, 3, 5, 7)
      const preferredPositions = [0, 2, 4, 6, 8]
      const preferredCount = moves.filter(pos => preferredPositions.includes(pos)).length
      
      expect(preferredCount).toBeGreaterThanOrEqual(iterations * 0.5) // At least 50% should be preferred
    })
  })

  describe('getModerateMove', () => {
    it('should always win when possible', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getModerateMove(gameState, 'X')
      expect(move.cell).toBe(2)
      expect(move.score).toBe(1000)
      expect(move.reason).toBe('Immediate win')
    })

    it('should always block opponent win', () => {
      gameState.board = ['O', 'O', null, 'X', 'X', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getModerateMove(gameState, 'X')
      
      // X should win at position 5, not block O at position 2
      // This is correct behavior: win > block
      expect(move.cell).toBe(5)
      expect(move.score).toBe(1000)
      expect(move.reason).toBe('Immediate win')
    })

    it('should use heuristic when no immediate win/block', () => {
      gameState.board = ['X', null, null, null, 'O', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getModerateMove(gameState, 'X')
      expect(move.reason).toBe('Heuristic evaluation')
      expect(move.score).toBeGreaterThan(-Infinity)
    })

    it('should block opponent win when no immediate win available', () => {
      gameState.board = ['O', 'O', null, 'X', null, null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getModerateMove(gameState, 'X')
      expect(move.cell).toBe(2)
      expect(move.score).toBe(500)
      expect(move.reason).toBe('Blocked opponent win')
    })

    it('should return valid move for empty board', () => {
      const move = getModerateMove(gameState, 'O')
      
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.score).toBeGreaterThan(-Infinity)
    })
  })

  describe('getAIMove', () => {
    it('should call beginner AI for beginner difficulty', () => {
      const move = getAIMove(gameState, 'O', 'beginner')
      
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.score).toBeGreaterThan(0)
    })

    it('should call moderate AI for moderate difficulty', () => {
      const move = getAIMove(gameState, 'O', 'moderate')
      
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.score).toBeGreaterThan(-Infinity)
    })

    it('should call hard AI for hard difficulty', () => {
      const move = getAIMove(gameState, 'O', 'hard')
      
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.score).toBeGreaterThan(-Infinity)
      expect(move.reason).toContain('Minimax evaluation')
    })

    it('should throw error for unknown difficulty', () => {
      expect(() => {
        getAIMove(gameState, 'O', 'unknown' as any)
      }).toThrow('Unknown difficulty level: unknown')
    })
  })

  describe('AI behavior consistency', () => {
    it('should handle edge cases gracefully', () => {
      // Test with almost full board
      gameState.board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
      gameState.currentPlayer = 'O'
      
      expect(() => {
        getBeginnerMove(gameState, 'O')
        getModerateMove(gameState, 'O')
        getAIMove(gameState, 'O', 'hard')
      }).not.toThrow()
    })

    it('should work with different players', () => {
      const movesX = getModerateMove(gameState, 'X')
      const movesO = getModerateMove(gameState, 'O')
      
      expect(movesX.cell).toBeGreaterThanOrEqual(0)
      expect(movesO.cell).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Hard AI - Minimax', () => {
    it('should always win when possible', () => {
      gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getAIMove(gameState, 'X', 'hard')
      expect(move.cell).toBe(2) // Should win at position 2
      expect(move.reason).toContain('Minimax evaluation')
    })

    it('should always block opponent win', () => {
      gameState.board = ['O', 'O', null, 'X', null, null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getAIMove(gameState, 'X', 'hard')
      expect(move.cell).toBe(2) // Should block at position 2
      expect(move.reason).toContain('Minimax evaluation')
    })

    it('should make strategic moves for complex positions', () => {
      gameState.board = ['X', null, null, null, 'O', null, null, null, null]
      gameState.currentPlayer = 'X'
      
      const move = getAIMove(gameState, 'X', 'hard')
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.reason).toContain('Minimax evaluation')
    })

    it('should handle endgame scenarios', () => {
      gameState.board = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null]
      gameState.currentPlayer = 'O'
      
      const move = getAIMove(gameState, 'O', 'hard')
      expect(move.cell).toBeGreaterThanOrEqual(0)
      expect(move.cell).toBeLessThan(9)
      expect(move.reason).toContain('Minimax evaluation')
    })
  })

  describe('Step 8 specific AI requirements', () => {
    describe('Moderate AI behavior', () => {
      it('should always block immediate threat', () => {
        // O has two in a row, X must block
        gameState.board = ['O', 'O', null, 'X', null, null, null, null, null]
        gameState.currentPlayer = 'X'
        
        const move = getModerateMove(gameState, 'X')
        expect(move.cell).toBe(2) // Must block at position 2
        expect(move.reason).toBe('Blocked opponent win')
        expect(move.score).toBe(500)
      })

      it('should not miss immediate win opportunity', () => {
        // X has two in a row, should win
        gameState.board = ['X', 'X', null, 'O', null, null, null, null, null]
        gameState.currentPlayer = 'X'
        
        const move = getModerateMove(gameState, 'X')
        expect(move.cell).toBe(2) // Must win at position 2
        expect(move.reason).toBe('Immediate win')
        expect(move.score).toBe(1000)
      })

      it('should prioritize win over block', () => {
        // X can win OR block O's win - should choose to win
        gameState.board = ['X', 'X', null, 'O', 'O', null, null, null, null]
        gameState.currentPlayer = 'X'
        
        const move = getModerateMove(gameState, 'X')
        expect(move.cell).toBe(2) // Should win at position 2, not block at position 5
        expect(move.reason).toBe('Immediate win')
        expect(move.score).toBe(1000)
      })
    })

    describe('AI consistency across difficulties', () => {
      it('should handle empty board consistently', () => {
        const beginnerMove = getAIMove(gameState, 'O', 'beginner')
        const moderateMove = getAIMove(gameState, 'O', 'moderate')
        const hardMove = getAIMove(gameState, 'O', 'hard')
        
        // All should return valid moves
        expect(beginnerMove.cell).toBeGreaterThanOrEqual(0)
        expect(beginnerMove.cell).toBeLessThan(9)
        expect(moderateMove.cell).toBeGreaterThanOrEqual(0)
        expect(moderateMove.cell).toBeLessThan(9)
        expect(hardMove.cell).toBeGreaterThanOrEqual(0)
        expect(hardMove.cell).toBeLessThan(9)
        
        // All should have positive scores
        expect(beginnerMove.score).toBeGreaterThan(0)
        expect(moderateMove.score).toBeGreaterThan(-Infinity)
        expect(hardMove.score).toBeGreaterThan(-Infinity)
      })

      it('should handle near-full board consistently', () => {
        // Almost full board with one empty cell
        gameState.board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
        gameState.currentPlayer = 'O'
        
        const beginnerMove = getAIMove(gameState, 'O', 'beginner')
        const moderateMove = getAIMove(gameState, 'O', 'moderate')
        const hardMove = getAIMove(gameState, 'O', 'hard')
        
        // All should choose the only available move
        expect(beginnerMove.cell).toBe(8)
        expect(moderateMove.cell).toBe(8)
        expect(hardMove.cell).toBe(8)
      })
    })
  })
})
