# TODO - Small Layout Adjustment

## Task
Move the menu icon from top-right corner to the Select Game section and arrange items side-by-side.

## Steps:
- [x] 1. Move menu-icon-btn from current position to inside menu-screen content-wrapper
- [x] 2. Update style.css to create horizontal row layout
- [x] 3. Test functionality remains the same

## Summary
- Added menu-games-row flex container to hold menu icon and game cards horizontally
- Changed games-grid from grid to flex layout
- Removed fixed positioning from menu-icon to make it work within the flex row
- Updated responsive styles for mobile devices
- All functionality remains the same - menu icon still opens overlay menu with Settings, About This Game, About The Creator options

