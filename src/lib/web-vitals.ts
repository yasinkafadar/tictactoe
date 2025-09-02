/**
 * Web Vitals performance monitoring
 * Tracks Core Web Vitals and sends to PostHog
 */

/**
 * Initialize web vitals monitoring
 */
export async function initializeWebVitals(): Promise<void> {
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    
    // Track Cumulative Layout Shift (CLS)
    getCLS((metric) => {
      trackWebVital('CLS', metric);
    });

    // Track First Input Delay (FID)
    getFID((metric) => {
      trackWebVital('FID', metric);
    });

    // Track First Contentful Paint (FCP)
    getFCP((metric) => {
      trackWebVital('FCP', metric);
    });

    // Track Largest Contentful Paint (LCP)
    getLCP((metric) => {
      trackWebVital('LCP', metric);
    });

    // Track Time to First Byte (TTFB)
    getTTFB((metric) => {
      trackWebVital('TTFB', metric);
    });

    console.log('📈 Web Vitals monitoring initialized');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Web Vitals:', error);
  }
}

/**
 * Track a web vital metric
 */
function trackWebVital(name: string, metric: any): void {
  try {
    // Import PostHog dynamically to avoid circular dependencies
    import('./posthog').then(module => {
      module.trackEvent('web_vital', {
        metric_name: name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        navigation_type: metric.navigationType,
        rating: getVitalRating(name, metric.value),
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.warn(`⚠️ Failed to track ${name} metric:`, error);
  }
}

/**
 * Get rating for a web vital metric
 */
function getVitalRating(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs_improvement';
      return 'poor';
    
    case 'FID':
      if (value <= 100) return 'good';
      if (value <= 300) return 'needs_improvement';
      return 'poor';
    
    case 'FCP':
      if (value <= 1800) return 'good';
      if (value <= 3000) return 'needs_improvement';
      return 'poor';
    
    case 'LCP':
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs_improvement';
      return 'poor';
    
    case 'TTFB':
      if (value <= 800) return 'good';
      if (value <= 1800) return 'needs_improvement';
      return 'poor';
    
    default:
      return 'unknown';
  }
}

/**
 * Track custom performance metrics
 */
export function trackCustomMetric(name: string, value: number, metadata?: Record<string, any>): void {
  try {
    import('./posthog').then(module => {
      module.trackEvent('custom_metric', {
        metric_name: name,
        value,
        ...metadata,
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.warn(`⚠️ Failed to track custom metric ${name}:`, error);
  }
}

/**
 * Track game-specific performance metrics
 */
export function trackGamePerformance(metric: string, value: number, context?: Record<string, any>): void {
  trackCustomMetric(`game_${metric}`, value, {
    ...context,
    game_version: '1.0.0',
    platform: 'web'
  });
}

/**
 * Track AI performance metrics
 */
export function trackAIPerformance(difficulty: string, moveTime: number, moveCount: number): void {
  trackGamePerformance('ai_move_time', moveTime, {
    difficulty,
    move_count: moveCount,
    performance_rating: getAIPerformanceRating(moveTime)
  });
}

/**
 * Get AI performance rating based on move time
 */
function getAIPerformanceRating(moveTime: number): string {
  if (moveTime < 100) return 'excellent';
  if (moveTime < 500) return 'good';
  if (moveTime < 1000) return 'average';
  return 'slow';
}
