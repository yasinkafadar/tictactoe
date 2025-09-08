# Ad Integration Setup Guide

This guide will help you set up Google AdSense integration for your tic-tac-toe game.

## 🚀 Quick Setup

### 1. Get Google AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up for an account
3. Get approved (this can take a few days to weeks)
4. Once approved, you'll get your AdSense client ID (starts with `ca-pub-`)

### 2. Configure Environment Variables
1. Copy `env.example` to `.env.local`
2. Update the following variables:
```bash
VITE_ENABLE_ADS=true
VITE_ADSENSE_CLIENT_ID=ca-pub-YOUR_ACTUAL_CLIENT_ID
```

### 3. Create Ad Units
1. In your AdSense dashboard, create ad units:
   - **Header Ad**: 728x90 (Leaderboard)
   - **Sidebar Ad**: 160x600 (Wide Skyscraper) 
   - **Game Over Ad**: 300x250 (Medium Rectangle)

2. Get the ad slot IDs for each unit

### 4. Update Ad Slot IDs
Update the slot IDs in these files:
- `src/ui/ads/HeaderAd.tsx` - Replace `"1122334455"`
- `src/ui/ads/SidebarAd.tsx` - Replace `"0987654321"`
- `src/ui/ads/GameOverAd.tsx` - Replace `"1234567890"`

## 📍 Ad Placements

### Header Ad
- **Location**: Top of the page, above game controls
- **Format**: 728x90 Leaderboard
- **Visibility**: Always visible

### Sidebar Ad
- **Location**: Right side of screen (desktop), below game (mobile)
- **Format**: 160x600 Wide Skyscraper
- **Visibility**: Fixed position on desktop

### Game Over Ad
- **Location**: In the game over HUD, above "Play Again" button
- **Format**: 300x250 Medium Rectangle
- **Visibility**: Only shown when game ends

## 🎨 Ad Styling

Ads are styled to match your game's design:
- Glass morphism effects
- Gradient backgrounds
- Smooth hover animations
- Mobile-responsive design

## 🧪 Testing

### Development Mode
- Ads show as placeholder boxes with "Ad Space" text
- Set `VITE_ENABLE_ADS=true` to test real ads in development

### Production Mode
- Real ads will display automatically
- Make sure your domain is approved by AdSense

## 💰 Revenue Optimization

### Best Practices
1. **Don't click your own ads** - This violates AdSense policies
2. **Place ads strategically** - Don't interfere with gameplay
3. **Monitor performance** - Use AdSense dashboard to track earnings
4. **A/B test placements** - Try different ad positions

### Expected Revenue
- **Small games**: $1-10/month
- **Popular games**: $50-500/month
- **Viral games**: $1000+/month

## 🚨 Important Notes

1. **AdSense Approval**: Your site needs to be approved before ads show
2. **Content Policy**: Ensure your game follows AdSense content policies
3. **Traffic Requirements**: You need consistent traffic to earn significant revenue
4. **Payment Threshold**: AdSense has a $100 minimum payout threshold

## 🔧 Troubleshooting

### Ads Not Showing
1. Check if your domain is approved
2. Verify ad slot IDs are correct
3. Ensure environment variables are set
4. Check browser console for errors

### Low Revenue
1. Increase traffic to your game
2. Optimize ad placements
3. Improve user engagement
4. Consider premium features as alternative revenue

## 📊 Analytics Integration

The game already includes analytics tracking that can help you:
- Monitor user engagement
- Track game completion rates
- Identify popular features
- Optimize ad placement based on user behavior

## 🎯 Next Steps

1. Set up your AdSense account
2. Configure environment variables
3. Deploy to production
4. Monitor performance and optimize
5. Consider adding premium features for additional revenue
