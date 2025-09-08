# 🎯 Rolling TicTacToe

A unique twist on the classic TicTacToe game featuring a "rolling rule" where players can only have up to 3 marks on the board at any time. When a player places their 4th mark, their oldest mark disappears!

## ✨ Features

### 🎮 **Core Gameplay**
- **3×3 TicTacToe** with innovative rolling mechanics
- **Rolling Rule**: Maximum 3 marks per player - oldest mark removed when placing 4th
- **Win Precedence**: Winning moves take priority over mark removal
- **Smart AI**: Three difficulty levels with intelligent gameplay

### 🤖 **AI Difficulty Levels**
- **Beginner**: Random moves with light preferences, blocks threats 50% of the time
- **Moderate**: Always wins when possible, blocks opponent wins, uses strategic positioning
- **Hard**: Minimax algorithm with alpha-beta pruning and strategic positioning

### ⏱️ **Game Mechanics**
- **Timer System**: 180-second time limit with visual countdown
- **Move Counter**: 60-move cap to prevent endless games
- **Scoring System**: Dynamic scoring based on difficulty, time, and performance
- **Draw Conditions**: Time cap, move cap, or full board

### 🎨 **User Interface**
- **Modern Design**: Clean, responsive UI with smooth animations
- **Keyboard Access**: Use keys 1-9 for quick cell selection
- **Accessibility**: Screen reader support and ARIA labels
- **Real-time Updates**: Live timer, score tracking, and game status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd tictactoe

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run build:clean  # Build clean version (no ads)
npm run build:crazy  # Build with ad SDK
npm run preview      # Preview production build

# Testing
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run typecheck    # TypeScript type checking
```

## 🏗️ Project Structure

```
src/
├── engine/           # Core game logic
│   ├── types.ts      # TypeScript interfaces and types
│   ├── rules.ts      # Win/draw detection and game rules
│   ├── applyMove.ts  # Move application with rolling rule
│   ├── scoring.ts    # Score calculation system
│   ├── ai.ts         # AI algorithms and decision making
│   └── tests/        # Engine unit tests
├── lib/              # Utility libraries
│   ├── timer.ts      # Game timer and time formatting
│   └── tests/        # Library unit tests
├── ui/               # React UI components
│   ├── App.tsx       # Main application component
│   ├── Board.tsx     # Game board with keyboard navigation
│   ├── Cell.tsx      # Individual cell component
│   ├── HUD.tsx       # Heads-up display (timer, scores, status)
│   ├── ResultModal.tsx # Game end modal with score breakdown
│   └── App.css       # Component styles
├── main.tsx          # Application entry point
├── index.css         # Global styles
└── test/             # Test configuration
    └── setup.ts      # Vitest setup and mocks
```

## 🎯 How to Play

### Basic Rules
1. **Place Marks**: Click cells or use keys 1-9 to place your mark (X)
2. **Rolling Rule**: When you have 3 marks, placing a 4th removes your oldest mark
3. **Win Condition**: Get 3 marks in a row (horizontal, vertical, or diagonal)
4. **Win Priority**: Winning moves take precedence over mark removal

### Controls
- **Mouse**: Click any empty cell to place your mark
- **Keyboard**: Press keys 1-9 to select cells (1=top-left, 9=bottom-right)
- **Accessibility**: Full keyboard navigation and screen reader support

### Scoring
The game uses a dynamic scoring formula:
```
Score = round(1000 × L × R × (1 / (1 + 0.02×K + 0.01×T)))
```
Where:
- **L** = Level multiplier (Beginner: 1.0, Moderate: 1.2, Hard: 1.5)
- **R** = Result multiplier (Win: 1.0, Draw: 0.5, Loss: 0.0)
- **K** = Combined move count
- **T** = Elapsed time in seconds

## 🧪 Testing

The project includes comprehensive testing:
- **83 test cases** covering all game mechanics
- **Unit tests** for engine, AI, and utility functions
- **Integration tests** for game flow and edge cases
- **Mocked time** for consistent test results

Run tests with:
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode for development
npm run test:ui       # Visual test interface
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + jsdom
- **Styling**: CSS with modern features
- **State Management**: React hooks and callbacks
- **AI Algorithms**: Custom implementations with heuristic evaluation

## 🔧 Development

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage

### Architecture
- **Clean Architecture**: Separation of concerns between engine and UI
- **Pure Functions**: Game logic is pure and testable
- **Immutable State**: Game state updates create new objects
- **Performance**: Optimized AI algorithms and efficient rendering

## 🎮 Game Variants

The project supports multiple build variants:
- **Clean**: Standard game without external dependencies
- **Crazy**: Game with ad SDK integration (for future monetization)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Completed ✅
- [x] Core game engine with rolling rule
- [x] Complete AI system (Beginner, Moderate, and Hard)
- [x] Complete UI with accessibility
- [x] Scoring and timer systems
- [x] Comprehensive testing suite
- [x] Monitoring and analytics integration
- [x] Build variants (Clean and Crazy)

### Coming Soon 🚧
- [ ] Performance optimizations
- [ ] Additional game modes
- [ ] Mobile app version
- [ ] Multiplayer support

## 🙏 Acknowledgments

- **Game Design**: Innovative rolling rule mechanics
- **AI Implementation**: Custom algorithms for engaging gameplay
- **UI/UX**: Modern, accessible interface design
- **Testing**: Comprehensive test coverage for reliability

---

**Enjoy playing Rolling TicTacToe!** 🎮✨

*Challenge yourself against the AI, master the rolling rule, and see if you can achieve the highest score!*
