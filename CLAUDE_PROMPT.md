# 🤖 Claude Code 复现 Prompt

## 快速版本（直接复制给 Claude）

```
我需要你帮我创建一个高端的 AI 工作流执行界面，设计风格类似 Linear、Vercel 等现代开发工具。

## 设计要求

### 1. 配色方案（严格遵守）
- 只使用灰色系 + 翡翠绿（emerald）作为唯一强调色
- 禁止使用：蓝色、红色、紫色、黄色等其他颜色
- 翡翠绿仅用于：主按钮、成功状态、强调元素

### 2. 布局结构（4个主要区域）

┌─────────────────────────────────────────────────┐
│  Top Bar (高度: 56px)                           │
│  [+] [分隔线] [工作流标题] ... [状态][按钮]      │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  工作流画布      │  检查器面板                   │
│  (左侧 2/3)      │  (右侧 1/3)                  │
│  - 显示节点流程  │  - 工作流上下文               │
│  - 可点击节点    │  - 节点详情                   │
│                  │  - Agent 列表(带模型选择器)   │
├──────────────────┴──────────────────────────────┤
│  底部会话面板 (高度: 320px)                      │
│  - 消息历史 + 输入框                             │
└─────────────────────────────────────────────────┘

### 3. 关键组件

**A. 任务侧边栏（左侧抽屉）**
- 点击 Top Bar 的 + 按钮打开
- 显示多个 agent tasks 列表
- 每个任务卡片显示：标题、状态、环境、节点数、时间
- 点击任务可以切换到不同的工作流
- 顶部有 "New Task" 按钮（翡翠绿背景）

**B. 工作流画布**
- 节点卡片：264px x 96px，圆角大，柔和阴影
- 节点状态：完成（emerald）、运行中（灰色+旋转图标）、待定（浅灰）、失败（暗灰）
- 节点间连接线：SVG虚线
- 点击节点 → 跳转到 /session/{nodeId}

**C. 检查器面板（右侧）**
- 顶部：工作流上下文（目标、阶段、总体状态）
- 中部：节点详情（双列网格布局）
- 底部：Agent 列表，每个 Agent 卡片包含：
  * Brain 图标
  * Agent 名称
  * 角色描述
  * **模型选择器（下拉菜单）**
    - 可选模型：GPT-5.4, GPT-4, Claude-3.5-Sonnet, Claude-3-Opus, Gemini-Pro

**D. 底部会话面板**
- 显示当前选中节点的对话历史
- 消息类型：system、user、assistant、tool
- 底部输入框 + 发送按钮（翡翠绿）

### 4. 技术栈

**必须使用**:
- React 18+ with TypeScript
- React Router (注意：使用 'react-router' 不是 'react-router-dom')
- Tailwind CSS v4
- Radix UI 原语：@radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-scroll-area
- Lucide React (图标)

**路由配置**:
```tsx
// /src/app/routes.tsx
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/session/:nodeId",
    Component: SessionDetail,
  },
]);
```

### 5. 文件结构

/src/app
  /components
    /ui (shadcn 风格的基础组件)
      button.tsx
      sheet.tsx
      select.tsx
      scroll-area.tsx
      badge.tsx
      dialog.tsx
    top-bar.tsx
    task-sidebar.tsx
    workflow-canvas.tsx
    enhanced-inspector-panel.tsx
    chat-panel.tsx
  /pages
    dashboard.tsx
    session-detail.tsx
  App.tsx
  routes.tsx

### 6. 重要的样式指南

**背景层次**:
- bg-background (最底层)
- bg-muted/20 (卡片背景)
- bg-muted/30 (悬停状态)
- bg-muted/40 (激活状态)
- bg-background/80 backdrop-blur-sm (毛玻璃效果)

**边框和阴影**:
- border-border/30 (非常微妙)
- border-border/50 (标准边框)
- shadow-sm (细微阴影)
- shadow-md (卡片阴影)

**过渡动画**:
- transition-all (流畅过渡)
- hover:bg-muted/30 (悬停效果)
- animate-spin (加载状态)

### 7. 关键交互

1. **任务切换**：
   - 点击 + 按钮 → 打开左侧抽屉
   - 显示任务列表
   - 点击任务 → 切换工作流

2. **节点交互**：
   - 点击节点 → navigate(`/session/${nodeId}`)
   - 更新检查器面板
   - 更新底部会话面板

3. **模型选择**：
   - 每个 Agent 卡片有独立的下拉选择器
   - 可以选择不同的 AI 模型

### 8. Mock 数据示例

```typescript
const mockTasks = [
  {
    id: 'task-1',
    title: 'Fancy hello C on target via ttyS0',
    status: 'running',
    environment: 'ARM Linux',
    timestamp: '2 hours ago',
    nodeCount: 5,
  },
  // ... 更多任务
];

const mockNodes = [
  {
    id: 'node-1',
    title: 'Initialize Environment',
    type: 'coding',
    status: 'completed',
  },
  // ... 更多节点
];

const mockAgents = [
  {
    name: 'Senior Engineer',
    model: 'GPT-5.4',
    role: 'Code implementation and architecture',
  },
  // ... 更多 agents
];
```

### 9. 必须修复的问题

**SheetOverlay ref 警告**:
```tsx
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Overlay ref={ref} {...props} />
  );
});
SheetOverlay.displayName = "SheetOverlay";
```

**Missing Description 警告**:
在 Sheet 内添加隐藏描述：
```tsx
<SheetPrimitive.Description className="sr-only">
  Browse and switch between different agent tasks
</SheetPrimitive.Description>
```

### 10. 设计原则

✅ 简约至上 - 避免过度设计
✅ 柔和表面 - 微妙阴影和渐变
✅ 低视觉噪音 - 减少不必要元素
✅ 强层级 - 清晰的信息架构
✅ 高端质感 - 类似 Linear/Vercel 的品质

❌ 不要使用多色配色方案
❌ 不要使用厚重边框
❌ 不要使用盒套盒布局
❌ 不要使用鲜艳色彩

请按照以上规范完整实现这个界面。确保：
1. 配色只用灰色 + 翡翠绿
2. 所有 4 个布局区域都存在
3. 任务侧边栏可以从左侧打开
4. 节点点击可以跳转
5. Agent 卡片有模型选择下拉菜单
6. 没有控制台警告
7. 流畅的动画效果
8. 无障碍访问（ARIA 标签）
```

---

## 完整版本（包含所有细节）

如果需要更详细的规范，请查看 `/DESIGN_SPEC.md` 文件，里面包含：
- 完整的组件 props 定义
- 详细的样式规范
- 所有 TypeScript 接口
- 实现优先级
- 质量检查清单

---

## 使用方法

### 方法 1：直接对话
复制上面的"快速版本"，直接粘贴给 Claude Code（Cursor、Claude Chat 等）

### 方法 2：提供文件
1. 导出 `/DESIGN_SPEC.md`
2. 上传给 Claude
3. 说："请根据这个设计规范完整实现"

### 方法 3：增量实现
如果 AI 生成的代码太长，可以分步骤：

**第 1 步**：
"首先实现基础布局：Top Bar + 3列布局（工作流画布、检查器面板、底部会话面板）"

**第 2 步**：
"实现任务侧边栏：Sheet 组件从左侧滑出，包含任务列表和 New Task 按钮"

**第 3 步**：
"在检查器面板的 Agent 卡片中添加模型选择下拉菜单"

**第 4 步**：
"实现所有交互：任务切换、节点点击导航、模型选择"

### 方法 4：提供代码示例
如果需要，可以提供关键组件的代码片段作为参考：

```tsx
// 示例：Agent 卡片带模型选择器
<div className="rounded-lg bg-muted/20 border border-border/30 p-3">
  <div className="flex items-start gap-3">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/40">
      <Brain className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium">{agent.name}</div>
      <div className="text-xs text-muted-foreground">{agent.role}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">Model:</span>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-6 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GPT-5.4">GPT-5.4</SelectItem>
            <SelectItem value="Claude-3.5-Sonnet">Claude-3.5-Sonnet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</div>
```

---

## 验证清单

完成后，让 AI 确认：
- [ ] 只使用灰色和翡翠绿
- [ ] Top Bar 有 + 按钮
- [ ] 任务侧边栏可以打开/关闭
- [ ] 工作流画布显示节点
- [ ] 检查器面板有 Agent 列表
- [ ] 每个 Agent 有模型选择器
- [ ] 底部有会话面板
- [ ] 点击节点可以导航
- [ ] 没有控制台错误/警告
- [ ] 动画流畅自然
