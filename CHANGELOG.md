# 📝 Changelog

All notable changes to Rolling TicTacToe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-19

### Added
- **Core Game Engine**
  - Rolling TicTacToe with 3×3 grid
  - Rolling rule: Maximum 3 marks per player, oldest removed on 4th placement
  - Win precedence: Winning moves take priority over mark removal
  - Complete game state management with immutable updates

- **AI System**
  - **Beginner AI**: Random moves with light preferences, blocks threats 50% of the time
  - **Moderate AI**: Always wins when possible, blocks opponent wins, uses 1-ply look-ahead
  - **Hard AI**: Minimax algorithm with alpha-beta pruning (depth 3-5)
  - Move calculation under 1 second for optimal performance

- **Game Mechanics**
  - Timer system with 180-second time limit
  - Move counter with 60-move cap to prevent endless games
  - Dynamic scoring system based on difficulty, time, and performance
  - Draw conditions: time cap, move cap, or full board

- **User Interface**
  - Modern, responsive React UI with smooth animations
  - Keyboard accessibility (keys 1-9 for cell selection)
  - Screen reader support with ARIA labels
  - Real-time updates for timer, scores, and game status
  - Heads-up display (HUD) with game information
  - Result modal with score breakdown and rematch option

- **Build System**
  - **Clean Build**: Standard game without external dependencies
  - **Crazy Build**: Game with ad SDK integration for monetization
  - Vite build system with TypeScript support
  - Cross-platform compatibility

- **Monitoring & Analytics**
  - **Sentry Integration**: Error tracking and performance monitoring
  - **PostHog Integration**: User analytics and event tracking
  - **Web Vitals**: Core Web Vitals performance metrics
  - Graceful degradation when monitoring keys are not provided

- **Testing**
  - Comprehensive test suite with 83+ test cases
  - Unit tests for engine, AI, and utility functions
  - Integration tests for game flow and edge cases
  - Mocked time for consistent test results
  - Vitest testing framework with jsdom

- **Documentation**
  - Complete README with setup and usage instructions
  - Detailed RULES.md with game mechanics and strategies
  - PRIVACY.md with data collection and usage policies
  - MONITORING.md with analytics setup guide
  - ANALYTICS_SETUP.md with monitoring configuration

### Technical Details
- **Framework**: React 18 + TypeScript + Vite
- **Architecture**: Clean architecture with pure game engine
- **Performance**: Optimized AI algorithms and efficient rendering
- **Accessibility**: Full keyboard navigation and screen reader support
- **Code Quality**: TypeScript strict mode, ESLint, comprehensive testing

### Performance
- AI move calculation: <1 second for Hard difficulty
- Bundle size: Optimized for fast loading
- Web Vitals: All metrics in "Good" range
- Cross-browser compatibility: Chrome, Firefox, Safari, Edge

### Security & Privacy
- No personal data collection
- Anonymous user IDs only
- Local storage for game state
- Optional analytics with user consent

---

## [Unreleased]

### Planned Features
- Performance optimizations
- Additional game modes
- Mobile app version
- Multiplayer support
- Enhanced AI difficulty levels

---

*For the complete list of changes, see the [Git commit history](https://github.com/your-repo/tictactoe/commits/main).*
