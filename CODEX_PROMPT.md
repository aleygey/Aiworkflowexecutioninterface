# AI Workflow Dashboard — Codex 完整复刻指令

> **使用方法**：将本文件完整内容粘贴给 Codex / Claude Code / Cursor 等 AI 编程助手，说：
> *"请严格按照本文档中的代码和规范，从零创建这个 React 项目。"*

---

## 一、项目概述

构建一个**高端 AI 工作流执行界面**，风格参考 Linear、Vercel。

- **配色**：只用灰色系 + 翡翠绿（emerald）作为唯一强调色
- **框架**：React 18 + TypeScript + Tailwind CSS v4 + React Router v7
- **UI 原语**：Radix UI + Lucide React + Motion（动画）

---

## 二、依赖安装

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-scroll-area": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "latest",
    "motion": "latest",
    "react-router": "^7.0.0",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "latest",
    "tailwindcss": "^4.0.0",
    "vite": "latest"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

---

## 三、完整文件结构

```
/src
  /app
    App.tsx
    routes.tsx
    /components
      top-bar.tsx
      task-sidebar.tsx
      workflow-canvas.tsx
      workflow-node.tsx
      enhanced-inspector-panel.tsx
      chat-panel.tsx
      session-dialog.tsx
      session-top-bar.tsx
      chat-session-panel.tsx
      code-diff-viewer.tsx
      node-state-inspector.tsx
      /ui
        button.tsx
        sheet.tsx
        select.tsx
        scroll-area.tsx
        utils.ts
    /pages
      dashboard.tsx
      session-detail.tsx
  /styles
    theme.css
    index.css
    tailwind.css
```

---

## 四、全部源码（逐文件）

### `/src/app/App.tsx`

```tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

### `/src/app/routes.tsx`

```tsx
import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages/dashboard';
import { SessionDetailView } from './pages/session-detail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/session/:sessionId',
    Component: SessionDetailView,
  },
]);
```

---

### `/src/app/components/ui/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `/src/app/components/ui/button.tsx`

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border/50 bg-background hover:bg-muted/30 hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted/30 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

---

### `/src/app/components/ui/sheet.tsx`

> **关键**：`SheetOverlay` 必须用 `React.forwardRef` 包裹，否则有 ref 警告。

```tsx
"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// ⚠️ 必须用 forwardRef，否则 Radix 会报 ref 警告
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
```

---

### `/src/app/components/ui/scroll-area.tsx`

```tsx
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "./utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="ring-ring/10 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-2"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
```

---

### `/src/app/components/ui/select.tsx`

```tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "./utils";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus:ring-ring/10 flex w-fit items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
};
```

---

### `/src/app/components/top-bar.tsx`

```tsx
import { Play, Square, MessageSquare, Settings, Eye, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface TopBarProps {
  workflowTitle: string;
  sessionStatus: 'running' | 'completed' | 'failed' | 'idle';
  environment: string;
  onSessionClick: () => void;
  onDetailView?: () => void;
  onTaskSidebarToggle?: () => void;
}

const statusConfig = {
  running: { color: 'text-foreground', bg: 'bg-muted/40', label: 'Running' },
  completed: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Completed' },
  failed: { color: 'text-muted-foreground', bg: 'bg-muted/40', label: 'Failed' },
  idle: { color: 'text-muted-foreground', bg: 'bg-muted/30', label: 'Idle' },
};

export function TopBar({ workflowTitle, sessionStatus, environment, onSessionClick, onDetailView, onTaskSidebarToggle }: TopBarProps) {
  const status = statusConfig[sessionStatus];

  return (
    <div className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onTaskSidebarToggle}
        >
          <Plus className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border/50" />

        <h1 className="text-sm font-medium text-foreground">{workflowTitle}</h1>
        
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')}`} />
            <span className={`text-xs ${status.color}`}>{status.label}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30">
            <span className="text-xs text-muted-foreground">{environment}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onDetailView && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onDetailView}
          >
            <Eye className="w-4 h-4 mr-2" />
            Detail View
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={onSessionClick}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Session
        </Button>
        
        <Button variant="ghost" size="sm" className="h-8">
          <Settings className="w-4 h-4" />
        </Button>

        {sessionStatus === 'running' ? (
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Square className="w-3 h-3 mr-2" />
            Stop
          </Button>
        ) : (
          <Button size="sm" className="h-8 text-xs">
            <Play className="w-3 h-3 mr-2" />
            Run
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

### `/src/app/components/task-sidebar.tsx`

> **关键**：必须在 `SheetContent` 内放一个 `SheetPrimitive.Description className="sr-only"` 消除无障碍警告。

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { CheckCircle2, Loader2, Circle, XCircle, Plus } from 'lucide-react';
import { Button } from './ui/button';
import * as SheetPrimitive from '@radix-ui/react-dialog';

export interface Task {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
  environment: string;
  timestamp: string;
  nodeCount: number;
}

interface TaskSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  currentTaskId: string;
  onTaskSelect: (taskId: string) => void;
  onNewTask?: () => void;
}

const statusConfig = {
  running: { icon: Loader2, color: 'text-foreground', bg: 'bg-muted/40' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted/40' },
  idle: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function TaskSidebar({ 
  open, 
  onOpenChange, 
  tasks, 
  currentTaskId, 
  onTaskSelect,
  onNewTask 
}: TaskSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        {/* ⚠️ 必须加这个隐藏描述，否则 Radix 会报无障碍警告 */}
        <SheetPrimitive.Description className="sr-only">
          Browse and switch between different agent tasks and workflows
        </SheetPrimitive.Description>
        
        <SheetHeader className="px-6 py-4 border-b border-border/50">
          <SheetTitle className="text-sm font-medium">Agent Tasks</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onNewTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="px-4 pb-4 space-y-2">
            {tasks.map((task) => {
              const config = statusConfig[task.status];
              const StatusIcon = config.icon;
              const isActive = task.id === currentTaskId;

              return (
                <button
                  key={task.id}
                  onClick={() => onTaskSelect(task.id)}
                  className={`
                    w-full text-left rounded-lg p-3 transition-all
                    ${isActive 
                      ? 'bg-muted/40 shadow-md' 
                      : 'bg-muted/20 hover:bg-muted/30'
                    }
                    border border-border/30
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} flex-shrink-0 mt-0.5`}>
                      <StatusIcon 
                        className={`w-4 h-4 ${config.color} ${task.status === 'running' ? 'animate-spin' : ''}`} 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate mb-1">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{task.environment}</span>
                        <span>•</span>
                        <span>{task.nodeCount} nodes</span>
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        {task.timestamp}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
```

---

### `/src/app/components/workflow-node.tsx`

```tsx
import { motion } from 'motion/react';
import { CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed';
export type NodeType = 'coding' | 'build-flash' | 'debug' | 'deploy';

interface WorkflowNodeProps {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
  },
  running: {
    icon: Loader2,
    color: 'text-foreground',
    bgColor: 'bg-muted/40',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  failed: {
    icon: XCircle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/40',
  },
};

export function WorkflowNode({ id, title, type, status, isSelected, onClick }: WorkflowNodeProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isRunning = status === 'running';

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`
        relative rounded-xl p-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-background shadow-lg' : 'bg-background/60 shadow-md hover:shadow-lg'}
        ${isRunning ? 'ring-1 ring-foreground/20' : ''}
      `}
      style={{ backdropFilter: 'blur(8px)' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isRunning && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative z-10 flex items-start gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bgColor}`}>
          <StatusIcon
            className={`w-4 h-4 ${config.color} ${isRunning ? 'animate-spin' : ''}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{type}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className={`text-xs ${config.color}`}>{status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

---

### `/src/app/components/workflow-canvas.tsx`

```tsx
import { WorkflowNode, NodeStatus, NodeType } from './workflow-node';
import { motion } from 'motion/react';

interface Node {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
}

interface WorkflowCanvasProps {
  nodes: Node[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
}

export function WorkflowCanvas({ nodes, selectedNodeId, onNodeSelect }: WorkflowCanvasProps) {
  return (
    <div className="relative h-full overflow-auto">
      <div className="p-8 min-h-full">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative">
              <WorkflowNode
                {...node}
                isSelected={selectedNodeId === node.id}
                onClick={() => onNodeSelect(node.id)}
              />
              
              {index < nodes.length - 1 && (
                <div className="flex justify-center my-4">
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                    <motion.path
                      d="M12 0 L12 28 M12 28 L8 24 M12 28 L16 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground/30"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### `/src/app/components/enhanced-inspector-panel.tsx`

```tsx
import { ScrollArea } from './ui/scroll-area';
import { Brain, CheckCircle2, XCircle, Loader2, Circle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';

interface AgentInfo {
  name: string;
  model: string;
  role: string;
}

interface WorkflowContext {
  goal: string;
  phase: string;
  overallStatus: 'running' | 'completed' | 'failed' | 'idle';
}

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

interface EnhancedInspectorPanelProps {
  nodeDetails: NodeDetails | null;
  workflowContext: WorkflowContext;
  agents: AgentInfo[];
}

const statusConfig = {
  running: { icon: Loader2, color: 'text-foreground', bg: 'bg-muted/40' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted/40' },
  idle: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

const availableModels = [
  'GPT-5.4',
  'GPT-5.4-turbo',
  'GPT-4',
  'GPT-4-turbo',
  'Claude-3.5-Sonnet',
  'Claude-3-Opus',
  'Gemini-Pro',
];

export function EnhancedInspectorPanel({ nodeDetails, workflowContext, agents }: EnhancedInspectorPanelProps) {
  const statusCfg = statusConfig[workflowContext.overallStatus];
  const StatusIcon = statusCfg.icon;
  const [agentModels, setAgentModels] = useState<Record<number, string>>(
    agents.reduce((acc, agent, idx) => ({ ...acc, [idx]: agent.model }), {})
  );

  const handleModelChange = (index: number, model: string) => {
    setAgentModels(prev => ({ ...prev, [index]: model }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Workflow Context */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">Workflow Context</h2>
          </div>

          <div className={`rounded-xl p-4 ${statusCfg.bg} border border-border/30`}>
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon className={`w-5 h-5 ${statusCfg.color} ${workflowContext.overallStatus === 'running' ? 'animate-spin' : ''}`} />
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className={`text-sm font-medium ${statusCfg.color}`}>
                  {workflowContext.overallStatus.charAt(0).toUpperCase() + workflowContext.overallStatus.slice(1)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Current Phase</div>
                <div className="text-sm text-foreground font-medium">{workflowContext.phase}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Goal</div>
                <div className="text-sm text-foreground/90 leading-relaxed">{workflowContext.goal}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Agents</h3>
          <div className="space-y-2">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="rounded-lg bg-muted/20 border border-border/30 p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/40">
                    <Brain className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground mb-0.5">{agent.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{agent.role}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Model:</span>
                      <Select
                        value={agentModels[index]}
                        onValueChange={(value) => handleModelChange(index, value)}
                      >
                        <SelectTrigger className="h-6 text-xs font-mono bg-background/60 border-none w-auto px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model} className="text-xs">
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Details */}
        {nodeDetails ? (
          <>
            <div className="h-px bg-border/30" />

            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Selected Node
                </div>
                <h2 className="text-base font-medium text-foreground">{nodeDetails.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{nodeDetails.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-emerald-400">{nodeDetails.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Result</div>
                    <div className="text-sm text-foreground font-medium">{nodeDetails.result}</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Model</div>
                    <div className="text-sm text-foreground font-medium">{nodeDetails.model}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Execution</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Attempt</div>
                    <div className="text-sm text-foreground font-medium">{nodeDetails.attempt}</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Actions</div>
                    <div className="text-sm text-foreground font-medium">{nodeDetails.actions}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">State</h3>
                <div className="bg-muted/20 rounded-lg p-3 border border-border/30 overflow-auto">
                  <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap">
                    {JSON.stringify(nodeDetails.stateJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-px bg-border/30" />
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Select a node to view details</p>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
```

---

### `/src/app/components/chat-panel.tsx`

```tsx
import { useState } from 'react';
import { Send, User, Bot, Terminal, Code } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'system' | 'assistant' | 'user' | 'tool';
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-muted-foreground', bg: 'bg-muted/30' },
  assistant: { icon: Bot, color: 'text-foreground', bg: 'bg-muted/40' },
  user: { icon: User, color: 'text-foreground', bg: 'bg-muted/40' },
  tool: { icon: Code, color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-80 border-t border-emerald-500/20 bg-background/95 backdrop-blur-sm flex flex-col shadow-2xl">
      <div className="px-6 py-3 border-b border-border/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-medium text-foreground">Agent Chat</h3>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {messages.length} messages
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const config = roleConfig[message.role];
            const Icon = config.icon;

            return (
              <div key={message.id} className="flex gap-3 group">
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${config.bg} flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-6 py-3 border-t border-border/30 bg-muted/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to the agent..."
            className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### `/src/app/components/session-dialog.tsx`

```tsx
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Terminal, Bot, User, Code } from 'lucide-react';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-muted-foreground', label: 'System' },
  assistant: { icon: Bot, color: 'text-foreground', label: 'Agent' },
  user: { icon: User, color: 'text-foreground', label: 'User' },
  tool: { icon: Code, color: 'text-muted-foreground', label: 'Tool' },
};

export function SessionDialog({ open, onOpenChange, messages }: SessionDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-background rounded-xl border border-border/50 shadow-2xl max-h-[80vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Description className="sr-only">
            Session conversation history
          </DialogPrimitive.Description>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <DialogPrimitive.Title className="text-sm font-medium text-foreground">
              Session History
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => {
              const config = roleConfig[message.role];
              const Icon = config.icon;
              return (
                <div key={message.id} className="flex gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted/40 flex-shrink-0 mt-0.5">
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
```

---

### `/src/app/components/session-top-bar.tsx`

```tsx
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Square, Play, RotateCw, SkipForward } from 'lucide-react';
import { Button } from './ui/button';

interface SessionTopBarProps {
  sessionTitle: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
  onBack?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onStep?: () => void;
}

const statusConfig = {
  running: { icon: Loader2, label: 'Running', color: 'text-foreground', bg: 'bg-muted/40' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, label: 'Failed', color: 'text-muted-foreground', bg: 'bg-muted/40' },
  idle: { icon: Square, label: 'Idle', color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function SessionTopBar({ sessionTitle, status, onBack, onStop, onRestart, onStep }: SessionTopBarProps) {
  const statusCfg = statusConfig[status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="h-14 border-b border-border/50 bg-background/95 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="w-px h-6 bg-border/50" />

        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium text-foreground">{sessionTitle}</h1>
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md ${statusCfg.bg}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color} ${status === 'running' ? 'animate-spin' : ''}`} />
            <span className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === 'running' && (
          <Button variant="outline" size="sm" onClick={onStop} className="border-border/50">
            <Square className="w-3.5 h-3.5 mr-2" />
            Stop
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onRestart} className="border-border/50">
          <RotateCw className="w-3.5 h-3.5 mr-2" />
          Restart
        </Button>
        <Button variant="outline" size="sm" onClick={onStep} className="border-border/50">
          <SkipForward className="w-3.5 h-3.5 mr-2" />
          Step
        </Button>
        <Button size="sm" onClick={onStep} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={status === 'running'}>
          <Play className="w-3.5 h-3.5 mr-2" />
          Run
        </Button>
      </div>
    </div>
  );
}
```

---

### `/src/app/components/chat-session-panel.tsx`

```tsx
import { useState } from 'react';
import { Send, User, Bot, Terminal, Code } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'system' | 'assistant' | 'user' | 'tool';
  content: string;
  timestamp: string;
}

interface ChatSessionPanelProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-muted-foreground', bg: 'bg-muted/30', label: 'System' },
  assistant: { icon: Bot, color: 'text-foreground', bg: 'bg-muted/40', label: 'Agent' },
  user: { icon: User, color: 'text-foreground', bg: 'bg-muted/40', label: 'You' },
  tool: { icon: Code, color: 'text-muted-foreground', bg: 'bg-muted/30', label: 'Tool' },
};

export function ChatSessionPanel({ messages, onSendMessage }: ChatSessionPanelProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Chat Session</h3>
        <p className="text-xs text-muted-foreground/70 mt-1">{messages.length} messages</p>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const config = roleConfig[message.role];
            const Icon = config.icon;
            return (
              <div key={message.id} className="flex gap-3 group">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                    <span className="text-xs text-muted-foreground/60">{message.timestamp}</span>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 py-3 border-t border-border/30 bg-muted/10">
        <div className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to the agent..."
            rows={3}
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
          <Button onClick={handleSend} disabled={!input.trim()} size="sm" className="self-end bg-emerald-600 hover:bg-emerald-700 text-white">
            <Send className="w-3.5 h-3.5 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### `/src/app/components/code-diff-viewer.tsx`

```tsx
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { FileCode, GitBranch, Plus, Minus } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'header';
  content: string;
  lineNumber?: number;
}

interface FileDiff {
  fileName: string;
  path: string;
  lines: DiffLine[];
  additions: number;
  deletions: number;
}

interface CodeDiffViewerProps {
  diffs: FileDiff[];
}

export function CodeDiffViewer({ diffs }: CodeDiffViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0);

  if (diffs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background/40">
        <div className="text-center space-y-2">
          <FileCode className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">No code changes to display</p>
        </div>
      </div>
    );
  }

  const currentDiff = diffs[selectedFile];

  return (
    <div className="h-full flex flex-col bg-background/40">
      <div className="border-b border-border/30 bg-background/60">
        <div className="px-4 py-3 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Code Changes</h3>
        </div>
        <div className="flex gap-1 px-2 overflow-x-auto">
          {diffs.map((diff, index) => (
            <button
              key={index}
              onClick={() => setSelectedFile(index)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                selectedFile === index
                  ? 'bg-background/80 text-foreground border-t border-x border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5" />
                <span>{diff.fileName}</span>
                <div className="flex items-center gap-1.5 ml-1">
                  {diff.additions > 0 && <span className="text-emerald-400 text-xs">+{diff.additions}</span>}
                  {diff.deletions > 0 && <span className="text-muted-foreground text-xs">-{diff.deletions}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
        <div className="text-xs text-muted-foreground font-mono">{currentDiff.path}</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="font-mono text-xs">
          {currentDiff.lines.map((line, index) => {
            let bgColor = '';
            let textColor = 'text-foreground/90';
            let icon = null;
            let lineNumberColor = 'text-muted-foreground/50';

            if (line.type === 'added') {
              bgColor = 'bg-emerald-500/10 hover:bg-emerald-500/15';
              textColor = 'text-emerald-300';
              lineNumberColor = 'text-emerald-400';
              icon = <Plus className="w-3 h-3 text-emerald-400" />;
            } else if (line.type === 'removed') {
              bgColor = 'bg-muted/30 hover:bg-muted/40';
              textColor = 'text-muted-foreground';
              lineNumberColor = 'text-muted-foreground/70';
              icon = <Minus className="w-3 h-3 text-muted-foreground/70" />;
            } else if (line.type === 'header') {
              bgColor = 'bg-muted/20';
              textColor = 'text-muted-foreground';
            }

            return (
              <div
                key={index}
                className={`flex items-center ${bgColor} border-l-2 ${
                  line.type === 'added' ? 'border-emerald-500/50' : line.type === 'removed' ? 'border-muted-foreground/30' : 'border-transparent'
                }`}
              >
                <div className={`w-12 flex-shrink-0 text-right pr-3 py-1 ${lineNumberColor} select-none`}>
                  {line.lineNumber || ''}
                </div>
                <div className="w-6 flex items-center justify-center flex-shrink-0">{icon}</div>
                <div className={`flex-1 py-1 pr-4 ${textColor} whitespace-pre-wrap break-all`}>{line.content}</div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 py-2 border-t border-border/30 bg-muted/20 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Plus className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">{currentDiff.additions} additions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Minus className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">{currentDiff.deletions} deletions</span>
        </div>
      </div>
    </div>
  );
}
```

---

### `/src/app/components/node-state-inspector.tsx`

```tsx
import { ScrollArea } from './ui/scroll-area';
import { Box, CheckCircle2, XCircle, Loader2, Circle, Terminal } from 'lucide-react';

interface NodeState {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  type: string;
  model: string;
  executionLogs: string[];
  metadata: { attempt: string; actions: string; duration?: string; timestamp?: string; };
  stateJson: Record<string, any>;
}

interface NodeStateInspectorProps {
  nodeState: NodeState | null;
}

const statusConfig = {
  running: { icon: Loader2, color: 'text-foreground', bg: 'bg-muted/40' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted/40' },
  pending: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function NodeStateInspector({ nodeState }: NodeStateInspectorProps) {
  if (!nodeState) {
    return (
      <div className="h-full flex items-center justify-center bg-background border-l border-border/50">
        <div className="text-center space-y-2">
          <Box className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">Select a node to inspect</p>
        </div>
      </div>
    );
  }

  const statusCfg = statusConfig[nodeState.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="h-full flex flex-col bg-background border-l border-border/50">
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Node State</h3>
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">{nodeState.name}</h2>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${statusCfg.bg}`}>
              <StatusIcon className={`w-3 h-3 ${statusCfg.color} ${nodeState.status === 'running' ? 'animate-spin' : ''}`} />
              <span className={`text-xs ${statusCfg.color}`}>
                {nodeState.status.charAt(0).toUpperCase() + nodeState.status.slice(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{nodeState.type}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Metadata</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Model', value: nodeState.model, mono: true },
                { label: 'Attempt', value: nodeState.metadata.attempt },
                { label: 'Actions', value: nodeState.metadata.actions },
                ...(nodeState.metadata.duration ? [{ label: 'Duration', value: nodeState.metadata.duration }] : []),
              ].map((item) => (
                <div key={item.label} className="bg-muted/20 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className={`text-xs text-foreground ${item.mono ? 'font-mono' : ''}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Execution Logs</h4>
            </div>
            <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {nodeState.executionLogs.length > 0 ? (
                  <div className="p-3 space-y-1 font-mono text-xs">
                    {nodeState.executionLogs.map((log, index) => (
                      <div key={index} className="text-foreground/80 leading-relaxed">
                        <span className="text-muted-foreground/60 mr-2">[{index + 1}]</span>
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground">No logs available</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">State JSON</h4>
            <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
              <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(nodeState.stateJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
```

---

### `/src/app/pages/dashboard.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopBar } from '../components/top-bar';
import { WorkflowCanvas } from '../components/workflow-canvas';
import { EnhancedInspectorPanel } from '../components/enhanced-inspector-panel';
import { ChatPanel } from '../components/chat-panel';
import { SessionDialog } from '../components/session-dialog';
import { TaskSidebar, Task } from '../components/task-sidebar';

const mockNodes = [
  { id: 'node-1', title: 'Initialize Environment', type: 'coding' as const, status: 'completed' as const },
  { id: 'node-2', title: 'Create fancy hello C source', type: 'coding' as const, status: 'completed' as const },
  { id: 'node-3', title: 'Compile the C program', type: 'build-flash' as const, status: 'running' as const },
  { id: 'node-4', title: 'Transfer and run over ttyS0', type: 'debug' as const, status: 'pending' as const },
  { id: 'node-5', title: 'Verify execution logs', type: 'debug' as const, status: 'pending' as const },
];

const mockNodeDetails = {
  'node-1': {
    id: 'node-1', title: 'Initialize Environment', type: 'coding', status: 'completed',
    result: 'success', model: 'GPT-5.4', attempt: '1/3', actions: '5/30',
    sessionId: 'ses_2f9caefa3ffe...', pendingCommands: 0, lastControl: 'none',
    lastPull: 'none', lastUpdate: 'event #98',
    stateJson: { phase: 'initialization', status: 'environment ready', target_device: 'ARM Linux' },
  },
  'node-2': {
    id: 'node-2', title: 'Create fancy hello C source', type: 'coding', status: 'completed',
    result: 'success', model: 'GPT-5.4', attempt: '1/3', actions: '8/30',
    sessionId: 'ses_2f9caefa3ffe...', pendingCommands: 0, lastControl: 'none',
    lastPull: 'none', lastUpdate: 'event #156',
    stateJson: { phase: 'coding', files: ['hello_fancy.c', 'Makefile'], status: 'ready for compilation' },
  },
  'node-3': {
    id: 'node-3', title: 'Compile the C program', type: 'build-flash', status: 'running',
    result: 'in progress', model: 'GPT-5.4', attempt: '2/3', actions: '15/30',
    sessionId: 'ses_2f9caefa3ffe...', pendingCommands: 0, lastControl: 'none',
    lastPull: 'none', lastUpdate: 'event #204',
    stateJson: { phase: 'compile', target: 'ARM (Linux)', toolchain: 'gcc-arm-linux-gnueabihf' },
  },
  'node-4': {
    id: 'node-4', title: 'Transfer and run over ttyS0', type: 'debug', status: 'pending',
    result: 'pending', model: 'GPT-5.4', attempt: '0/3', actions: '0/30',
    sessionId: 'ses_2f9caefa3ffe...', pendingCommands: 0, lastControl: 'none',
    lastPull: 'none', lastUpdate: 'none',
    stateJson: { phase: 'waiting', status: 'queued' },
  },
  'node-5': {
    id: 'node-5', title: 'Verify execution logs', type: 'debug', status: 'pending',
    result: 'pending', model: 'GPT-5.4', attempt: '0/3', actions: '0/30',
    sessionId: 'ses_2f9caefa3ffe...', pendingCommands: 0, lastControl: 'none',
    lastPull: 'none', lastUpdate: 'none',
    stateJson: { phase: 'waiting', status: 'queued' },
  },
};

const workflowContext = {
  goal: 'Create a fancy hello world program in C and deploy it to an ARM Linux target device via serial connection (ttyS0)',
  phase: 'Compilation',
  overallStatus: 'running' as const,
};

const agents = [
  { name: 'Setup Agent', model: 'GPT-5.4-turbo', role: 'Environment initialization and configuration' },
  { name: 'Code Generation Agent', model: 'GPT-5.4-turbo', role: 'Source code creation and modification' },
  { name: 'Build Agent', model: 'GPT-5.4', role: 'Cross-compilation and binary generation' },
  { name: 'Deployment Agent', model: 'GPT-5.4', role: 'Binary transfer and execution' },
  { name: 'Verification Agent', model: 'GPT-5.4', role: 'Testing and validation' },
];

const mockMessages = [
  { id: 'msg-1', role: 'system' as const, content: 'Workflow execution initialized. Target environment: ARM Linux (ttyS0).', timestamp: '14:20:00' },
  { id: 'msg-2', role: 'user' as const, content: 'Create a fancy hello world program in C and deploy it to the target device via serial.', timestamp: '14:20:15' },
  { id: 'msg-3', role: 'assistant' as const, content: "I'll create a C program with ANSI color support and animated text effects. Then I'll transfer and execute it on your target device.", timestamp: '14:20:20' },
  { id: 'msg-4', role: 'tool' as const, content: 'Created hello_fancy.c with ANSI color support and animated text effects.', timestamp: '14:21:30' },
  { id: 'msg-5', role: 'tool' as const, content: 'Compilation in progress using cross-compiler for ARM target...', timestamp: '14:23:35' },
];

const mockTasks: Task[] = [
  { id: 'task-1', title: 'Fancy hello C on target via ttyS0', status: 'running', environment: 'ARM Linux', timestamp: '2 hours ago', nodeCount: 5 },
  { id: 'task-2', title: 'Deploy web server to production', status: 'completed', environment: 'AWS EC2', timestamp: '1 day ago', nodeCount: 8 },
  { id: 'task-3', title: 'Database migration and backup', status: 'completed', environment: 'PostgreSQL', timestamp: '3 days ago', nodeCount: 4 },
  { id: 'task-4', title: 'API integration testing', status: 'idle', environment: 'Node.js', timestamp: '1 week ago', nodeCount: 6 },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-3');
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(mockMessages);
  const [taskSidebarOpen, setTaskSidebarOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState('task-1');

  const selectedNodeDetails = selectedNodeId
    ? mockNodeDetails[selectedNodeId as keyof typeof mockNodeDetails] || null
    : null;

  const handleSendMessage = (message: string) => {
    const newMessage = { id: `msg-${Date.now()}`, role: 'user' as const, content: message, timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, newMessage]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'assistant' as const, content: 'I understand your request. Processing...', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  const handleNodeClick = (nodeId: string) => {
    navigate(`/session/${nodeId}`);
  };

  const handleTaskSelect = (taskId: string) => {
    setCurrentTaskId(taskId);
    setTaskSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <TopBar
        workflowTitle="Fancy hello C on target via ttyS0"
        sessionStatus="running"
        environment="ARM Linux"
        onSessionClick={() => setSessionDialogOpen(true)}
        onDetailView={() => navigate('/session/ses_2f9caefa3ffe')}
        onTaskSidebarToggle={() => setTaskSidebarOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex gap-px bg-border/30">
          <div className="flex-1 bg-background/40">
            <WorkflowCanvas nodes={mockNodes} selectedNodeId={selectedNodeId} onNodeSelect={handleNodeClick} />
          </div>
          <div className="w-[420px] bg-background/60 backdrop-blur-sm border-l border-border/50">
            <EnhancedInspectorPanel nodeDetails={selectedNodeDetails} workflowContext={workflowContext} agents={agents} />
          </div>
        </div>
      </div>

      <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />

      <SessionDialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen} messages={mockMessages} />

      <TaskSidebar
        open={taskSidebarOpen}
        onOpenChange={setTaskSidebarOpen}
        tasks={mockTasks}
        currentTaskId={currentTaskId}
        onTaskSelect={handleTaskSelect}
        onNewTask={() => setTaskSidebarOpen(false)}
      />
    </div>
  );
}
```

---

### `/src/app/pages/session-detail.tsx`

> 三列布局：左侧聊天、中间代码 diff、右侧节点状态。

```tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { SessionTopBar } from '../components/session-top-bar';
import { ChatSessionPanel } from '../components/chat-session-panel';
import { CodeDiffViewer } from '../components/code-diff-viewer';
import { NodeStateInspector } from '../components/node-state-inspector';

const mockMessages = [
  { id: 'msg-1', role: 'system' as const, content: 'Session initialized. Ready to execute workflow.', timestamp: '14:20:00' },
  { id: 'msg-2', role: 'user' as const, content: 'Create a hello world program in C with fancy formatting.', timestamp: '14:20:15' },
  { id: 'msg-3', role: 'assistant' as const, content: "I'll create a C program with ANSI color support and animated text effects.", timestamp: '14:20:18' },
  { id: 'msg-4', role: 'tool' as const, content: 'File created: hello_fancy.c\nAdded ANSI escape codes for colors\nAdded text animation functions', timestamp: '14:20:25' },
  { id: 'msg-5', role: 'assistant' as const, content: 'Source code created successfully. Now compiling for ARM architecture...', timestamp: '14:20:30' },
  { id: 'msg-6', role: 'tool' as const, content: 'Compilation started\nTarget: ARM Linux\nToolchain: gcc-arm-linux-gnueabihf\nOptimization: -O2', timestamp: '14:20:32' },
];

const mockDiffs = [
  {
    fileName: 'hello_fancy.c', path: '/workspace/hello_fancy.c', additions: 42, deletions: 0,
    lines: [
      { type: 'header' as const, content: '@@ -0,0 +1,42 @@' },
      { type: 'added' as const, content: '#include <stdio.h>', lineNumber: 1 },
      { type: 'added' as const, content: '#include <unistd.h>', lineNumber: 2 },
      { type: 'added' as const, content: '#include <string.h>', lineNumber: 3 },
      { type: 'added' as const, content: '// ANSI color codes', lineNumber: 5 },
      { type: 'added' as const, content: '#define GREEN   "\\033[32m"', lineNumber: 8 },
      { type: 'added' as const, content: 'void print_fancy(const char* text, const char* color) {', lineNumber: 14 },
      { type: 'added' as const, content: '    printf("%s%s%s\\n", color, text, RESET);', lineNumber: 15 },
      { type: 'added' as const, content: '}', lineNumber: 17 },
      { type: 'added' as const, content: 'int main() {', lineNumber: 28 },
      { type: 'added' as const, content: '    print_fancy("    FANCY HELLO WORLD v1.0    ", GREEN);', lineNumber: 30 },
      { type: 'added' as const, content: '    return 0;', lineNumber: 41 },
      { type: 'added' as const, content: '}', lineNumber: 42 },
    ],
  },
  {
    fileName: 'Makefile', path: '/workspace/Makefile', additions: 15, deletions: 0,
    lines: [
      { type: 'header' as const, content: '@@ -0,0 +1,15 @@' },
      { type: 'added' as const, content: 'CC = gcc-arm-linux-gnueabihf', lineNumber: 1 },
      { type: 'added' as const, content: 'CFLAGS = -O2 -Wall -Wextra', lineNumber: 2 },
      { type: 'added' as const, content: 'TARGET = hello_fancy', lineNumber: 3 },
      { type: 'added' as const, content: 'all: $(TARGET)', lineNumber: 6 },
    ],
  },
];

const mockNodeState = {
  id: 'node-3', name: 'Compile the C program', status: 'running' as const, type: 'build-flash',
  model: 'GPT-5.4',
  metadata: { attempt: '2/3', actions: '15/30', duration: '3.2s', timestamp: '14:23:35' },
  executionLogs: [
    'Starting cross-compilation process...',
    'Target architecture: ARM (Linux)',
    'Toolchain: gcc-arm-linux-gnueabihf',
    'Compiler flags: -O2 -Wall -Wextra',
    'Compiling hello_fancy.c...',
    'Linking binary...',
    'Binary size: 8.4 KB',
    'Compilation successful',
  ],
  stateJson: { phase: 'compile', target: 'ARM (Linux)', toolchain: 'gcc-arm-linux-gnueabihf', binary_size: '6.2 KB', status: 'in_progress', progress: 75 },
};

export function SessionDetailView() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (message: string) => {
    const newMessage = { id: `msg-${Date.now()}`, role: 'user' as const, content: message, timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
    setMessages([...messages, newMessage]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'assistant' as const, content: 'Processing your request...', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <SessionTopBar
        sessionTitle={`Session: ${sessionId || 'Unknown'}`}
        status="running"
        onBack={() => navigate('/')}
        onStop={() => console.log('Stop')}
        onRestart={() => console.log('Restart')}
        onStep={() => console.log('Step')}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0">
          <ChatSessionPanel messages={messages} onSendMessage={handleSendMessage} />
        </div>
        <div className="flex-1 min-w-0">
          <CodeDiffViewer diffs={mockDiffs} />
        </div>
        <div className="w-96 flex-shrink-0">
          <NodeStateInspector nodeState={mockNodeState} />
        </div>
      </div>
    </div>
  );
}
```

---

## 五、样式配置

### `/src/styles/theme.css` — CSS 变量（Tailwind v4 主题）

```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --border: oklch(0.269 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { font-size: var(--font-size); }
}
```

### `/src/styles/index.css`

```css
@import "./tailwind.css";
@import "./theme.css";
```

### `/src/styles/tailwind.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
```

---

## 六、已知 Bug 修复清单

| 问题 | 解决方案 |
|------|---------|
| `SheetOverlay` ref 警告 | 用 `React.forwardRef` 包裹，见 sheet.tsx |
| 无障碍 missing description 警告 | 在 `SheetContent` 内加 `<SheetPrimitive.Description className="sr-only">` |
| Motion 动画导入 | 使用 `import { motion } from 'motion/react'`，不是 `framer-motion` |
| React Router | 使用 `react-router`，不是 `react-router-dom` |

---

## 七、给 Codex 的执行指令

```
请根据本文档完整实现这个项目：

1. 创建以上所有文件，代码严格按照文档中的源码
2. 安装所需依赖：react-router, lucide-react, motion, @radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-scroll-area, class-variance-authority, clsx, tailwind-merge
3. 确保 Tailwind CSS v4 配置正确（使用 @tailwindcss/vite 插件）
4. 配色只使用灰色系 + emerald 绿，不引入其他颜色
5. 验证：点击节点跳转到 /session/:nodeId，+ 按钮打开左侧任务侧边栏，Agent 卡片有模型选择器

完成后无需额外说明，直接给出可运行的完整代码。
```
