/**
 * Vercel Analytics integration
 * Provides custom event tracking for game interactions
 */

import { track } from '@vercel/analytics';

export interface GameAnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

/**
 * Track game-specific events
 */
export function trackGameEvent(event: string, properties?: Record<string, any>): void {
  try {
    track(event, {
      ...properties,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to track analytics event:', error);
  }
}

/**
 * Track game start
 */
export function trackGameStart(difficulty: string): void {
  trackGameEvent('game_start', {
    difficulty,
    game_type: 'rolling_tictactoe'
  });
}

/**
 * Track game end
 */
export function trackGameEnd(result: string, difficulty: string, moveCount: number, duration: number): void {
  trackGameEvent('game_end', {
    result,
    difficulty,
    move_count: moveCount,
    duration_ms: duration,
    game_type: 'rolling_tictactoe'
  });
}

/**
 * Track user interactions
 */
export function trackUserInteraction(action: string, target?: string): void {
  trackGameEvent('user_interaction', {
    action,
    target,
    interaction_type: 'game_ui'
  });
}

/**
 * Track AI performance
 */
export function trackAIPerformance(difficulty: string, moveTime: number, moveCount: number): void {
  trackGameEvent('ai_performance', {
    difficulty,
    move_time_ms: moveTime,
    move_count: moveCount,
    performance_type: 'ai_move'
  });
}

/**
 * Track difficulty changes
 */
export function trackDifficultyChange(fromDifficulty: string, toDifficulty: string): void {
  trackGameEvent('difficulty_change', {
    from_difficulty: fromDifficulty,
    to_difficulty: toDifficulty,
    change_type: 'user_preference'
  });
}
