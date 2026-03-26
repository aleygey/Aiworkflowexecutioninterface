# AI Workflow Dashboard - Project Summary

## Overview
This is a modern, high-end workflow execution interface for an AI system with a developer-oriented dark theme. The interface features two main pages: a Dashboard for workflow overview and a Session Detail View for in-depth debugging.

---

## Pages Structure

### 1. Dashboard (`/`)
**File:** `/src/app/pages/dashboard.tsx`

**Layout:**
- **Top Bar:** Workflow title, status, environment, and controls
- **Main Area (Split):**
  - **Left:** Interactive workflow canvas with visual node graph
  - **Right:** Enhanced inspector panel with workflow context, agents, and node details
- **Bottom:** Chat panel for real-time agent interaction

**Key Features:**
- Click nodes to inspect their state
- View all agents and their assigned models
- See overall workflow status and current phase
- Chat with AI agents in real-time
- Navigate to detail view via "Detail View" button or double-click

**Components Used:**
- `TopBar`
- `WorkflowCanvas`
- `EnhancedInspectorPanel`
- `ChatPanel`

---

### 2. Session Detail View (`/session/:sessionId`)
**File:** `/src/app/pages/session-detail.tsx`

**Layout (Three Columns):**
- **Left Panel (Chat Session):**
  - Full conversation history between user and agents
  - Message input with send button
  - Scrollable chat interface
  
- **Center Panel (Code Diff Viewer):**
  - Multi-file tab interface
  - GitHub-style diff view with syntax highlighting
  - Green highlighting for added lines
  - Red highlighting for removed lines
  - Line numbers and change statistics
  
- **Right Panel (Node State Inspector):**
  - Node metadata (model, attempts, actions)
  - Real-time execution logs (terminal-style)
  - State JSON viewer
  - Status indicators

**Key Features:**
- Back button to return to dashboard
- Session playback controls (Stop, Restart, Step, Run)
- Live status indicators
- Real-time code change visualization
- Detailed execution traces

**Components Used:**
- `SessionTopBar`
- `ChatSessionPanel`
- `CodeDiffViewer`
- `NodeStateInspector`

---

## Component Architecture

### Layout Components

#### `/src/app/components/top-bar.tsx`
Main dashboard top bar with:
- Workflow title and status
- Environment indicator
- Session dialog button
- Detail view navigation button
- Control buttons (Stop/Run)

#### `/src/app/components/session-top-bar.tsx`
Session detail page top bar with:
- Back navigation
- Session title and status
- Execution controls (Stop, Restart, Step, Run)

### Panel Components

#### `/src/app/components/enhanced-inspector-panel.tsx`
Right panel for dashboard showing:
- Workflow context (goal, phase, overall status)
- Agent information (name, model, role)
- Selected node details
- Execution metrics
- State JSON

#### `/src/app/components/chat-panel.tsx`
Bottom panel for dashboard with:
- Message history with role-based styling
- Input field with send button
- Emerald green accent for active state

#### `/src/app/components/chat-session-panel.tsx`
Left panel for session detail with:
- Full conversation history
- Role indicators (System, Agent, User, Tool)
- Textarea input with send functionality

#### `/src/app/components/code-diff-viewer.tsx`
Center panel for session detail featuring:
- File tab navigation
- Diff line rendering with color coding
- Addition/deletion statistics
- Monospace code display
- GitHub-style diff headers

#### `/src/app/components/node-state-inspector.tsx`
Right panel for session detail showing:
- Node metadata in card layout
- Execution logs with line numbers
- State JSON pretty-printed
- Status indicators

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

## Design System

### Visual Style
- **Theme:** Dark mode developer interface
- **Inspiration:** VSCode, Cursor, Linear, Vercel, OpenAI tools
- **Typography:** Sans-serif for UI, monospace for code/JSON
- **Colors:**
  - Primary accent: Emerald/Green
  - Status colors: Blue (running), Green (completed), Red (failed)
  - Background: Gradient from background to muted
  - Borders: Subtle with low opacity

### Layout Principles
- Minimal visual noise
- Clear hierarchy with section headers
- Subtle shadows and elevation
- Soft surfaces with backdrop blur
- Clean spacing and grouping
- Avoid heavy borders and box-in-box layouts

### Component Patterns
- Card-based layouts for metadata
- Status badges with icons
- Collapsible sections
- Tabbed interfaces for multi-file views
- Scrollable areas for long content
- Role-based color coding for messages

---

## Mock Data Structure

### Workflow Nodes
- Node ID, title, type, status
- Types: coding, build-flash, debug
- Statuses: completed, running, pending, failed

### Agent Information
- Name, model, role description
- Model variants: GPT-5.4, GPT-5.4-turbo

### Messages
- ID, role, content, timestamp
- Roles: system, assistant, user, tool

### Code Diffs
- File name, path, additions, deletions
- Line-by-line diff with type (added/removed/unchanged/header)

### Node State
- Metadata (attempts, actions, duration)
- Execution logs array
- State JSON object

---

## Key Technologies

- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** v4 for styling
- **Radix UI** components for accessible primitives
- **Lucide React** for icons
- **Vite** for build tooling

---

## File Organization

```
/src/app/
├── App.tsx                 # Root router provider
├── routes.tsx             # Route configuration
├── pages/
│   ├── dashboard.tsx      # Main workflow dashboard
│   └── session-detail.tsx # Session debugging view
└── components/
    ├── top-bar.tsx
    ├── session-top-bar.tsx
    ├── workflow-canvas.tsx
    ├── enhanced-inspector-panel.tsx
    ├── chat-panel.tsx
    ├── chat-session-panel.tsx
    ├── code-diff-viewer.tsx
    ├── node-state-inspector.tsx
    └── ui/                # Radix UI components
```

---

## Future Enhancement Ideas

1. **Real-time Updates:** WebSocket integration for live workflow updates
2. **Node Filtering:** Filter nodes by status, type, or search
3. **Execution Timeline:** Visual timeline of workflow execution
4. **Code Editor:** Inline code editing in diff viewer
5. **Export Functionality:** Export logs, diffs, or session data
6. **Keyboard Shortcuts:** Vim-style or VSCode-like shortcuts
7. **Theme Customization:** Custom color schemes
8. **Performance Metrics:** Detailed timing and resource usage
9. **Multi-session Support:** Session list and comparison
10. **Collaborative Features:** Share sessions with team members

---

## Usage Tips

- **Quick Navigation:** Double-click the canvas to jump to detail view
- **Node Inspection:** Click any node to see its details in the right panel
- **Chat Interaction:** Use the bottom chat panel for quick agent commands
- **Code Review:** Use the diff viewer to see exactly what changed
- **Execution Control:** Use Step/Run buttons to control workflow execution
- **Back Navigation:** Always use the Back button (not browser back) for proper state management

---

## Developer Notes

- All components are TypeScript with proper typing
- Mock data is defined inline for easy testing
- Responsive design with minimum widths for panels
- Smooth animations and transitions throughout
- Accessible UI components from Radix UI
- Clean separation between dashboard and detail views
- Router-based navigation for bookmarkable URLs

---

Built with ❤️ for AI workflow debugging and monitoring.
