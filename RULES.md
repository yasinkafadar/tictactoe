# 🎮 Game Rules - Rolling TicTacToe

## Basic Concept

Rolling TicTacToe is a unique twist on the classic 3×3 TicTacToe game featuring a "rolling rule" that adds strategic depth and prevents stalemates.

## Core Rules

### 1. **Standard TicTacToe Foundation**
- **Board**: 3×3 grid with 9 cells
- **Players**: Human (X) vs AI (O)
- **Objective**: Get 3 marks in a row (horizontal, vertical, or diagonal)
- **Turn Order**: Human moves first

### 2. **Rolling Rule** (The Key Innovation)
- **Maximum Marks**: Each player can only have **3 marks** on the board at any time
- **4th Mark Placement**: When you place your 4th mark, your **oldest mark disappears**
- **Removal Order**: Marks are removed in the order they were placed (FIFO - First In, First Out)

### 3. **Win Precedence**
- **Winning Moves Take Priority**: If placing a mark creates a win, you win immediately
- **No Removal on Win**: When you win, no mark removal occurs
- **Removal Only on Non-Win**: Mark removal only happens if the move doesn't create a win

### 4. **Game Flow**
1. **Place Mark**: Click an empty cell or use keys 1-9
2. **Check Win**: If 3 in a row → You win!
3. **Check Count**: If you now have >3 marks → Remove oldest
4. **Switch Turn**: Pass to opponent

## Game Mechanics

### **Timer System**
- **Time Limit**: 180 seconds (3 minutes) per game
- **Draw Condition**: Game ends in draw if time runs out
- **Visual Countdown**: Timer displayed in MM:SS format

### **Move Counter**
- **Move Cap**: Maximum 60 moves total (30 per player)
- **Draw Condition**: Game ends in draw if move limit reached
- **Prevents Endless Games**: Ensures games have a conclusion

### **Draw Conditions**
1. **Time Cap**: 180 seconds elapsed
2. **Move Cap**: 60 total moves reached
3. **Full Board**: All 9 cells occupied (rare with rolling rule)

## Scoring System

### **Formula**
```
Score = round(1000 × L × R × (1 / (1 + 0.02×K + 0.01×T)))
```

### **Variables**
- **L** = Level multiplier (Beginner: 1.0, Moderate: 1.2, Hard: 1.5)
- **R** = Result multiplier (Win: 1.0, Draw: 0.5, Loss: 0.0)
- **K** = Combined move count
- **T** = Elapsed time in seconds

### **Scoring Factors**
- **Higher Difficulty** = Higher multiplier
- **Faster Games** = Higher score
- **Fewer Moves** = Higher score
- **Wins** = Much higher than draws

## AI Difficulty Levels

### **Beginner**
- **Strategy**: Random moves with light preferences
- **Blocking**: Blocks immediate threats 50% of the time
- **Best For**: New players learning the rolling rule

### **Moderate**
- **Strategy**: Always wins when possible, blocks opponent wins
- **Tactics**: Uses 1-ply look-ahead with heuristic evaluation
- **Best For**: Intermediate players

### **Hard**
- **Strategy**: Minimax algorithm with alpha-beta pruning
- **Depth**: 3-5 moves ahead
- **Performance**: Move calculation under 1 second
- **Best For**: Advanced players seeking challenge

## Controls

### **Mouse**
- Click any empty cell to place your mark

### **Keyboard**
- Press keys 1-9 to select cells:
  ```
  1 | 2 | 3
  --|---|--
  4 | 5 | 6
  --|---|--
  7 | 8 | 9
  ```

### **Accessibility**
- Full keyboard navigation support
- Screen reader compatible
- ARIA labels for all interactive elements

## Strategic Tips

### **For Beginners**
1. **Learn the Rolling Rule**: Understand when marks disappear
2. **Watch Your Count**: Keep track of your marks on the board
3. **Plan Ahead**: Consider which mark will be removed next

### **For Advanced Players**
1. **Control the Center**: Center position is most valuable
2. **Block Opponent**: Prevent opponent from getting 3 in a row
3. **Timing**: Use rolling rule to your advantage
4. **Efficiency**: Win with fewer moves for higher scores

## Common Scenarios

### **Scenario 1: 4th Mark Placement**
- You have 3 marks on the board
- You place your 4th mark
- Your oldest mark disappears
- You now have 3 marks again

### **Scenario 2: Winning Move**
- You have 3 marks on the board
- You place your 4th mark
- This creates 3 in a row
- You win immediately (no removal)

### **Scenario 3: Draw by Time**
- Game has been running for 180 seconds
- No one has won yet
- Game ends in draw

## Technical Notes

- **Pure Logic**: Game engine is pure TypeScript (no React dependencies)
- **Immutable State**: Each move creates a new game state
- **Deterministic**: AI moves are deterministic (except Beginner randomness)
- **Performance**: Optimized for smooth gameplay

---

*Enjoy playing Rolling TicTacToe! Master the rolling rule and achieve the highest scores!* 🎮✨
