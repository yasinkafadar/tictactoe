# 📊 Monitoring & Analytics Setup

This document explains how to set up and configure monitoring for the TicTacToe Rolling game.

## 🎯 Overview

The game includes comprehensive monitoring with three main services:

- **🔍 Sentry** - Error tracking and performance monitoring
- **📈 PostHog** - User analytics and event tracking  
- **⚡ Web Vitals** - Core Web Vitals performance metrics

## 🚀 Quick Setup

### 1. Environment Variables

Copy `env.example` to `.env.local` and add your monitoring keys:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual keys:

```env
# Sentry Error Tracking
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# PostHog Analytics  
VITE_POSTHOG_KEY=phc_your-posthog-key
VITE_POSTHOG_HOST=https://app.posthog.com

# App Version (optional)
VITE_APP_VERSION=1.0.0
```

### 2. Get Your Keys

#### Sentry Setup
1. Go to [sentry.io](https://sentry.io) and create a project
2. Copy your DSN from Project Settings → Client Keys
3. Add it to `VITE_SENTRY_DSN`

#### PostHog Setup  
1. Go to [posthog.com](https://posthog.com) and create a project
2. Copy your Project API Key from Project Settings
3. Add it to `VITE_POSTHOG_KEY`

## 📊 What's Tracked

### Game Events
- **Game Start/End** - When games begin and complete
- **Moves** - Human and AI moves with timing
- **Results** - Win/loss/draw outcomes
- **Difficulty Changes** - When players change AI difficulty
- **User Interactions** - Button clicks, cell selections

### Performance Metrics
- **AI Performance** - Move calculation times by difficulty
- **Web Vitals** - CLS, FID, FCP, LCP, TTFB
- **Game Duration** - How long games take to complete
- **Move Count** - Number of moves per game

### Error Tracking
- **AI Errors** - When AI fails to make moves
- **Game Logic Errors** - Unexpected game state issues
- **JavaScript Errors** - Runtime errors and exceptions

## 🔧 Configuration

### Monitoring Features

All monitoring is **optional** and **gracefully disabled** if keys are not provided:

```typescript
// No keys = monitoring disabled, no errors
// Keys provided = monitoring enabled automatically
```

### Feature Flags

You can control what gets tracked via the monitoring configuration:

```typescript
// src/lib/monitoring-config.ts
export function getMonitoringFeatureFlags() {
  return {
    trackUserInteractions: true,    // Button clicks, selections
    trackGameEvents: true,          // Game start/end, moves
    trackAIPerformance: true,       // AI timing metrics
    trackWebVitals: true,           // Core Web Vitals
    trackErrors: true,              // Error reporting
    trackPageViews: true            // Page navigation
  };
}
```

## 🎮 Game-Specific Tracking

### Events Tracked

| Event | Description | Data |
|-------|-------------|------|
| `game_loaded` | Game initializes | URL, timestamp |
| `game_start` | New game begins | Difficulty, timestamp |
| `human_move` | Player makes move | Cell, move count, difficulty |
| `ai_move` | AI makes move | Cell, move count, difficulty, timing |
| `game_complete` | Game ends | Result, duration, moves, win line |
| `user_interaction` | UI interactions | Action, target, timestamp |

### Performance Tracking

- **AI Move Times** - How long each difficulty takes to calculate moves
- **Game Duration** - Total time from start to finish
- **Move Efficiency** - Moves per second, optimal play patterns

## 🛡️ Privacy & Security

### Data Collected
- **Anonymous User IDs** - Generated locally, not tied to personal info
- **Game Performance** - Move times, difficulty, outcomes
- **Technical Metrics** - Browser info, performance data
- **No Personal Data** - No names, emails, or identifying information

### Data Storage
- **Sentry** - Error logs and performance data
- **PostHog** - Analytics events and user behavior
- **Local Storage** - Anonymous user IDs only

## 🔍 Monitoring Dashboard

### Sentry Dashboard
- **Errors** - Real-time error tracking
- **Performance** - Transaction timing and bottlenecks
- **Releases** - Track issues by app version

### PostHog Dashboard  
- **Events** - User behavior and game interactions
- **Funnels** - Game completion rates
- **Cohorts** - User retention and engagement
- **Insights** - AI performance and difficulty analysis

## 🚀 Production Deployment

### Vercel Environment Variables

Add your monitoring keys to Vercel:

```bash
# Via Vercel CLI
vercel env add VITE_SENTRY_DSN
vercel env add VITE_POSTHOG_KEY
vercel env add VITE_POSTHOG_HOST

# Or via Vercel Dashboard
# Project Settings → Environment Variables
```

### Build Variants

Monitoring works with both build variants:

- **`clean`** - No ads, full monitoring
- **`crazy`** - With ads, full monitoring

## 🧪 Testing

### Local Testing
```bash
# Test without monitoring keys (should work fine)
npm run dev

# Test with monitoring keys
# Add keys to .env.local and restart dev server
```

### Production Testing
```bash
# Build and test
npm run build:clean
npm run preview

# Deploy to Vercel
npx vercel --prod
```

## 📈 Analytics Insights

### Key Metrics to Monitor

1. **Game Completion Rate** - How many games finish vs. abandon
2. **AI Performance** - Move times by difficulty level
3. **User Engagement** - Games per session, difficulty preferences
4. **Error Rates** - AI failures, game logic issues
5. **Performance** - Web Vitals scores, load times

### Recommended Alerts

- **High Error Rate** - >5% of games have errors
- **Slow AI** - Hard AI taking >2 seconds per move
- **Poor Performance** - Web Vitals below "Good" threshold
- **Low Engagement** - <50% game completion rate

## 🔧 Troubleshooting

### Common Issues

**Monitoring not working?**
- Check environment variables are set correctly
- Verify keys are valid and active
- Check browser console for initialization errors

**Too much data?**
- Adjust feature flags in `monitoring-config.ts`
- Filter events in Sentry/PostHog dashboards
- Use sampling rates for high-volume events

**Performance impact?**
- Monitoring is designed to be lightweight
- Uses dynamic imports to avoid bundle bloat
- Graceful fallbacks if services are unavailable

## 📚 Further Reading

- [Sentry Documentation](https://docs.sentry.io/)
- [PostHog Documentation](https://posthog.com/docs)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**🎮 Your TicTacToe Rolling game now has professional-grade monitoring!** 

Track user behavior, monitor performance, and catch errors before they impact your players. 🚀
