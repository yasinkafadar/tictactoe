export type Player = 'X' | 'O'
export type Mark = Player | null
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Result = 'ongoing' | 'win' | 'draw'

export interface GameState {
  board: Mark[]
  currentPlayer: Player
  result: Result
  moveCount: number
  startTime: number
  winLine?: CellIndex[]
  moveHistory: CellIndex[]
}

export interface MoveOutcome {
  success: boolean
  newState: GameState
  message?: string
}

export interface WinCheckResult {
  hasWin: boolean
  winLine?: CellIndex[]
}

/**
 * Creates a new game state with X moving first
 */
export function newGame(first: Player = 'X'): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: first,
    result: 'ongoing',
    moveCount: 0,
    startTime: Date.now(),
    moveHistory: []
  }
}

/**
 * Gets the opposite player
 */
export function other(player: Player): Player {
  return player === 'X' ? 'O' : 'X'
}
