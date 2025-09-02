import type { GameState, CellIndex, Player, MoveOutcome } from './types'
import { checkWin, checkDraw, countPlayerMarks } from './rules'
import { other } from './types'

/**
 * Applies a move to the game state, implementing the rolling rule:
 * 1. Place mark
 * 2. If win → win immediately (no removal)
 * 3. If >3 marks → remove oldest (by placement order)
 * 4. Check for draw conditions
 */
export function applyMove(state: GameState, cell: CellIndex): MoveOutcome {
  // Validate move
  if (state.result !== 'ongoing') {
    return {
      success: false,
      newState: state,
      message: 'Game is already finished'
    }
  }
  
  if (state.board[cell] !== null) {
    return {
      success: false,
      newState: state,
      message: 'Cell is already occupied'
    }
  }
  
  const currentPlayer = state.currentPlayer
  
  // Create new state with the move applied
  const newBoard = [...state.board]
  newBoard[cell] = currentPlayer
  
  const newMoveHistory = [...state.moveHistory, cell]
  const newMoveCount = state.moveCount + 1
  
  // Check for immediate win
  const winCheck = checkWin(newBoard, currentPlayer)
  if (winCheck.hasWin) {
    return {
      success: true,
      newState: {
        ...state,
        board: newBoard,
        result: 'win',
        moveCount: newMoveCount,
        moveHistory: newMoveHistory,
        winLine: winCheck.winLine
      }
    }
  }
  
  // Apply rolling rule: remove oldest mark if >3
  let finalBoard = newBoard
  // Check if player had 3 marks BEFORE placing the new one
  const playerMarkCountBeforeMove = countPlayerMarks(state.board, currentPlayer)
  
  if (playerMarkCountBeforeMove >= 3) {
    // Find the oldest mark by looking at move history in order
    // and finding the first mark that belongs to current player
    // We need to find the oldest mark BEFORE the current move
    for (let i = 0; i < newMoveHistory.length - 1; i++) {
      const moveIndex = newMoveHistory[i]
      // Look for marks in the ORIGINAL board, not the new board
      if (state.board[moveIndex] === currentPlayer) {
        // This is the oldest mark, remove it from the new board
        finalBoard = [...newBoard]
        finalBoard[moveIndex] = null

        break
      }
    }
  }
  
  // Check for draw conditions
  let newResult: 'ongoing' | 'win' | 'draw' = 'ongoing'
  if (checkDraw(finalBoard, newMoveCount, state.startTime)) {
    newResult = 'draw'
  }
  
  // Switch player if game continues
  const nextPlayer = newResult === 'ongoing' ? other(currentPlayer) : currentPlayer
  
  const newState = {
    ...state,
    board: finalBoard,
    currentPlayer: nextPlayer,
    result: newResult,
    moveCount: newMoveCount,
    moveHistory: newMoveHistory
  }
  
    return {
    success: true,
    newState
  }
}
