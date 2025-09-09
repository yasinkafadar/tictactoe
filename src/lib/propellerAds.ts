/**
 * PropellerAds integration utility
 * Loads lightweight banner ads only (NO full-screen ads)
 */

let adsLoaded = false;
let adContainer: HTMLDivElement | null = null;

// PropellerAds configuration
const PROPELLERADS_PUBLISHER_ID = '9847075';

/**
 * Load lightweight banner ad (NO full-screen ads)
 * This should only be called after the game ends
 */
export function loadPropellerAds(): void {
  // Prevent loading multiple times
  if (adsLoaded || adContainer) {
    return;
  }

  try {
    // Create lightweight banner container
    adContainer = document.createElement('div');
    adContainer.id = 'propeller-ads-container';
    adContainer.style.cssText = `
      width: 100%;
      max-width: 728px;
      height: 90px;
      margin: 20px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 2px solid #5a67d8;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    // Create banner content (NO external scripts)
    const bannerContent = document.createElement('div');
    bannerContent.innerHTML = `
      <div style="text-align: center; padding: 20px; width: 100%;">
        <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 8px; font-weight: 500;">
          🎮 Advertisement
        </div>
        <div style="font-size: 18px; font-weight: 600; color: white; margin-bottom: 4px;">
          Play More Games!
        </div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.9); font-weight: 400;">
          Discover amazing games like this one
        </div>
      </div>
    `;

    adContainer.appendChild(bannerContent);

    // Add click tracking and redirect
    adContainer.addEventListener('click', () => {
      // Track ad click
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ad_click', {
          'ad_network': 'propellerads',
          'ad_format': 'banner',
          'publisher_id': PROPELLERADS_PUBLISHER_ID
        });
      }
      
      // Open PropellerAds in new tab
      window.open('https://propellerads.com', '_blank');
    });

    // Add hover effects
    adContainer.addEventListener('mouseenter', () => {
      adContainer!.style.transform = 'translateY(-2px)';
      adContainer!.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });

    adContainer.addEventListener('mouseleave', () => {
      adContainer!.style.transform = 'translateY(0)';
      adContainer!.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    });

    // Insert the ad into the game over section
    const gameOverSection = document.querySelector('.hud--game-over');
    if (gameOverSection) {
      gameOverSection.appendChild(adContainer);
    } else {
      // Fallback: add to body
      document.body.appendChild(adContainer);
    }
    
    // Mark as loaded
    adsLoaded = true;
    
    console.log(`PropellerAds lightweight banner loaded with Publisher ID: ${PROPELLERADS_PUBLISHER_ID}`);
  } catch (error) {
    console.error('Failed to load PropellerAds:', error);
  }
}

/**
 * Check if ads are already loaded
 */
export function areAdsLoaded(): boolean {
  return adsLoaded;
}

/**
 * Reset ads state (for testing purposes)
 */
export function resetAdsState(): void {
  if (adContainer && adContainer.parentNode) {
    adContainer.parentNode.removeChild(adContainer);
  }
  adContainer = null;
  adsLoaded = false;
}
