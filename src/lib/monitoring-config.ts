/**
 * Monitoring configuration and feature flags
 */

export interface MonitoringConfig {
  sentry: {
    enabled: boolean;
    dsn?: string;
    environment: string;
    release?: string;
  };
  posthog: {
    enabled: boolean;
    key?: string;
    host?: string;
  };
  webVitals: {
    enabled: boolean;
  };
}

/**
 * Get monitoring configuration from environment variables
 */
export function getMonitoringConfig(): MonitoringConfig {
  const isProduction = import.meta.env.MODE === 'production';
  
  return {
    sentry: {
      enabled: !!import.meta.env.VITE_SENTRY_DSN,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0'
    },
    posthog: {
      enabled: !!import.meta.env.VITE_POSTHOG_KEY,
      key: import.meta.env.VITE_POSTHOG_KEY,
      host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
    },
    webVitals: {
      enabled: !!import.meta.env.VITE_POSTHOG_KEY // Only enable if PostHog is available
    }
  };
}

/**
 * Check if monitoring is enabled for the current environment
 */
export function isMonitoringEnabled(): boolean {
  const config = getMonitoringConfig();
  return config.sentry.enabled || config.posthog.enabled;
}

/**
 * Get feature flags for monitoring
 */
export function getMonitoringFeatureFlags() {
  return {
    trackUserInteractions: true,
    trackGameEvents: true,
    trackAIPerformance: true,
    trackWebVitals: true,
    trackErrors: true,
    trackPageViews: true
  };
}
