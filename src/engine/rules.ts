import type { Player, Mark, CellIndex, WinCheckResult } from './types'

/**
 * All possible winning line combinations (3 horizontal, 3 vertical, 2 diagonal)
 */
export const WIN_LINES: CellIndex[][] = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6]
]

/**
 * Checks if a player has won on the current board
 */
export function checkWin(board: Mark[], player: Player): WinCheckResult {
  for (const line of WIN_LINES) {
    if (line.every(cell => board[cell] === player)) {
      return { hasWin: true, winLine: line }
    }
  }
  return { hasWin: false }
}

/**
 * Checks if the game is a draw (board full or move/time cap reached)
 */
export function checkDraw(
  board: Mark[],
  moveCount: number,
  startTime: number,
  timeCapSeconds: number = 180,
  moveCap: number = 60
): boolean {
  // Check if board is full
  if (board.every(cell => cell !== null)) {
    return true
  }
  
  // Check move cap
  if (moveCount >= moveCap) {
    return true
  }
  
  // Check time cap
  const elapsedSeconds = (Date.now() - startTime) / 1000
  if (elapsedSeconds >= timeCapSeconds) {
    return true
  }
  
  return false
}

/**
 * Counts how many marks a player has on the board
 */
export function countPlayerMarks(board: Mark[], player: Player): number {
  return board.filter(cell => cell === player).length
}

/**
 * Gets the indices of all marks for a specific player
 */
export function getPlayerMarkIndices(board: Mark[], player: Player): CellIndex[] {
  return board
    .map((mark, index) => mark === player ? index : -1)
    .filter((index): index is CellIndex => index !== -1)
}
