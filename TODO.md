# Mumario Game - Rotate Screen Feature Implementation

## Plan for Task: Rotate Screen Requirement

### Information Gathered:
1. **index.html**: Contains `#orientation-warning` div with phone icon and rotate message. Has inline styles for portrait/landscape handling.
2. **style.css**: Contains orientation-related CSS including `.rotate-hint` animation. Uses CSS transforms for forced landscape.
3. **main.js**: Contains `checkOrientation()`, `handleOrientationChange()`, and `setupOrientationHandling()` functions.

### Plan:

#### 1. Update index.html - Modify orientation warning screen
- Change orientation-warning to be a full black screen by default
- Ensure message is centered with large text "ROTATE YOUR SCREEN"
- Add simple rotating icon animation (CSS-based)
- Keep existing button for manual rotation as fallback

#### 2. Update style.css - Style the rotate screen
- Make #orientation-warning full black background
- Style the "ROTATE YOUR SCREEN" message to be large and centered
- Create a simple rotating phone/refresh icon animation
- Ensure it's visible on page load

#### 3. Update main.js - Implement orientation detection logic
- Make orientation warning show on page load (even before any screen transition)
- Add logic to detect portrait vs landscape
- Prevent game from starting while in portrait mode
- When rotated to landscape:
  - Hide orientation warning
  - Request fullscreen
  - Start game normally (if it was supposed to start)
- Add orientation change listener for automatic detection
- Remove CSS transform approach (old method)

### Implementation Steps:
1. [x] Modify index.html - Update orientation-warning structure
2. [x] Modify style.css - Add full black screen styles and rotating animation
3. [x] Modify main.js - Add improved orientation detection and game blocking

### Dependent Files to be edited:
- index.html
- style.css  
- main.js

### Followup steps:
- Test the implementation
- Ensure game doesn't start in portrait mode
- Verify automatic transition to landscape works without reload

