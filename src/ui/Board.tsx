import { useEffect } from 'react'
import Cell from './Cell'
import type { GameState, CellIndex } from '../engine/types'

interface BoardProps {
  gameState: GameState
  onCellClick: (index: CellIndex) => void
}

export default function Board({ gameState, onCellClick }: BoardProps) {
  const { board, result, winLine } = gameState
  const disabled = result !== 'ongoing'

  // Keyboard navigation (1-9 keys for cells)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (disabled) return

      const key = event.key
      const cellNumber = parseInt(key, 10)
      
      if (cellNumber >= 1 && cellNumber <= 9) {
        const cellIndex = (cellNumber - 1) as CellIndex
        if (!board[cellIndex]) {
          onCellClick(cellIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [board, disabled, onCellClick])

  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe game board">
      <div className="board__grid">
        {board.map((mark, index) => (
          <Cell
            key={index}
            mark={mark}
            index={index as CellIndex}
            isWinning={winLine?.includes(index as CellIndex) ?? false}
            onClick={onCellClick}
            disabled={disabled}
          />
        ))}
      </div>
      
      <div className="board__instructions">
        <p>
          {disabled 
            ? 'Game finished' 
            : 'Click a cell or press keys 1-9 to play'
          }
        </p>
      </div>
    </div>
  )
}
