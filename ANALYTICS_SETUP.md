# Analytics Setup Guide

This project uses PostHog for analytics tracking. Here's how to set it up:

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# PostHog Analytics
VITE_PUBLIC_POSTHOG_KEY=phc_tFJcNs9utpPPrUjddjUjm0z8SjCjUT7CChmetnj7Pwz
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App Version
VITE_APP_VERSION=1.0.0

# Build Target
VITE_BUILD_TARGET=clean
```

## What's Tracked

The analytics system tracks the following events:

### Game Events
- `game_loaded` - When the game initializes
- `game_complete` - When a game ends (win/draw)
- `game_human_move` - When the human player makes a move
- `game_ai_move` - When the AI makes a move
- `game_result_modal_opened` - When the result modal is shown

### User Interactions
- `user_interaction` - General user interactions (clicks, keyboard input)
- Cell clicks, keyboard moves, difficulty changes, new game, rematch, modal interactions

### AI Performance
- `ai_performance` - AI move timing and performance metrics
- Tracks move time, difficulty level, and performance rating

### Session Data
- Game duration, move count, difficulty level, final scores
- User identification with anonymous IDs
- Browser and platform information

## Analytics Features

- **Anonymous User Tracking**: Each user gets a unique anonymous ID stored in localStorage
- **Session Tracking**: Each game session gets a unique session ID
- **Performance Monitoring**: Tracks AI response times and game performance
- **Error Tracking**: Integrates with Sentry for error reporting
- **Web Vitals**: Tracks Core Web Vitals for performance monitoring

## Privacy

- All tracking is anonymous by default
- No personal information is collected
- Users can disable tracking by not providing PostHog credentials
- Data is sent to PostHog's US instance (https://us.i.posthog.com)

## Development

To test analytics in development:

1. Set up the environment variables as shown above
2. Run `npm run dev`
3. Open the browser console to see analytics events being logged
4. Check your PostHog dashboard for incoming events

## Production Deployment

Make sure to set the environment variables in your deployment platform:

- **Vercel**: Add environment variables in the Vercel dashboard
- **Netlify**: Add environment variables in Site Settings
- **Other platforms**: Set the variables according to your platform's documentation

The analytics will automatically initialize when the app loads if the PostHog key is provided.
