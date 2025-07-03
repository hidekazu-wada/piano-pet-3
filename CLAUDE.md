# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Piano Practice Assistant (Piano Pet 3) is a gamified piano practice tracking application for elementary school students. It uses pure HTML/CSS/JavaScript with localStorage for data persistence.

## Architecture

### Core Structure
- **index.html**: Single-page application with all screens (home, practice, evaluation, settings)
- **app.js**: Main `PianoPracticeApp` class handling all logic and state
- **style.css**: Complete styling with animations and responsive design
- **No build process**: Open index.html directly in browser

### Data Model
```javascript
{
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

### Key Features
1. **Level System**: Points from practice time (1pt/2min), performance (0-10), and attitude (1-10)
2. **Practice Management**: Add/edit/delete songs and practice items with checkpoints
3. **Timer**: Built-in timer for tracking practice duration
4. **Master Status**: Achieved when performance rating reaches 10

## Important Implementation Details

### State Management
- All data stored in localStorage under 'practiceData' key
- Settings (API keys) stored separately
- Automatic save on any data modification

### UI Patterns
- Modal system for all forms (add/edit/delete operations)
- Screen navigation via show/hide methods
- Event handlers use both onclick attributes and addEventListener

### Level Calculation
```javascript
timePoints = Math.floor(practiceMinutes / 2);
performanceMap = { 0:0, 3:2, 6:4, 9:8, 10:10 };
attitudeMap = { 1:1, 2:3, 3:10 };  // 3 = self-directed improvement (highest)
totalLevel = timePoints + performancePoints + attitudePoints;
```

### Future Features (Prepared)
- Gemini API integration for motivational messages
- 11Labs API for voice feedback
- Settings screen already includes API key inputs

## Development Notes

### When Adding Features
- Maintain child-friendly Japanese UI text
- Keep touch targets large (min 30x30px)
- Save data immediately after any changes
- Use existing modal patterns for new forms

### When Modifying Levels
- Balance points to encourage regular practice
- Self-directed practice should remain highest value
- Test cumulative point system behavior

### Common Tasks
- Add practice items: Use existing modal pattern in `showAddPracticeModal()`
- Modify scoring: Update point maps in `saveEvaluation()`
- Add new screens: Follow existing screen navigation pattern