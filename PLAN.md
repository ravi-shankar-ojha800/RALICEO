# Mumario Rotate Screen Implementation Plan

## Current State Analysis:
- The game already has an orientation warning screen (`#orientation-warning`) with rotating icon and "ROTATE YOUR SCREEN" message
- CSS currently forces landscape by rotating the entire HTML in portrait mode - this causes issues
- The game proceeds to load regardless of orientation

## Requirements:
1. Show full black screen on website open
2. Display "ROTATE YOUR SCREEN" with rotating icon animation in center
3. Game must NOT start while in portrait mode
4. Keep rotate message visible until landscape mode detected
5. On landscape: auto-hide rotate screen, adjust to full screen, fit game ratio, start game
6. All happen automatically without page reload

## Changes Required:

### 1. index.html
- Keep orientation-warning structure (already has rotate-container with icon and title)
- Add viewport-fit=cover meta tag (already present)

### 2. style.css
- **REMOVE** the problematic CSS that rotates entire HTML in portrait mode (lines with `@media screen and (orientation:portrait)`)
- Ensure orientation-warning is always displayed in portrait mode (full black, z-index: 9999)
- Ensure game screens are hidden when in portrait mode
- Keep rotate animation for the icon

### 3. main.js
- Modify `init()` to show orientation warning first and WAIT for landscape
- Update `checkOrientation()` to properly show/hide orientation warning
- Add logic to prevent game from starting in portrait mode
- On landscape detection: hide warning, request fullscreen, start game
- Add dynamic resize handling for game canvas to fit screen ratio

## Implementation Steps:
1. Update style.css - Remove problematic portrait CSS, ensure proper orientation warning display
2. Update main.js - Improve orientation detection and game start logic
3. Test the implementation

