/**
 * Sentry error tracking integration
 * Provides error monitoring and performance tracking
 */

import type { ErrorContext } from './monitoring';

let sentry: any = null;

/**
 * Initialize Sentry with error tracking
 */
export async function initializeSentry(): Promise<void> {
  try {
    const { init, captureException, captureMessage, setContext, setUser } = await import('@sentry/browser');
    
    init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      integrations: [
        // Add performance monitoring
        new (await import('@sentry/tracing')).BrowserTracing({
          routingInstrumentation: new (await import('@sentry/tracing')).BrowserTracing(),
        }),
      ],
      tracesSampleRate: 0.1, // 10% of transactions
      beforeSend(event) {
        // Filter out non-critical errors in production
        if (import.meta.env.MODE === 'production') {
          // Don't send console errors or network errors
          if (event.exception) {
            const error = event.exception.values?.[0];
            if (error?.type === 'TypeError' && error.value?.includes('Failed to fetch')) {
              return null;
            }
          }
        }
        return event;
      },
    });

    sentry = { captureException, captureMessage, setContext, setUser };
    
    // Set user context
    setUser({
      id: generateAnonymousId(),
      username: 'anonymous_player'
    });

    // Set game context
    setContext('game', {
      name: 'TicTacToe Rolling',
      version: '1.0.0',
      platform: 'web'
    });

    console.log('🔍 Sentry initialized for error tracking');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Sentry:', error);
  }
}

/**
 * Report an error to Sentry
 */
export function reportError(context: ErrorContext): void {
  if (!sentry) return;

  try {
    const { error, context: errorContext, level = 'error' } = context;
    
    // Add game-specific context
    sentry.setContext('error_context', {
      ...errorContext,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Capture the error
    sentry.captureException(error, {
      level,
      tags: {
        component: 'game',
        error_type: error.name
      }
    });
  } catch (reportingError) {
    console.warn('⚠️ Failed to report error to Sentry:', reportingError);
  }
}

/**
 * Capture a custom message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (!sentry) return;

  try {
    sentry.captureMessage(message, level);
  } catch (error) {
    console.warn('⚠️ Failed to capture message to Sentry:', error);
  }
}

/**
 * Generate an anonymous user ID for tracking
 */
function generateAnonymousId(): string {
  // Try to get existing ID from localStorage
  let userId = localStorage.getItem('sentry_user_id');
  
  if (!userId) {
    // Generate new anonymous ID
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sentry_user_id', userId);
  }
  
  return userId;
}

/**
 * Track game performance metrics
 */
export function trackGamePerformance(metric: string, value: number, tags?: Record<string, string>): void {
  if (!sentry) return;

  try {
    sentry.captureMessage(`Game Performance: ${metric}`, 'info');
    sentry.setContext('performance', {
      metric,
      value,
      tags,
      timestamp: Date.now()
    });
  } catch (error) {
    console.warn('⚠️ Failed to track performance metric:', error);
  }
}
