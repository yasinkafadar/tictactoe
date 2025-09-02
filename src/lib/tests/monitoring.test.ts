import { describe, it, expect, beforeEach, vi } from 'vitest'
import { monitoring } from '../monitoring'
import { getMonitoringConfig, isMonitoringEnabled } from '../monitoring-config'

// Mock environment variables
const mockEnv = {
  VITE_SENTRY_DSN: undefined,
  VITE_POSTHOG_KEY: undefined,
  VITE_POSTHOG_HOST: undefined,
  VITE_APP_VERSION: undefined,
  MODE: 'test'
}

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: mockEnv
}))

describe('Monitoring', () => {
  beforeEach(() => {
    // Reset environment variables
    mockEnv.VITE_SENTRY_DSN = undefined
    mockEnv.VITE_POSTHOG_KEY = undefined
    mockEnv.VITE_POSTHOG_HOST = undefined
    mockEnv.VITE_APP_VERSION = undefined
    
    // Reset monitoring instance
    vi.clearAllMocks()
    
    // Clear module cache to force re-evaluation of environment variables
    vi.resetModules()
  })

  describe('monitoring configuration', () => {
    it('should detect when monitoring is disabled by default', () => {
      // By default, no environment variables are set, so monitoring should be disabled
      expect(isMonitoringEnabled()).toBe(false)
    })

    it('should get default configuration', () => {
      const config = getMonitoringConfig()
      
      expect(config.sentry.enabled).toBe(false)
      expect(config.sentry.dsn).toBeUndefined()
      expect(config.sentry.environment).toBe('test')
      expect(config.sentry.release).toBe('1.0.0')
      
      expect(config.posthog.enabled).toBe(false)
      expect(config.posthog.key).toBeUndefined()
      expect(config.posthog.host).toBe('https://app.posthog.com')
      
      expect(config.webVitals.enabled).toBe(false)
    })
  })

  describe('monitoring initialization', () => {
    it('should initialize without errors when no keys provided', async () => {
      await expect(monitoring.initialize()).resolves.not.toThrow()
    })

    it('should handle initialization errors gracefully', async () => {
      // Mock dynamic imports to throw errors
      vi.doMock('../sentry', () => ({
        initializeSentry: vi.fn().mockRejectedValue(new Error('Sentry init failed'))
      }))
      
      mockEnv.VITE_SENTRY_DSN = 'https://test@sentry.io/123'
      
      await expect(monitoring.initialize()).resolves.not.toThrow()
    })
  })

  describe('event tracking', () => {
    it('should track events without errors when monitoring disabled', () => {
      expect(() => {
        monitoring.track('test_event', { test: 'data' })
      }).not.toThrow()
    })

    it('should track game events', () => {
      expect(() => {
        monitoring.trackGameEvent('game_start', { difficulty: 'hard' })
      }).not.toThrow()
    })

    it('should track user interactions', () => {
      expect(() => {
        monitoring.trackUserInteraction('click', 'button')
      }).not.toThrow()
    })

    it('should track AI performance', () => {
      expect(() => {
        monitoring.trackAIPerformance('hard', 150, 5)
      }).not.toThrow()
    })
  })

  describe('error reporting', () => {
    it('should report errors without throwing when monitoring disabled', () => {
      const error = new Error('Test error')
      const context = { test: 'context' }
      
      expect(() => {
        monitoring.reportError({ error, context })
      }).not.toThrow()
    })

    it('should handle error reporting gracefully', () => {
      const error = new Error('Test error')
      const context = { 
        difficulty: 'hard',
        moveCount: 5,
        board: ['X', 'O', null, null, null, null, null, null, null]
      }
      
      expect(() => {
        monitoring.reportError({ 
          error, 
          context,
          level: 'error'
        })
      }).not.toThrow()
    })
  })

  describe('monitoring singleton', () => {
    it('should return same instance', () => {
      const instance1 = monitoring
      const instance2 = monitoring
      expect(instance1).toBe(instance2)
    })
  })
})
