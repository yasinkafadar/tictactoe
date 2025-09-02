/**
 * Ads module - provides different implementations based on build target
 * 
 * Build variants:
 * - clean: No-op functions for Vercel/clean builds
 * - crazy: Dynamic import of ad providers for portal builds
 */

// Default no-op implementations for clean builds
export const showInterstitial = async (): Promise<void> => {
  // No-op for clean builds
  console.log('Interstitial ad (no-op in clean build)')
}

export const showRewarded = async (): Promise<boolean> => {
  // No-op for clean builds - always return true (reward granted)
  console.log('Rewarded ad (no-op in clean build)')
  return true
}

// Dynamic import for crazy builds
if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BUILD_TARGET === 'crazy') {
  // Dynamically import ad providers for crazy builds
  import('./providers/crazygames').then(() => {
    // Override the no-op functions with real implementations
    // Note: In a real implementation, you'd need to handle this differently
    // as ES modules don't support dynamic exports like CommonJS
    console.log('Loaded CrazyGames ad providers')
  }).catch((error) => {
    console.warn('Failed to load ad providers:', error)
    // Keep no-op implementations if loading fails
  })
}
