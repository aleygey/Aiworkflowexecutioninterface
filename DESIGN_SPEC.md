# AI Workflow Dashboard - Complete Design Specification

## 🎯 Project Overview
Build a modern, high-end AI workflow execution interface similar to Linear, Vercel, or modern AI developer tools. The design must be minimal, clean, and premium with soft surfaces, subtle shadows, low visual noise, and strong hierarchy.

## 🎨 Design Principles

### Visual Style
- **Minimalism First**: Avoid heavy borders and box-in-box layouts
- **Soft Surfaces**: Use subtle shadows and gradients
- **Low Visual Noise**: Reduce unnecessary visual elements
- **Strong Hierarchy**: Clear information architecture
- **Premium Feel**: Similar quality to Linear, Vercel, or modern AI tools

### Color System (CRITICAL)
**ONLY use these colors - NO exceptions:**
- **Base**: Gray scale (background, muted, foreground)
- **Accent**: Emerald green (#10b981 family) - THE ONLY accent color
- **Remove**: NO blue, red, purple, yellow, or other colors

```css
/* Color Token Reference */
--emerald-500: rgb(16, 185, 129);
--emerald-600: rgb(5, 150, 105);
--emerald-700: rgb(4, 120, 87);
--background: /* gray tone */
--muted: /* lighter gray */
--foreground: /* text color */
```

## 🏗️ Layout Structure

### Overall Layout (4 Main Sections)
```
┌─────────────────────────────────────────────────┐
│  Top Bar (h-14)                                 │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  Workflow Canvas │  Inspector Panel             │
│  (Left 2/3)      │  (Right 1/3)                 │
│                  │                              │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│  Bottom Session Panel (h-80)                    │
└─────────────────────────────────────────────────┘
```

### 1. Top Bar (`/src/app/components/top-bar.tsx`)
**Height**: 14 (3.5rem)
**Background**: `bg-background/80 backdrop-blur-sm`
**Border**: `border-b border-border/50`

**Left Section**:
- **+ Button**: Opens task sidebar (w-8 h-8, ghost style)
- **Divider**: Vertical line (w-px h-6)
- **Workflow Title**: Text-sm font-medium

**Right Section**:
- **Status Badge**: With icon (running/completed/failed/idle)
- **Environment Label**: Text-xs in muted
- **Session Button**: Opens session dialog
- **Detail View Button**: Eye icon button

### 2. Task Sidebar (`/src/app/components/task-sidebar.tsx`)
**Type**: Sheet/Drawer from left side
**Width**: 320px (w-80)
**Trigger**: + button in top bar

**Structure**:
- **Header**: "Agent Tasks" title
- **New Task Button**: Full width, emerald-600 background
- **Task List**: Scrollable area with task cards

**Task Card**:
```tsx
- Status Icon (8x8 rounded square with bg)
- Task Title (text-sm font-medium)
- Environment + Node Count (text-xs)
- Timestamp (text-xs muted)
- Active state: bg-muted/40 with shadow
- Hover state: bg-muted/30
```

### 3. Workflow Canvas (`/src/app/components/workflow-canvas.tsx`)
**Width**: 2/3 of main area
**Background**: Gradient from background to muted/20

**Node Card**:
```tsx
Size: w-64 h-24
Background: bg-muted/20
Border: border-border/30
Padding: p-4
Shadow: Subtle on hover/active
Rounded: rounded-xl

Layout:
├─ Icon (w-10 h-10, rounded-lg, colored bg)
├─ Title (text-sm font-medium)
└─ Type Badge (text-xs, inline-flex)
```

**Node States**:
- `completed`: Emerald accent
- `running`: Gray with spinning loader
- `failed`: Muted gray
- `pending`: Very light gray

**Connection Lines**:
- Vertical SVG lines between nodes
- Color: `stroke-border/40`
- Dashed for pending connections

### 4. Inspector Panel (`/src/app/components/enhanced-inspector-panel.tsx`)
**Width**: 1/3 of main area
**Background**: `bg-background/60 backdrop-blur-sm`
**Border**: `border-l border-border/50`
**Padding**: p-6

**Sections**:

**A. Workflow Context** (Top section)
```tsx
- Goal (text-sm with label)
- Phase (text-sm with label)
- Overall Status (badge with icon)
```

**B. Node Details** (Middle section - when node selected)
```tsx
Grid Layout (2 columns):
- Title, Type, Status
- Result, Model, Attempt
- Actions, Session ID
- Pending Commands, Last Control
- Last Pull, Last Update

+ State JSON Viewer (collapsible)
```

**C. Agents Section** (Bottom section)
```tsx
Title: "Workflow Agents"
Agent Cards (each):
├─ Brain Icon (w-8 h-8, rounded)
├─ Name (text-sm font-medium)
├─ Role (text-xs muted)
└─ Model Selector (NEW FEATURE)
    - Select dropdown
    - Options: GPT-5.4, GPT-4, Claude-3.5, etc.
    - Styled as: h-6 text-xs font-mono
```

### 5. Bottom Session Panel (`/src/app/components/chat-panel.tsx`)
**Height**: 320px (h-80)
**Background**: `bg-background/80 backdrop-blur-sm`
**Border**: `border-t border-border/50`

**Structure**:
```tsx
Header:
├─ Node Title
├─ Session ID (text-xs font-mono)
└─ Status Badge

Messages Area (ScrollArea):
├─ System Messages (bg-muted/20)
├─ User Messages (bg-muted/30)
├─ Assistant Messages (bg-muted/20)
└─ Tool Messages (bg-emerald-500/10)

Input Area:
├─ Textarea (placeholder: "Send command to agent...")
└─ Send Button (emerald-600)
```

## 🔧 Technical Stack

### Core Dependencies
```json
{
  "react": "^18.x",
  "react-router": "^6.x",
  "lucide-react": "latest",
  "tailwindcss": "^4.x",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-scroll-area": "latest"
}
```

### UI Components (Shadcn-style)
Located in `/src/app/components/ui/`:
- button.tsx
- sheet.tsx (drawer/sidebar)
- select.tsx
- scroll-area.tsx
- badge.tsx
- dialog.tsx

### File Structure
```
/src
  /app
    /components
      /ui (shadcn components)
      top-bar.tsx
      task-sidebar.tsx
      workflow-canvas.tsx
      enhanced-inspector-panel.tsx
      chat-panel.tsx
      session-dialog.tsx
    /pages
      dashboard.tsx
      session-detail.tsx
    App.tsx
    routes.tsx
  /styles
    theme.css
    fonts.css
```

## 🎯 Key Features & Interactions

### 1. Task Switching
- Click **+ button** in top bar → Opens left sidebar
- Sidebar shows list of all agent tasks
- Click any task → Switch to that workflow
- "New Task" button → Create new workflow

### 2. Node Interaction
- **Click node** → Navigates to `/session/{nodeId}`
- Updates inspector panel with node details
- Updates bottom chat panel with node's conversation
- Highlights selected node on canvas

### 3. Agent Model Selection
- Each agent card has a model dropdown
- Available models:
  - GPT-5.4
  - GPT-5.4-turbo
  - GPT-4
  - GPT-4-turbo
  - Claude-3.5-Sonnet
  - Claude-3-Opus
  - Gemini-Pro
- Selection updates agent's model in real-time

### 4. Session Management
- Click "Session" button in top bar → Opens dialog
- Dialog shows detailed session information
- Eye icon → Navigate to full session detail page

## 📊 Mock Data Structure

### Tasks
```typescript
interface Task {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
  environment: string;
  timestamp: string;
  nodeCount: number;
}
```

### Workflow Nodes
```typescript
interface Node {
  id: string;
  title: string;
  type: 'coding' | 'build-flash' | 'debug';
  status: 'completed' | 'running' | 'pending' | 'failed';
}
```

### Node Details
```typescript
interface NodeDetails {
  id: string;
  title: string;
  type: string;
  status: string;
  result: string;
  model: string;
  attempt: string;
  actions: string;
  sessionId: string;
  pendingCommands: number;
  lastControl: string;
  lastPull: string;
  lastUpdate: string;
  stateJson: Record<string, any>;
}
```

### Agents
```typescript
interface Agent {
  name: string;
  model: string;
  role: string;
}
```

### Messages
```typescript
interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}
```

## 🎨 Tailwind CSS Guidelines

### Spacing Scale
- Use: 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24
- Prefer: gap-{n} over margin combinations

### Opacity Scale for Layering
```css
bg-background      /* Base layer */
bg-muted/20        /* Subtle surface */
bg-muted/30        /* Card hover */
bg-muted/40        /* Active state */
bg-background/60   /* Frosted glass */
bg-background/80   /* Semi-transparent */
```

### Border & Shadow
```css
border-border/30   /* Very subtle */
border-border/50   /* Standard */
shadow-sm         /* Subtle elevation */
shadow-md         /* Card elevation */
```

### Animation Classes
```css
hover:bg-muted/30          /* Smooth hover */
transition-all             /* Smooth transitions */
backdrop-blur-sm          /* Frosted glass */
animate-spin              /* For loading states */
```

## 🚀 Implementation Priority

### Phase 1: Core Layout ✅
1. Top Bar with + button
2. Main 3-column layout
3. Basic styling system

### Phase 2: Components ✅
1. Task Sidebar with Sheet
2. Workflow Canvas with nodes
3. Inspector Panel
4. Chat Panel

### Phase 3: Interactions ✅
1. Task switching
2. Node selection & navigation
3. Agent model selection
4. Session management

### Phase 4: Polish ✅
1. Smooth transitions
2. Loading states
3. Error handling
4. Responsive adjustments

## 🐛 Known Issues & Fixes

### Fixed Issues:
1. ✅ SheetOverlay ref warning → Use React.forwardRef
2. ✅ Missing Description warning → Add hidden SheetPrimitive.Description
3. ✅ Color consistency → Only gray + emerald green

## 📝 Usage Instructions for Claude Code

To recreate this project, provide this entire specification and say:

"Please create a React + TypeScript + Tailwind CSS v4 application following this exact specification. Focus on:
1. Matching the visual design (gray + emerald only)
2. Implementing all 4 layout sections
3. Adding the task sidebar with + button
4. Adding agent model selection dropdowns
5. Ensuring smooth interactions and navigation

Use React Router for navigation, Radix UI primitives for components, and follow the file structure specified above."

## 🎯 Quality Checklist

Before completion, verify:
- [ ] Only gray and emerald colors used
- [ ] All 4 layout sections present
- [ ] Task sidebar opens from left
- [ ] Node clicks navigate to sessions
- [ ] Agent model selectors work
- [ ] No console warnings
- [ ] Smooth animations
- [ ] Accessible (ARIA labels, descriptions)
- [ ] Responsive design
- [ ] Clean, minimal aesthetic

---

**Design Version**: 2.0
**Last Updated**: March 26, 2026
**Status**: Production Ready ✅
