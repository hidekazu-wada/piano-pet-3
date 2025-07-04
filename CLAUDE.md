# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Piano Practice Assistant (Piano Pet 3) is a gamified piano practice tracking application for elementary school students. It uses pure HTML/CSS/JavaScript with localStorage for data persistence and features a collectible pet gacha system to motivate practice.

## Architecture

### Core Structure
- **index.html**: Single-page application with all screens (home, practice, evaluation, gacha, collection)
- **app.js**: Main `PianoPracticeApp` class handling all logic and state
- **style.css**: Complete styling with animations and responsive design
- **videos/**: Pet character videos for gacha rewards
- **sounds/**: Pet character sound effects
- **No build process**: Open index.html directly in browser

### Data Model
```javascript
{
  gachaPoints: number,
  collection: {
    videos: [{ id, name, filename, audioFilename, description, obtained: boolean }]
  },
  songs: {
    [songId]: {
      id, title,
      practices: [{
        id, title, description, level, isCompleted,
        levelBreakdown: { timePoints, performancePoints, attitudePoints },
        practiceTime, lastPracticed,
        checkPoints: [{ id, text, checked }]
      }]
    }
  }
}
```

### Game Balance Configuration

**CRITICAL**: All game balance is controlled via `PianoPracticeApp.GAME_CONFIG` (lines 3-45 in app.js):

```javascript
static GAME_CONFIG = {
  level: {
    timePointsInterval: 5, // minutes per time point
    performance: { 0:0, 3:1, 6:2, 9:3, 10:5 }, // performance rating to points
    attitude: { 0:0, 1:0, 2:1, 3:3 }, // attitude rating to points
  },
  gacha: {
    cost: 1000, // points required per gacha roll
    rewards: {
      levelUpPoints: 10, // points per level gained
      masterBonus: 50, // bonus for mastering a practice
      levelMilestones: { 10:10, 20:20, 30:30 }, // milestone bonuses
    },
  },
}
```

### Key Features
1. **Level System**: Points from practice time, performance evaluation, and attitude assessment
2. **Gacha System**: Collect pet characters using points earned from practice
3. **Collection Screen**: View collected pets with video animations and sound effects
4. **Practice Management**: Add/edit/delete songs and practice items with checkpoints
5. **Timer**: Built-in timer for tracking practice duration

## Important Implementation Details

### State Management
- All data stored in localStorage under 'practiceData' key
- Animal data centrally managed in `PianoPracticeApp.ANIMAL_DATA`
- Automatic save on any data modification
- New animals automatically added to existing save data

### Gacha System Architecture
- **Collection Completion**: Gacha disabled when all registered animals collected
- **Dynamic Animal Management**: New animals in `ANIMAL_DATA` auto-added to collections
- **Filtered Display**: Only shows animals present in `ANIMAL_DATA` (handles removed animals)
- **Reset Functionality**: Collection can be reset while preserving gacha points

### UI Patterns
- Modal system for all forms (add/edit/delete operations)
- Screen navigation via show/hide methods with active class toggling
- Event handlers use both onclick attributes and addEventListener
- Video elements with hover-to-play animations in collection

### Level Calculation (via GAME_CONFIG)
```javascript
timePoints = Math.floor(practiceMinutes / config.level.timePointsInterval);
performancePoints = config.level.performance[selectedLevel] || 0;
attitudePoints = config.level.attitude[selectedAttitude] || 0;
totalLevel = timePoints + performancePoints + attitudePoints;
```

## Development Notes

### Game Balance Tuning
- Modify `GAME_CONFIG` values for immediate balance changes
- Test gacha acquisition rates: aim for 3-5 practice completions per gacha
- Balance encourages consistent practice over short-term grinding

### When Adding New Animals
1. Add entry to `ANIMAL_DATA` with unique pet ID
2. Place video file in `/videos/` directory
3. Place audio file in `/sounds/` directory
4. Existing save data automatically updated on next load

### When Adding Features
- Maintain child-friendly Japanese UI text
- Keep touch targets large (min 30x30px) for mobile
- Save data immediately after any changes
- Use existing modal patterns for new forms
- Filter displayed animals by `ANIMAL_DATA` presence

### Common Tasks
- **Balance adjustment**: Modify `GAME_CONFIG` values
- **Add practice items**: Use existing modal pattern in `showAddPracticeModal()`
- **Add new animals**: Update `ANIMAL_DATA` and add media files
- **Screen navigation**: Follow existing `show[Screen]Screen()` pattern