# Navigation Guide

## Pages

### 1. Dashboard (Home Page)
**Route:** `/`

The main workflow control panel showing:
- Top bar with workflow info and controls
- Workflow canvas with visual node graph
- Right panel with enhanced inspector (workflow context, agents, node details)
- Bottom chat panel for agent interaction

**Navigate to Session Detail:**
- Click the "Detail View" button in the top bar, OR
- Double-click anywhere on the workflow canvas area

---

### 2. Session Detail View
**Route:** `/session/:sessionId`

A developer-oriented debugging interface with three columns:

**Left Panel:** Chat Session
- Conversation history between user and agents
- Scrollable message list with role indicators
- Message input box at bottom

**Center Panel:** Code Diff Viewer
- Multi-file tab interface
- Syntax-highlighted code diffs
- Green highlighting for added lines
- Red highlighting for removed lines
- Line numbers and statistics

**Right Panel:** Node State Inspector
- Selected node metadata
- Execution logs (terminal-style)
- Real-time state JSON viewer

**Controls in Top Bar:**
- Back button (returns to dashboard)
- Stop, Restart, Step, and Run buttons for execution control
- Live status indicator

---

## Navigation Flow

```
Dashboard (/)
    ↓
    Click "Detail View" or Double-click canvas
    ↓
Session Detail View (/session/:sessionId)
    ↓
    Click "Back"
    ↓
Dashboard (/)
```

---

## Features

### Dashboard Features:
- Interactive workflow node selection
- Real-time agent chat
- Workflow context overview
- Multi-agent model routing visibility
- Node state inspection

### Session Detail Features:
- Full conversation history
- Code change visualization (GitHub-style diffs)
- Detailed execution logs
- Node state debugging
- Session playback controls

---

## Design Philosophy

Both pages follow a **dark developer-oriented aesthetic** similar to:
- VSCode / Cursor
- Linear
- Vercel
- OpenAI developer tools

Key design elements:
- Minimal visual noise
- Clean spacing and hierarchy
- Subtle shadows and surfaces
- Professional color palette
- Monospace fonts for code/data
