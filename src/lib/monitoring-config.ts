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
  const meta = import.meta as any;
  
  return {
    sentry: {
      enabled: !!meta.env?.VITE_SENTRY_DSN,
      dsn: meta.env?.VITE_SENTRY_DSN,
      environment: meta.env?.MODE || 'development',
      release: meta.env?.VITE_APP_VERSION || '1.0.0'
    },
    posthog: {
      enabled: !!meta.env?.VITE_PUBLIC_POSTHOG_KEY,
      key: meta.env?.VITE_PUBLIC_POSTHOG_KEY,
      host: meta.env?.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
    },
    webVitals: {
      enabled: !!meta.env?.VITE_PUBLIC_POSTHOG_KEY // Only enable if PostHog is available
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
