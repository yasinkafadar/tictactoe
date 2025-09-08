/**
 * PostHog analytics integration
 * Provides user analytics and event tracking
 */

let posthog: any = null;

/**
 * Initialize PostHog for analytics
 */
export async function initializePostHog(): Promise<void> {
  try {
    const { PostHog } = await import('posthog-js');
    
    posthog = new PostHog();
    
    const meta = import.meta as any;
    
    // Debug PostHog environment variables
    console.log('🔍 PostHog - All env vars:', meta.env);
    console.log('🔍 PostHog - Key value:', meta.env?.VITE_PUBLIC_POSTHOG_KEY);
    console.log('🔍 PostHog - Host value:', meta.env?.VITE_PUBLIC_POSTHOG_HOST);
    
    posthog.init(meta.env?.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: meta.env?.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      loaded: (posthog: any) => {
        console.log('📊 PostHog initialized for analytics');
        
        // Set user properties
        posthog.identify(generateAnonymousId(), {
          game_version: '1.0.0',
          platform: 'web',
          browser: getBrowserInfo()
        });

        // Track initial page view
        posthog.capture('game_loaded', {
          url: window.location.href,
          timestamp: Date.now()
        });
      }
    });
  } catch (error) {
    console.warn('⚠️ Failed to initialize PostHog:', error);
  }
}

/**
 * Track a custom event
 */
export function trackEvent(event: string, properties?: Record<string, any>): void {
  if (!posthog) return;

  try {
    posthog.capture(event, {
      ...properties,
      timestamp: Date.now(),
      url: window.location.href
    });
  } catch (error) {
    console.warn('⚠️ Failed to track event to PostHog:', error);
  }
}

/**
 * Track game-specific events
 */
export function trackGameEvent(event: string, gameData?: Record<string, any>): void {
  trackEvent(`game_${event}`, {
    ...gameData,
    game_version: '1.0.0',
    platform: 'web'
  });
}

/**
 * Track AI performance metrics
 */
export function trackAIPerformance(difficulty: string, moveTime: number, _moveCount: number): void {
  trackEvent('ai_performance', {
    difficulty,
    move_time_ms: moveTime,
    move_count: _moveCount,
    performance_rating: calculatePerformanceRating(moveTime, _moveCount)
  });
}

/**
 * Track user interactions
 */
export function trackUserInteraction(action: string, target?: string, metadata?: Record<string, any>): void {
  trackEvent('user_interaction', {
    action,
    target,
    ...metadata,
    interaction_type: 'game_ui'
  });
}

/**
 * Track game session metrics
 */
export function trackGameSession(sessionData: {
  duration: number;
  moves: number;
  difficulty: string;
  result: string;
  score?: number;
}): void {
  trackEvent('game_session_complete', {
    ...sessionData,
    session_id: generateSessionId(),
    timestamp: Date.now()
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: string, usageData?: Record<string, any>): void {
  trackEvent('feature_usage', {
    feature,
    ...usageData,
    timestamp: Date.now()
  });
}

/**
 * Generate an anonymous user ID
 */
function generateAnonymousId(): string {
  let userId = localStorage.getItem('posthog_user_id');
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('posthog_user_id', userId);
  }
  
  return userId;
}

/**
 * Generate a session ID
 */
function generateSessionId(): string {
  let sessionId = sessionStorage.getItem('game_session_id');
  
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('game_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Get browser information
 */
function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

/**
 * Calculate performance rating based on move time and count
 */
function calculatePerformanceRating(moveTime: number, _moveCount: number): string {
  if (moveTime < 100) return 'excellent';
  if (moveTime < 500) return 'good';
  if (moveTime < 1000) return 'average';
  return 'slow';
}

/**
 * Track page view
 */
export function trackPageView(page: string): void {
  if (!posthog) return;

  try {
    posthog.capture('$pageview', {
      page,
      timestamp: Date.now()
    });
  } catch (error) {
    console.warn('⚠️ Failed to track page view:', error);
  }
}
