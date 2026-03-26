import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopBar } from '../components/top-bar';
import { WorkflowCanvas } from '../components/workflow-canvas';
import { EnhancedInspectorPanel } from '../components/enhanced-inspector-panel';
import { ChatPanel } from '../components/chat-panel';
import { SessionDialog } from '../components/session-dialog';
import { TaskSidebar, Task } from '../components/task-sidebar';

// Mock data
const mockNodes = [
  {
    id: 'node-1',
    title: 'Initialize Environment',
    type: 'coding' as const,
    status: 'completed' as const,
  },
  {
    id: 'node-2',
    title: 'Create fancy hello C source',
    type: 'coding' as const,
    status: 'completed' as const,
  },
  {
    id: 'node-3',
    title: 'Compile the C program',
    type: 'build-flash' as const,
    status: 'running' as const,
  },
  {
    id: 'node-4',
    title: 'Transfer and run over ttyS0',
    type: 'debug' as const,
    status: 'pending' as const,
  },
  {
    id: 'node-5',
    title: 'Verify execution logs',
    type: 'debug' as const,
    status: 'pending' as const,
  },
];

const mockNodeDetails = {
  'node-1': {
    id: 'node-1',
    title: 'Initialize Environment',
    type: 'coding',
    status: 'completed',
    result: 'success',
    model: 'GPT-5.4',
    attempt: '1/3',
    actions: '5/30',
    sessionId: 'ses_2f9caefa3ffe...',
    pendingCommands: 0,
    lastControl: 'none',
    lastPull: 'none',
    lastUpdate: 'event #98',
    stateJson: {
      phase: 'initialization',
      status: 'environment ready',
      target_device: 'ARM Linux',
    },
  },
  'node-2': {
    id: 'node-2',
    title: 'Create fancy hello C source',
    type: 'coding',
    status: 'completed',
    result: 'success',
    model: 'GPT-5.4',
    attempt: '1/3',
    actions: '8/30',
    sessionId: 'ses_2f9caefa3ffe...',
    pendingCommands: 0,
    lastControl: 'none',
    lastPull: 'none',
    lastUpdate: 'event #156',
    stateJson: {
      phase: 'coding',
      files: ['hello_fancy.c', 'Makefile'],
      status: 'ready for compilation',
    },
  },
  'node-3': {
    id: 'node-3',
    title: 'Compile the C program',
    type: 'build-flash',
    status: 'running',
    result: 'in progress',
    model: 'GPT-5.4',
    attempt: '2/3',
    actions: '15/30',
    sessionId: 'ses_2f9caefa3ffe...',
    pendingCommands: 0,
    lastControl: 'none',
    lastPull: 'none',
    lastUpdate: 'event #204',
    stateJson: {
      phase: 'compile',
      target: 'ARM (Linux)',
      toolchain: 'gcc-arm-linux-gnueabihf',
      logs: [
        'Connected at 115200 8N1',
        'Login: root/password',
        'Shell: busybox ash on ARM',
        'Cross-compiled ARM binary: [a00f]',
        'Transfer: printf+base64+latest execution events',
      ],
    },
  },
  'node-4': {
    id: 'node-4',
    title: 'Transfer and run over ttyS0',
    type: 'debug',
    status: 'pending',
    result: 'pending',
    model: 'GPT-5.4',
    attempt: '0/3',
    actions: '0/30',
    sessionId: 'ses_2f9caefa3ffe...',
    pendingCommands: 0,
    lastControl: 'none',
    lastPull: 'none',
    lastUpdate: 'none',
    stateJson: {
      phase: 'waiting',
      status: 'queued',
    },
  },
  'node-5': {
    id: 'node-5',
    title: 'Verify execution logs',
    type: 'debug',
    status: 'pending',
    result: 'pending',
    model: 'GPT-5.4',
    attempt: '0/3',
    actions: '0/30',
    sessionId: 'ses_2f9caefa3ffe...',
    pendingCommands: 0,
    lastControl: 'none',
    lastPull: 'none',
    lastUpdate: 'none',
    stateJson: {
      phase: 'waiting',
      status: 'queued',
    },
  },
};

// Workflow context
const workflowContext = {
  goal: 'Create a fancy hello world program in C and deploy it to an ARM Linux target device via serial connection (ttyS0)',
  phase: 'Compilation',
  overallStatus: 'running' as const,
};

// Agent information
const agents = [
  {
    name: 'Setup Agent',
    model: 'GPT-5.4-turbo',
    role: 'Environment initialization and configuration',
  },
  {
    name: 'Code Generation Agent',
    model: 'GPT-5.4-turbo',
    role: 'Source code creation and modification',
  },
  {
    name: 'Build Agent',
    model: 'GPT-5.4',
    role: 'Cross-compilation and binary generation',
  },
  {
    name: 'Deployment Agent',
    model: 'GPT-5.4',
    role: 'Binary transfer and execution',
  },
  {
    name: 'Verification Agent',
    model: 'GPT-5.4',
    role: 'Testing and validation',
  },
];

const mockMessages = [
  {
    id: 'msg-1',
    role: 'system' as const,
    content: 'Workflow execution initialized. Target environment: ARM Linux (ttyS0).',
    timestamp: '14:20:00',
  },
  {
    id: 'msg-2',
    role: 'user' as const,
    content: 'Create a fancy hello world program in C and deploy it to the target device via serial.',
    timestamp: '14:20:15',
  },
  {
    id: 'msg-3',
    role: 'assistant' as const,
    content: 'I\'ll create a C program with enhanced output formatting and compile it for ARM architecture. Then I\'ll transfer and execute it on your target device.',
    timestamp: '14:20:20',
  },
  {
    id: 'msg-4',
    role: 'tool' as const,
    content: 'Created hello_fancy.c with ANSI color support and animated text effects.',
    timestamp: '14:21:30',
  },
  {
    id: 'msg-5',
    role: 'tool' as const,
    content: 'Compilation in progress using cross-compiler for ARM target...',
    timestamp: '14:23:35',
  },
];

// Mock tasks
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Fancy hello C on target via ttyS0',
    status: 'running',
    environment: 'ARM Linux',
    timestamp: '2 hours ago',
    nodeCount: 5,
  },
  {
    id: 'task-2',
    title: 'Deploy web server to production',
    status: 'completed',
    environment: 'AWS EC2',
    timestamp: '1 day ago',
    nodeCount: 8,
  },
  {
    id: 'task-3',
    title: 'Database migration and backup',
    status: 'completed',
    environment: 'PostgreSQL',
    timestamp: '3 days ago',
    nodeCount: 4,
  },
  {
    id: 'task-4',
    title: 'API integration testing',
    status: 'idle',
    environment: 'Node.js',
    timestamp: '1 week ago',
    nodeCount: 6,
  },
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
    const newMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: 'I understand your request. Processing...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleNodeDoubleClick = () => {
    navigate('/session/ses_2f9caefa3ffe');
  };

  // Navigate to session detail view when node is clicked
  const handleNodeClick = (nodeId: string) => {
    navigate(`/session/${nodeId}`);
  };

  const handleTaskSelect = (taskId: string) => {
    setCurrentTaskId(taskId);
    setTaskSidebarOpen(false);
    // In a real app, this would load the task's data
    console.log('Switched to task:', taskId);
  };

  const handleNewTask = () => {
    console.log('Create new task');
    setTaskSidebarOpen(false);
    // In a real app, this would create a new task
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <TopBar
        workflowTitle="Fancy hello C on target via ttyS0"
        sessionStatus="running"
        environment="ARM Linux"
        onSessionClick={() => setSessionDialogOpen(true)}
        onDetailView={handleNodeDoubleClick}
        onTaskSidebarToggle={() => setTaskSidebarOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Workspace - Split Layout */}
        <div className="flex-1 flex gap-px bg-border/30">
          {/* Left Side - Workflow Canvas */}
          <div className="flex-1 bg-background/40">
            <WorkflowCanvas
              nodes={mockNodes}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeClick}
            />
          </div>

          {/* Right Side - Enhanced Inspector Panel */}
          <div className="w-[420px] bg-background/60 backdrop-blur-sm border-l border-border/50">
            <EnhancedInspectorPanel
              nodeDetails={selectedNodeDetails}
              workflowContext={workflowContext}
              agents={agents}
            />
          </div>
        </div>
      </div>

      {/* Bottom Chat Panel */}
      <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />

      {/* Session Dialog */}
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        messages={mockMessages}
      />

      {/* Task Sidebar */}
      <TaskSidebar
        open={taskSidebarOpen}
        onOpenChange={setTaskSidebarOpen}
        tasks={mockTasks}
        currentTaskId={currentTaskId}
        onTaskSelect={handleTaskSelect}
        onNewTask={handleNewTask}
      />
    </div>
  );
}