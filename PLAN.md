# RALICEO - Mario (Mumario) Game Improvements Plan

## Current State Analysis

### Existing Features:
1. **Mario Character** - Basic rectangle-based drawing with hat, face, overalls, shoes
2. **Coins** - Bobbing animation, golden color, basic shine
3. **Ground** - Simple green line with neon glow
4. **Platforms** - Multiple types (brick, moving, small, disappearing)
5. **Enemies** - Goomba-style with feet animation
6. **Score Counter** - Already implemented at top-right
7. **Particles** - Jump and landing dust effects

---

## Improvement Plan

### 1. Mario Character Enhancement

#### Running Animation (NEW):
- Add animation frame tracking based on velocity
- Create leg movement cycle when running
- Add arm swing animation
- Implement squash/stretch based on velocity

#### Jump Animation (ENHANCE):
- Add rotation during jump (slight tilt)
- Extend leg position during ascent
- TUCK position during descent

### 2. Coin Animation Upgrade

#### Spinning Animation:
- Implement Y-axis rotation effect (width oscillation: 20px → 5px → 20px)
- Add continuous rotation at 3-4 frames per second
- Use 3-frame sprite animation cycle

#### Shine/Glow Effect:
- Add radial gradient glow around coins (CSS-like shadow)
- Pulsing glow intensity (0.5 to 1.0 opacity cycle)
- Add sparkle particles occasionally

#### Collection Animation:
- Scale up + fade out (0.3s)
- Burst of sparkle particles (8-12 particles)
- Add +score floating text

### 3. Ground/Platform Design

#### Ground Platform (NEW):
```
Layer Structure:
- Top: Grass layer (8px) - #4a9f3d with darker edge details
- Middle: Soil layer (40px) - #8B4513 with texture pattern
- Bottom: Dark soil (32px) - #5D3A1A
```
- Add pixel-art grass blades on top edge
- Add small rock/stone details in soil
- Add root tendril patterns

#### Platform Enhancement:
- Add grass tufts on top of platforms
- Add brick texture pattern to brick platforms

### 4. Environmental Details

#### Decorative Elements (Array):
- **Grass tufts**: Small green sprites at ground level
- **Small flowers**: Red, yellow, blue pixel flowers
- **Mushrooms**: Small brown/red mushrooms (non-interactive)
- **Small rocks**: Gray pixel rocks on ground
- **Bushes**: Green bush clusters

#### Placement:
- Random spawn at ground level
- Do NOT place on gameplay paths
- Keep 80% on background layer (behind player)
- 20% can be foreground decorations

### 5. Enemy Enhancement

#### Movement Animation:
- Add body wobble/bounce while moving
- Enhance feet animation speed
- Add eye blink every 3-5 seconds

#### Collision Feedback:
- Add screen shake on player death
- Add flash effect when enemy hit from above
- Add squish animation when enemy dies

### 6. Classic Platform Features

#### Mystery Blocks (NEW):
```
Properties:
- Size: 40x40px
- Color: Gold/brown with ? symbol
- Position: Can be on ground or floating
- Trigger: Player hits from below

Behavior:
- When hit: Play bump animation
- Release: 1-3 coins burst out
- After: Change to empty block (darker color)
```
- Add mystery block object array
- Spawn randomly (15% chance per platform)
- Add "? symbol" drawing on block

#### Floating Coins:
- Already partially implemented
- Ensure coins spawn at varying heights (ground to 200px high)
- Add arc trajectory when burst from mystery block

#### Score Display (ENHANCE):
- Keep existing score at top-right
- Add coin icon next to score
- Add +25 floating text on coin collect

---

## Implementation Order

### Phase 1: Visual Foundation
1. Update ground drawing (grass + soil layers)
2. Add environmental decorations
3. Enhance mystery blocks

### Phase 2: Character & Coins
4. Add Mario running/jump animations
5. Improve coin spinning animation
6. Add coin collection effects

### Phase 3: Polish
7. Enhance enemy animations
8. Add collision feedback improvements
9. Performance optimization

---

## Files to Modify

1. **main.js** - Game logic and drawing
   - `startMumario()` - Add mystery blocks initialization
   - `generateMumarioContent()` - Add mystery blocks to generation
   - `generateMumarioCoins()` - Ensure height variation
   - `updateMumario()` - Add animations, collision handling
   - `drawMumario()` - Complete redraw with all enhancements

---

## Performance Considerations

- Keep total draw calls under 200 per frame
- Use object pooling for particles
- Limit environmental decorations to 50 max on screen
- Use requestAnimationFrame (already in place)
- Keep canvas operations simple (fillRect, arc)

---

## Backward Compatibility

- Keep all existing game mechanics intact
- Don't change physics values (gravity, speed, etc.)
- Maintain same platform generation logic
- Keep score system compatible

---

## Status: PLANNING COMPLETE ✅

Ready to proceed with implementation after user approval.

