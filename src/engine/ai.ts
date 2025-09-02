import type { GameState, CellIndex, Player, Mark } from './types'
import { applyMove } from './applyMove'
import { checkWin, countPlayerMarks } from './rules'
import { other } from './types'

export type DifficultyLevel = 'beginner' | 'moderate' | 'hard'

export interface AIMove {
  cell: CellIndex
  score: number
  reason: string
}

/**
 * Finds all legal moves (empty cells) on the board
 */
export function getLegalMoves(gameState: GameState): CellIndex[] {
  return gameState.board
    .map((cell, index) => cell === null ? index : null)
    .filter((index): index is CellIndex => index !== null)
}

/**
 * Checks if placing a mark at a cell would result in an immediate win
 */
export function findImmediateWin(
  board: Mark[],
  player: Player,
  excludeCell?: CellIndex
): CellIndex | null {
  for (let i = 0; i < board.length; i++) {
    if (i === excludeCell || board[i] !== null) continue
    
    // Temporarily place mark and check for win
    const tempBoard = [...board]
    tempBoard[i] = player
    
    const winCheck = checkWin(tempBoard, player)
    if (winCheck.hasWin) {
      return i as CellIndex
    }
  }
  return null
}

/**
 * Finds a move that blocks the opponent's immediate win
 */
export function findImmediateBlock(
  board: Mark[],
  opponent: Player,
  excludeCell?: CellIndex
): CellIndex | null {
  return findImmediateWin(board, opponent, excludeCell)
}

/**
 * Calculates a simple heuristic score for a board position
 * Higher score = better for the player
 */
export function calculateHeuristic(board: Mark[], player: Player): number {
  const opponent = other(player)
  let score = 0
  
  // Check for potential winning lines
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]              // Diagonal
  ]
  
  for (const line of winLines) {
    const playerCount = line.filter(cell => board[cell] === player).length
    const opponentCount = line.filter(cell => board[cell] === opponent).length
    const emptyCount = line.filter(cell => board[cell] === null).length
    
    if (opponentCount === 0 && emptyCount > 0) {
      // Line is available for player
      if (playerCount === 2 && emptyCount === 1) score += 500  // Near win (much higher)
      else if (playerCount === 1 && emptyCount === 2) score += 50
      else if (playerCount === 0 && emptyCount === 3) score += 5
    }
    
    if (playerCount === 0 && emptyCount > 0) {
      // Line is available for opponent
      if (opponentCount === 2 && emptyCount === 1) score -= 500  // Near loss (much higher)
      else if (opponentCount === 1 && emptyCount === 2) score -= 50
    }
  }
  
  // Bonus for center position
  if (board[4] === player) score += 5
  if (board[4] === opponent) score -= 5
  
  // Bonus for corner positions
  const corners = [0, 2, 6, 8]
  for (const corner of corners) {
    if (board[corner] === player) score += 3
    if (board[corner] === opponent) score -= 3
  }
  
  return score
}

/**
 * Evaluates a move using 1-ply look-ahead
 */
export function evaluateMove(
  gameState: GameState,
  cell: CellIndex,
  player: Player
): number {
  const moveResult = applyMove(gameState, cell)
  if (!moveResult.success) return -Infinity
  
  const newState = moveResult.newState
  
  // If this move wins, it's the best possible
  if (newState.result === 'win' && newState.currentPlayer === player) {
    return 1000
  }
  
  // If this move blocks opponent's win, it's very good
  if (newState.result === 'ongoing') {
    const opponent = other(player)
    const opponentWin = findImmediateWin(newState.board, opponent)
    if (opponentWin === null) {
      // Opponent can't win immediately, calculate heuristic
      return calculateHeuristic(newState.board, player)
    }
  }
  
  // If opponent can still win, this move is not great
  return -100
}

/**
 * Beginner AI: Random with light preferences, blocks immediate threats 50% of the time
 */
export function getBeginnerMove(gameState: GameState, player: Player): AIMove {
  const legalMoves = getLegalMoves(gameState)
  if (legalMoves.length === 0) {
    throw new Error('No legal moves available')
  }
  
  // 50% chance to block immediate threats
  if (Math.random() < 0.5) {
    const opponent = other(player)
    const blockMove = findImmediateBlock(gameState.board, opponent)
    if (blockMove !== null) {
      return {
        cell: blockMove,
        score: 50,
        reason: 'Blocked opponent win'
      }
    }
  }
  
  // Random move with light preferences
  const center = 4
  const corners = [0, 2, 6, 8]
  const sides = [1, 3, 5, 7]
  
  // Prefer center, then corners, then sides
  let preferredMoves: CellIndex[] = []
  
  if (legalMoves.includes(center)) {
    preferredMoves.push(center)
  }
  
  const availableCorners = corners.filter(corner => legalMoves.includes(corner))
  preferredMoves.push(...availableCorners)
  
  const availableSides = sides.filter(side => legalMoves.includes(side))
  preferredMoves.push(...availableSides)
  
  // Filter to only include legal moves
  const validPreferredMoves = preferredMoves.filter(move => legalMoves.includes(move))
  
  if (validPreferredMoves.length > 0) {
    const randomIndex = Math.floor(Math.random() * validPreferredMoves.length)
    const move = validPreferredMoves[randomIndex]
    return {
      cell: move,
      score: 10,
      reason: 'Random move with preference'
    }
  }
  
  // Fallback to completely random
  const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
  return {
    cell: randomMove,
    score: 1,
    reason: 'Random move'
  }
}

/**
 * Moderate AI: Always win if possible, otherwise block, else 1-ply look-ahead + heuristic
 */
export function getModerateMove(gameState: GameState, player: Player): AIMove {
  const legalMoves = getLegalMoves(gameState)
  if (legalMoves.length === 0) {
    throw new Error('No legal moves available')
  }
  
  // 1. Always win if possible
  const winMove = findImmediateWin(gameState.board, player)
  if (winMove !== null) {
    return {
      cell: winMove,
      score: 1000,
      reason: 'Immediate win'
    }
  }
  
  // 2. Always block opponent's win
  const opponent = other(player)
  const blockMove = findImmediateBlock(gameState.board, opponent)
  if (blockMove !== null) {
    return {
      cell: blockMove,
      score: 500,
      reason: 'Blocked opponent win'
    }
  }
  
  // 3. 1-ply look-ahead with heuristic
  let bestMove: CellIndex = legalMoves[0]
  let bestScore = -Infinity
  let bestReason = 'Heuristic evaluation'
  
  for (const move of legalMoves) {
    const score = evaluateMove(gameState, move, player)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }
  
  return {
    cell: bestMove,
    score: bestScore,
    reason: bestReason
  }
}

/**
 * Get AI move based on difficulty level
 */
export function getAIMove(
  gameState: GameState,
  player: Player,
  difficulty: DifficultyLevel
): AIMove {
  switch (difficulty) {
    case 'beginner':
      return getBeginnerMove(gameState, player)
    case 'moderate':
      return getModerateMove(gameState, player)
    case 'hard':
      // TODO: Implement in Step 5
      throw new Error('Hard difficulty not yet implemented')
    default:
      throw new Error(`Unknown difficulty level: ${difficulty}`)
  }
}
