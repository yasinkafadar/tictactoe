import { describe, it, expect } from 'vitest'
import { applyMove } from '../applyMove'
import { newGame } from '../types'

describe('applyMove', () => {
  describe('basic move validation', () => {
    it('should reject move on occupied cell', () => {
      const game = newGame()
      const gameWithMove = applyMove(game, 0)
      const result = applyMove(gameWithMove.newState, 0)
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Cell is already occupied')
    })

    it('should reject move on finished game', () => {
      const game = newGame()
      // Create a winning game - X places at 0, 1, 2 (horizontal win)
      const game1 = applyMove(game, 0) // X at 0
      const game2 = applyMove(game1.newState, 3) // O at 3
      const game3 = applyMove(game2.newState, 1) // X at 1
      const game4 = applyMove(game3.newState, 4) // O at 4
      const game5 = applyMove(game4.newState, 2) // X at 2 - wins!
      
      expect(game5.newState.result).toBe('win')
      
      const result = applyMove(game5.newState, 3)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Game is already finished')
    })
  })

  describe('win detection', () => {
    it('should detect immediate win and not apply removal', () => {
      const game = newGame()
      // Set up X to win in next move
      const game1 = applyMove(game, 0) // X at 0
      const game2 = applyMove(game1.newState, 3) // O at 3
      const game3 = applyMove(game2.newState, 1) // X at 1
      const game4 = applyMove(game3.newState, 4) // O at 4
      
      // X should win by placing at position 2
      const result = applyMove(game4.newState, 2)
      
      expect(result.success).toBe(true)
      expect(result.newState.result).toBe('win')
      expect(result.newState.winLine).toEqual([0, 1, 2])
      expect(result.newState.currentPlayer).toBe('X') // Should stay X (no turn switch on win)
    })
  })

  describe('rolling rule', () => {
    it('should remove oldest mark when player has >3 marks', () => {
      const game = newGame()
      
      // X places 4 marks in non-winning positions: 0, 2, 5, 7
      const game1 = applyMove(game, 0) // X at 0
      const game2 = applyMove(game1.newState, 1) // O at 1
      const game3 = applyMove(game2.newState, 2) // X at 2
      const game4 = applyMove(game3.newState, 3) // O at 3
      const game5 = applyMove(game4.newState, 5) // X at 5
      const game6 = applyMove(game5.newState, 4) // O at 4
      const game7 = applyMove(game6.newState, 7) // X at 7
      
      // Now X has 4 marks, oldest should be removed
      expect(game7.newState.board[0]).toBe(null) // Oldest mark removed
      expect(game7.newState.board[2]).toBe('X')
      expect(game7.newState.board[5]).toBe('X')
      expect(game7.newState.board[7]).toBe('X')
      expect(game7.newState.currentPlayer).toBe('O') // Turn should switch
    })

    it('should not remove marks if win occurs', () => {
      const game = newGame()
      
      // Set up X to have exactly 3 marks and win on the 4th placement
      const game1 = applyMove(game, 0) // X at 0
      const game2 = applyMove(game1.newState, 3) // O at 3
      const game3 = applyMove(game2.newState, 8) // X at 8
      const game4 = applyMove(game3.newState, 1) // O at 1
      const game5 = applyMove(game4.newState, 2) // X at 2
      const game6 = applyMove(game5.newState, 5) // O at 5
      
      // X should win by placing at position 4 (diagonal 0,4,8)
      // X will have 4 marks but should win before removal is applied
      const result = applyMove(game6.newState, 4)
      
      expect(result.success).toBe(true)
      expect(result.newState.result).toBe('win')
      expect(result.newState.winLine).toEqual([0, 4, 8])
      // All X marks should remain (no removal on win)
      expect(result.newState.board[0]).toBe('X')
      expect(result.newState.board[2]).toBe('X')
      expect(result.newState.board[4]).toBe('X')
      expect(result.newState.board[8]).toBe('X')
    })
  })

  describe('turn switching', () => {
    it('should switch player after successful move', () => {
      const game = newGame()
      expect(game.currentPlayer).toBe('X')
      
      const result = applyMove(game, 0)
      expect(result.success).toBe(true)
      expect(result.newState.currentPlayer).toBe('O')
    })

    it('should not switch player on win', () => {
      const game = newGame()
      // Set up X to win
      const game1 = applyMove(game, 0)
      const game2 = applyMove(game1.newState, 3)
      const game3 = applyMove(game2.newState, 1)
      const game4 = applyMove(game3.newState, 4)
      
      const result = applyMove(game4.newState, 2)
      expect(result.success).toBe(true)
      expect(result.newState.result).toBe('win')
      expect(result.newState.currentPlayer).toBe('X') // Should stay X
    })
  })

  describe('move counting', () => {
    it('should increment move count correctly', () => {
      const game = newGame()
      expect(game.moveCount).toBe(0)
      
      const result = applyMove(game, 0)
      expect(result.success).toBe(true)
      expect(result.newState.moveCount).toBe(1)
    })
  })

  describe('move history', () => {
    it('should track move history correctly', () => {
      const game = newGame()
      expect(game.moveHistory).toEqual([])
      
      const result = applyMove(game, 0)
      expect(result.success).toBe(true)
      expect(result.newState.moveHistory).toEqual([0])
    })
  })

  describe('Step 8 specific requirements', () => {
    describe('win precedence over removal', () => {
      it('should win immediately when placing 4th mark creates win, no removal', () => {
        const game = newGame()
        
        // Set up X to have 3 marks and win on 4th placement
        // X at 0, 1, 2 (horizontal setup)
        const game1 = applyMove(game, 0) // X at 0
        const game2 = applyMove(game1.newState, 3) // O at 3
        const game3 = applyMove(game2.newState, 1) // X at 1
        const game4 = applyMove(game3.newState, 4) // O at 4
        const game5 = applyMove(game4.newState, 2) // X at 2
        
        // X now has 3 marks: [0, 1, 2] - this is already a win!
        expect(game5.newState.result).toBe('win')
        expect(game5.newState.winLine).toEqual([0, 1, 2])
        
        // All X marks should remain (no removal on win)
        expect(game5.newState.board[0]).toBe('X')
        expect(game5.newState.board[1]).toBe('X')
        expect(game5.newState.board[2]).toBe('X')
      })
    })

    describe('draw conditions', () => {
      it('should draw by time cap (180 seconds)', () => {
        const game = newGame()
        // Create a game that started 181 seconds ago
        const oldGame = {
          ...game,
          startTime: Date.now() - 181000 // 181 seconds ago
        }
        
        // Any move should trigger draw by time cap
        const result = applyMove(oldGame, 0)
        expect(result.success).toBe(true)
        expect(result.newState.result).toBe('draw')
      })

      it('should not draw if time is under 180 seconds', () => {
        const game = newGame()
        // Create a game that started 179 seconds ago
        const recentGame = {
          ...game,
          startTime: Date.now() - 179000 // 179 seconds ago
        }
        
        // Move should succeed without draw
        const result = applyMove(recentGame, 0)
        expect(result.success).toBe(true)
        expect(result.newState.result).toBe('ongoing')
      })
    })
  })
})
