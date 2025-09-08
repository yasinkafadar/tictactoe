import { useState, useCallback, useEffect, useRef } from 'react'
import Board from './Board'
import HUD from './HUD'
import { newGame } from '../engine/types'
import { applyMove } from '../engine/applyMove'
import { checkDraw } from '../engine/rules'
import { getAIMove } from '../engine/ai'
import { monitoring } from '../lib/monitoring'
import { trackGameStart, trackGameEnd, trackUserInteraction, trackAIPerformance, trackDifficultyChange } from '../lib/analytics'
import type { GameState, CellIndex, Player } from '../engine/types'
import type { DifficultyLevel } from '../engine/ai'
import './App.css'


const HUMAN_PLAYER: Player = 'X'
const CPU_PLAYER: Player = 'O'

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => newGame(HUMAN_PLAYER))
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [totalPlayerScore] = useState(0)
  const [totalOpponentScore] = useState(0)
  const [isCpuThinking, setIsCpuThinking] = useState(false)
  const isCpuThinkingRef = useRef(false)
  const gameStartTimeRef = useRef<number>(Date.now())
  const moveCountRef = useRef<number>(0)

  // Initialize monitoring services
  useEffect(() => {
    monitoring.initialize().catch(error => {
      console.warn('Failed to initialize monitoring:', error)
    })
    
    // Track initial game start
    trackGameStart(difficulty)
  }, [difficulty])

  // Track game state changes
  useEffect(() => {
    moveCountRef.current = gameState.moveCount
    
    // Track game events
    if (gameState.result !== 'ongoing') {
      const gameDuration = Date.now() - gameStartTimeRef.current
      
      // Track with monitoring system
      monitoring.trackGameEvent('game_complete', {
        result: gameState.result,
        difficulty,
        moveCount: gameState.moveCount,
        duration: gameDuration,
        winLine: gameState.winLine
      })
      
      // Track with Vercel Analytics
      trackGameEnd(gameState.result, difficulty, gameState.moveCount, gameDuration)
    }
  }, [gameState.result, gameState.moveCount, difficulty, gameState.winLine])

  // Handle cell clicks from human player
  const handleCellClick = useCallback((cellIndex: CellIndex) => {
    if (gameState.result !== 'ongoing' || gameState.currentPlayer !== HUMAN_PLAYER || isCpuThinking) {
      return
    }

    // Track user interaction
    monitoring.trackUserInteraction('cell_click', `cell_${cellIndex}`)
    trackUserInteraction('cell_click', `cell_${cellIndex}`)

    const moveResult = applyMove(gameState, cellIndex)
    if (moveResult.success) {
      setGameState(moveResult.newState)
      
      // Track move
      monitoring.trackGameEvent('human_move', {
        cellIndex,
        moveCount: moveResult.newState.moveCount,
        difficulty
      })
    }
  }, [gameState, isCpuThinking, difficulty])

  // CPU AI based on difficulty level
  const makeCpuMove = useCallback((state: GameState) => {
    if (state.result !== 'ongoing' || state.currentPlayer !== CPU_PLAYER) {
      return state
    }

    const startTime = Date.now()

    try {
      const aiMove = getAIMove(state, CPU_PLAYER, difficulty)
      const moveResult = applyMove(state, aiMove.cell)
      
      if (moveResult.success) {
        const moveTime = Date.now() - startTime
        
        // Track AI performance
        monitoring.trackAIPerformance(difficulty, moveTime, moveResult.newState.moveCount)
        trackAIPerformance(difficulty, moveTime, moveResult.newState.moveCount)
        
        // Track AI move
        monitoring.trackGameEvent('ai_move', {
          cellIndex: aiMove.cell,
          moveCount: moveResult.newState.moveCount,
          difficulty,
          moveTime
        })
      }
      
      return moveResult.success ? moveResult.newState : state
    } catch (error) {
      console.error('AI error:', error)
      
      // Report AI error to monitoring
      monitoring.reportError({
        error: error as Error,
        context: {
          difficulty,
          moveCount: state.moveCount,
          board: state.board
        }
      })
      
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
        
        const newState = makeCpuMove(currentState)
        isCpuThinkingRef.current = false
        setIsCpuThinking(false)
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


  const handleRematch = useCallback(() => {
    // Track rematch event
    monitoring.trackUserInteraction('rematch', 'inline_result')
    trackUserInteraction('rematch', 'inline_result')
    
    setGameState(newGame(HUMAN_PLAYER))
    setIsCpuThinking(false)
    isCpuThinkingRef.current = false
    gameStartTimeRef.current = Date.now()
    moveCountRef.current = 0
    
    // Track new game start
    trackGameStart(difficulty)
  }, [difficulty])

  const handleDifficultyChange = useCallback((newDifficulty: DifficultyLevel) => {
    // Track difficulty change
    monitoring.trackUserInteraction('difficulty_change', newDifficulty)
    trackDifficultyChange(difficulty, newDifficulty)
    
    setDifficulty(newDifficulty)
  }, [difficulty])

  const handleNewGame = useCallback(() => {
    // Track new game event
    monitoring.trackUserInteraction('new_game', 'header_button')
    trackUserInteraction('new_game', 'header_button')
    
    setGameState(newGame(HUMAN_PLAYER))
    setIsCpuThinking(false)
    isCpuThinkingRef.current = false
    gameStartTimeRef.current = Date.now()
    moveCountRef.current = 0
    
    // Track new game start
    trackGameStart(difficulty)
  }, [difficulty])

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
          isCpuThinking={isCpuThinking}
          onRematch={handleRematch}
        />
        
        <Board 
          gameState={gameState}
          onCellClick={handleCellClick}
        />
      </main>

    </div>
  )
}
