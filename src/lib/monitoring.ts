/**
 * Centralized monitoring utilities
 * Provides a clean interface for error tracking, analytics, and performance monitoring
 */

import { getMonitoringConfig, isMonitoringEnabled } from './monitoring-config';

export interface MonitoringEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface ErrorContext {
  error: Error;
  context?: Record<string, any>;
  level?: 'error' | 'warning' | 'info';
}

/**
 * Main monitoring class that coordinates all monitoring services
 */
export class Monitoring {
  private static instance: Monitoring;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  /**
   * Initialize all monitoring services
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Check if monitoring is enabled
    if (!isMonitoringEnabled()) {
      console.log('📊 Monitoring disabled - no keys configured');
      this.isInitialized = true;
      return;
    }

    try {
      const config = getMonitoringConfig();

      // Initialize Sentry if enabled
      if (config.sentry.enabled) {
        await import('./sentry').then(module => module.initializeSentry());
      }

      // Initialize PostHog if enabled
      if (config.posthog.enabled) {
        await import('./posthog').then(module => module.initializePostHog());
      }

      // Initialize web-vitals if PostHog is available
      if (config.webVitals.enabled) {
        await import('./web-vitals').then(module => module.initializeWebVitals());
      }

      this.isInitialized = true;
      console.log('📊 Monitoring services initialized');
    } catch (error) {
      console.warn('⚠️ Failed to initialize monitoring services:', error);
    }
  }

  /**
   * Track a custom event
   */
  public track(event: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return;

    try {
      const config = getMonitoringConfig();
      
      // Send to PostHog if enabled
      if (config.posthog.enabled) {
        import('./posthog').then(module => module.trackEvent(event, properties));
      }
    } catch (error) {
      console.warn('⚠️ Failed to track event:', error);
    }
  }

  /**
   * Report an error
   */
  public reportError(context: ErrorContext): void {
    if (!this.isInitialized) return;

    try {
      const config = getMonitoringConfig();
      
      // Send to Sentry if enabled
      if (config.sentry.enabled) {
        import('./sentry').then(module => module.reportError(context));
      }
    } catch (error) {
      console.warn('⚠️ Failed to report error:', error);
    }
  }

  /**
   * Track game-specific events
   */
  public trackGameEvent(event: string, gameData?: Record<string, any>): void {
    this.track(`game_${event}`, {
      ...gameData,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  /**
   * Track AI performance
   */
  public trackAIPerformance(difficulty: string, moveTime: number, moveCount: number): void {
    this.track('ai_performance', {
      difficulty,
      moveTime,
      moveCount,
      timestamp: Date.now()
    });
  }

  /**
   * Track user interactions
   */
  public trackUserInteraction(action: string, target?: string): void {
    this.track('user_interaction', {
      action,
      target,
      timestamp: Date.now()
    });
  }
}

// Export singleton instance
export const monitoring = Monitoring.getInstance();
