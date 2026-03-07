# Mumario Game Improvement Plan

## Information Gathered from Analysis
- **Current State**: Basic Mario-style platformer with fixed level width (4000px)
- **Rendering**: HTML5 Canvas
- **Physics**: Acceleration (0.5), max velocity (6), gravity (0.6), jump velocity (-12)
- **Score**: Coins (+25), Enemies (+100), Level completion (+1000)
- **Platforms**: Ground (large) and brick platforms (small)
- **Enemies**: Goomba-style, patrol behavior

## Plan: Mumario Endless Mode Upgrade

### File to Edit: main.js

### Changes Required:

#### 1. Endless Level Generation (startMumario & updateMumario)
- Remove fixed level width
- Generate platforms, gaps, coins, enemies procedurally as player progresses
- Track `mumarioDistance` to measure how far player has traveled
- Generate new content ahead of camera view

#### 2. Platform Variety (new platform types)
Add to platform generation:
- **Normal platforms**: Standard brick platforms
- **Moving platforms**: Move horizontally or vertically
- **Small floating platforms**: Tiny platforms (60-80px wide)
- **Disappearing platforms**: Fall after player stands on them for 1 second

#### 3. Physics Improvements
- Add landing detection with visual feedback
- Add jump squash/stretch effects
- Smooth acceleration/deceleration

#### 4. Difficulty Progression
- `difficultyMultiplier`: Starts at 1.0, increases by 0.001 per frame
- Platform gaps increase with distance
- More enemies spawn at higher difficulty
- Platform types become harder (more moving/disappearing)

#### 5. Visual Feedback
- **Jump effect**: Small particle burst upward from player
- **Landing effect**: Dust particles spread horizontally
- **Better coin particles**: More vibrant

#### 6. Score System Update
- Distance traveled: +1 point per 10 pixels
- Coins: +25 points
- Enemies stomped: +100 points

#### 7. Game Over Trigger
- Player falls below screen (y > canvas.height)

### Implementation Steps:
1. Update `startMumario()` - Remove level width limit, initialize procedural generation variables
2. Update `updateMumario()` - Add endless generation, difficulty progression
3. Add platform type handling (moving, small, disappearing)
4. Add visual effects (jump particles, landing dust)
5. Update score to include distance

### Testing:
- Run game and verify endless generation
- Check platform variety works
- Verify difficulty increases over time
- Test all visual effects
- Ensure game over triggers correctly when falling

