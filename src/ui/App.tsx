import React, { useState, useCallback, useEffect, useRef } from 'react'
import Board from './Board'
import HUD from './HUD'
import ResultModal from './ResultModal'
import { newGame, other } from '../engine/types'
import { applyMove } from '../engine/applyMove'
import { checkDraw } from '../engine/rules'
import { getAIMove } from '../engine/ai'
import type { GameState, CellIndex, Player } from '../engine/types'
import type { DifficultyLevel } from '../engine/scoring'
import './App.css'

const HUMAN_PLAYER: Player = 'X'
const CPU_PLAYER: Player = 'O'

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => newGame(HUMAN_PLAYER))
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalPlayerScore, setTotalPlayerScore] = useState(0)
  const [totalOpponentScore, setTotalOpponentScore] = useState(0)
  const [isCpuThinking, setIsCpuThinking] = useState(false)
  const isCpuThinkingRef = useRef(false)

  // Handle cell clicks from human player
  const handleCellClick = useCallback((cellIndex: CellIndex) => {
    if (gameState.result !== 'ongoing' || gameState.currentPlayer !== HUMAN_PLAYER || isCpuThinking) {
      return
    }

    console.log('Human move at cell:', cellIndex)
    console.log('Game state before move:', gameState)
    
    const moveResult = applyMove(gameState, cellIndex)
    if (moveResult.success) {
      console.log('Move result:', moveResult)
      console.log('New state after human move:', moveResult.newState)
      setGameState(moveResult.newState)
    }
  }, [gameState, isCpuThinking])

  // CPU AI based on difficulty level
  const makeCpuMove = useCallback((state: GameState) => {
    if (state.result !== 'ongoing' || state.currentPlayer !== CPU_PLAYER) {
      return state
    }

    try {
      // Only use AI for beginner and moderate difficulties
      if (difficulty === 'hard') {
        // For now, use moderate AI until hard is implemented
        const aiMove = getAIMove(state, CPU_PLAYER, 'moderate')
        const moveResult = applyMove(state, aiMove.cell)
        return moveResult.success ? moveResult.newState : state
      }
      
      const aiMove = getAIMove(state, CPU_PLAYER, difficulty)
      const moveResult = applyMove(state, aiMove.cell)
      
      return moveResult.success ? moveResult.newState : state
    } catch (error) {
      console.error('AI error:', error)
      // Fallback to random move if AI fails
      const availableMoves = state.board
        .map((cell, index) => cell === null ? index : null)
        .filter((index): index is CellIndex => index !== null)

      if (availableMoves.length === 0) {
        return state
      }

      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
      const moveResult = applyMove(state, randomMove)
      
      return moveResult.success ? moveResult.newState : state
    }
  }, [difficulty])

  // Handle CPU turns
  useEffect(() => {
    // Only proceed if it's actually the CPU's turn and we're not already thinking
    if (gameState.result !== 'ongoing' || gameState.currentPlayer !== CPU_PLAYER || isCpuThinkingRef.current) {
      return
    }

    console.log('CPU turn starting, current player:', gameState.currentPlayer, 'CPU player:', CPU_PLAYER)
    
    // Set thinking state immediately to prevent re-triggering
    isCpuThinkingRef.current = true
    setIsCpuThinking(true)
    
    const timer = setTimeout(() => {
      setGameState(currentState => {
        // Double-check it's still the CPU's turn
        if (currentState.currentPlayer !== CPU_PLAYER || currentState.result !== 'ongoing') {
          isCpuThinkingRef.current = false
          setIsCpuThinking(false)
          return currentState
        }
        
        console.log('CPU making move...')
        const newState = makeCpuMove(currentState)
        isCpuThinkingRef.current = false
        setIsCpuThinking(false)
        console.log('CPU move complete, new state:', newState)
        console.log('Board after CPU move:', newState.board)
        console.log('Current player after CPU move:', newState.currentPlayer)
        return newState
      })
    }, 250) // Short delay for better UX

    return () => clearTimeout(timer)
  }, [gameState.currentPlayer, gameState.result])

  // Check for draw conditions periodically
  useEffect(() => {
    if (gameState.result !== 'ongoing') return

    const interval = setInterval(() => {
      setGameState(currentState => {
        if (currentState.result !== 'ongoing') return currentState

        // Check time-based draw
        if (checkDraw(currentState.board, currentState.moveCount, currentState.startTime)) {
          return {
            ...currentState,
            result: 'draw'
          }
        }

        return currentState
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.result])

  // Show modal when game ends
  useEffect(() => {
    if (gameState.result !== 'ongoing') {
      setIsModalOpen(true)
    }
  }, [gameState.result])

  const handleRematch = useCallback(() => {
    setGameState(newGame(HUMAN_PLAYER))
    setIsModalOpen(false)
    setIsCpuThinking(false)
    isCpuThinkingRef.current = false
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleDifficultyChange = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty)
  }, [])

  const handleNewGame = useCallback(() => {
    setGameState(newGame(HUMAN_PLAYER))
    setIsModalOpen(false)
    setIsCpuThinking(false)
    isCpuThinkingRef.current = false
  }, [])

  return (
    <div className="app">
      <div className="app__header">
        <div className="app__controls">
          <div className="app__difficulty">
            <label htmlFor="difficulty-select" className="app__difficulty-label">
              Difficulty:
            </label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value as DifficultyLevel)}
              className="app__difficulty-select"
            >
              <option value="beginner">Beginner</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button 
            onClick={handleNewGame}
            className="app__new-game-button"
          >
            New Game
          </button>
        </div>
      </div>

      <main className="app__main">
        <HUD 
          gameState={gameState}
          difficulty={difficulty}
          playerScore={totalPlayerScore}
          opponentScore={totalOpponentScore}
        />
        
        <Board 
          gameState={gameState}
          onCellClick={handleCellClick}
        />

        {isCpuThinking && (
          <div className="app__cpu-thinking" aria-live="polite">
            CPU is thinking...
          </div>
        )}
      </main>

      <ResultModal
        gameState={gameState}
        difficulty={difficulty}
        onRematch={handleRematch}
        onClose={handleModalClose}
        isOpen={isModalOpen}
      />
    </div>
  )
}
