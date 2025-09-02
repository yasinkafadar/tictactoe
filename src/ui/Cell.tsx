import React from 'react'
import type { Mark, CellIndex } from '../engine/types'

interface CellProps {
  mark: Mark
  index: CellIndex
  isWinning: boolean
  onClick: (index: CellIndex) => void
  disabled: boolean
}

export default function Cell({ mark, index, isWinning, onClick, disabled }: CellProps) {
  const handleClick = () => {
    if (!disabled && !mark) {
      onClick(index)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      className={`cell ${isWinning ? 'cell--winning' : ''} ${mark ? 'cell--filled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || !!mark}
      aria-label={`Cell ${index + 1}${mark ? `, marked with ${mark}` : ', empty'}`}
      tabIndex={disabled || !!mark ? -1 : 0}
    >
      <span className="cell__mark" aria-hidden="true">
        {mark}
      </span>
    </button>
  )
}
