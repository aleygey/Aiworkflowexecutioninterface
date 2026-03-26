import { useState } from 'react';
import { SessionTopBar } from '../components/session-top-bar';
import { ChatSessionPanel } from '../components/chat-session-panel';
import { CodeDiffViewer } from '../components/code-diff-viewer';
import { NodeStateInspector } from '../components/node-state-inspector';

// Mock data
const mockMessages = [
  {
    id: 'msg-1',
    role: 'system' as const,
    content: 'Session initialized. Ready to execute workflow.',
    timestamp: '14:20:00',
  },
  {
    id: 'msg-2',
    role: 'user' as const,
    content: 'Create a hello world program in C with fancy formatting.',
    timestamp: '14:20:15',
  },
  {
    id: 'msg-3',
    role: 'assistant' as const,
    content: 'I\'ll create a C program with ANSI color support and animated text effects. Let me start by writing the source code.',
    timestamp: '14:20:18',
  },
  {
    id: 'msg-4',
    role: 'tool' as const,
    content: 'File created: hello_fancy.c\nAdded ANSI escape codes for colors\nAdded text animation functions',
    timestamp: '14:20:25',
  },
  {
    id: 'msg-5',
    role: 'assistant' as const,
    content: 'Source code created successfully. Now compiling for ARM architecture using gcc-arm-linux-gnueabihf...',
    timestamp: '14:20:30',
  },
  {
    id: 'msg-6',
    role: 'tool' as const,
    content: 'Compilation started\nTarget: ARM Linux\nToolchain: gcc-arm-linux-gnueabihf\nOptimization: -O2',
    timestamp: '14:20:32',
  },
];

const mockDiffs = [
  {
    fileName: 'hello_fancy.c',
    path: '/workspace/hello_fancy.c',
    additions: 42,
    deletions: 0,
    lines: [
      { type: 'header' as const, content: '@@ -0,0 +1,42 @@' },
      { type: 'added' as const, content: '#include <stdio.h>', lineNumber: 1 },
      { type: 'added' as const, content: '#include <unistd.h>', lineNumber: 2 },
      { type: 'added' as const, content: '#include <string.h>', lineNumber: 3 },
      { type: 'added' as const, content: '', lineNumber: 4 },
      { type: 'added' as const, content: '// ANSI color codes', lineNumber: 5 },
      { type: 'added' as const, content: '#define RESET   "\\033[0m"', lineNumber: 6 },
      { type: 'added' as const, content: '#define RED     "\\033[31m"', lineNumber: 7 },
      { type: 'added' as const, content: '#define GREEN   "\\033[32m"', lineNumber: 8 },
      { type: 'added' as const, content: '#define YELLOW  "\\033[33m"', lineNumber: 9 },
      { type: 'added' as const, content: '#define BLUE    "\\033[34m"', lineNumber: 10 },
      { type: 'added' as const, content: '#define MAGENTA "\\033[35m"', lineNumber: 11 },
      { type: 'added' as const, content: '#define CYAN    "\\033[36m"', lineNumber: 12 },
      { type: 'added' as const, content: '', lineNumber: 13 },
      { type: 'added' as const, content: 'void print_fancy(const char* text, const char* color) {', lineNumber: 14 },
      { type: 'added' as const, content: '    printf("%s%s%s\\n", color, text, RESET);', lineNumber: 15 },
      { type: 'added' as const, content: '    fflush(stdout);', lineNumber: 16 },
      { type: 'added' as const, content: '}', lineNumber: 17 },
      { type: 'added' as const, content: '', lineNumber: 18 },
      { type: 'added' as const, content: 'void animate_text(const char* text) {', lineNumber: 19 },
      { type: 'added' as const, content: '    for (int i = 0; i < strlen(text); i++) {', lineNumber: 20 },
      { type: 'added' as const, content: '        putchar(text[i]);', lineNumber: 21 },
      { type: 'added' as const, content: '        fflush(stdout);', lineNumber: 22 },
      { type: 'added' as const, content: '        usleep(50000); // 50ms delay', lineNumber: 23 },
      { type: 'added' as const, content: '    }', lineNumber: 24 },
      { type: 'added' as const, content: '    printf("\\n");', lineNumber: 25 },
      { type: 'added' as const, content: '}', lineNumber: 26 },
      { type: 'added' as const, content: '', lineNumber: 27 },
      { type: 'added' as const, content: 'int main() {', lineNumber: 28 },
      { type: 'added' as const, content: '    print_fancy("================================", CYAN);', lineNumber: 29 },
      { type: 'added' as const, content: '    print_fancy("    FANCY HELLO WORLD v1.0    ", GREEN);', lineNumber: 30 },
      { type: 'added' as const, content: '    print_fancy("================================", CYAN);', lineNumber: 31 },
      { type: 'added' as const, content: '    printf("\\n");', lineNumber: 32 },
      { type: 'added' as const, content: '    ', lineNumber: 33 },
      { type: 'added' as const, content: '    printf("%s", YELLOW);', lineNumber: 34 },
      { type: 'added' as const, content: '    animate_text("Hello, World!");', lineNumber: 35 },
      { type: 'added' as const, content: '    printf("%s", RESET);', lineNumber: 36 },
      { type: 'added' as const, content: '    ', lineNumber: 37 },
      { type: 'added' as const, content: '    printf("\\n");', lineNumber: 38 },
      { type: 'added' as const, content: '    print_fancy("Program executed successfully!", MAGENTA);', lineNumber: 39 },
      { type: 'added' as const, content: '    ', lineNumber: 40 },
      { type: 'added' as const, content: '    return 0;', lineNumber: 41 },
      { type: 'added' as const, content: '}', lineNumber: 42 },
    ],
  },
  {
    fileName: 'Makefile',
    path: '/workspace/Makefile',
    additions: 15,
    deletions: 0,
    lines: [
      { type: 'header' as const, content: '@@ -0,0 +1,15 @@' },
      { type: 'added' as const, content: 'CC = gcc-arm-linux-gnueabihf', lineNumber: 1 },
      { type: 'added' as const, content: 'CFLAGS = -O2 -Wall -Wextra', lineNumber: 2 },
      { type: 'added' as const, content: 'TARGET = hello_fancy', lineNumber: 3 },
      { type: 'added' as const, content: 'SRC = hello_fancy.c', lineNumber: 4 },
      { type: 'added' as const, content: '', lineNumber: 5 },
      { type: 'added' as const, content: 'all: $(TARGET)', lineNumber: 6 },
      { type: 'added' as const, content: '', lineNumber: 7 },
      { type: 'added' as const, content: '$(TARGET): $(SRC)', lineNumber: 8 },
      { type: 'added' as const, content: '\t$(CC) $(CFLAGS) -o $@ $^', lineNumber: 9 },
      { type: 'added' as const, content: '', lineNumber: 10 },
      { type: 'added' as const, content: 'clean:', lineNumber: 11 },
      { type: 'added' as const, content: '\trm -f $(TARGET)', lineNumber: 12 },
      { type: 'added' as const, content: '', lineNumber: 13 },
      { type: 'added' as const, content: '.PHONY: all clean', lineNumber: 14 },
    ],
  },
];

const mockNodeState = {
  id: 'node-3',
  name: 'Compile the C program',
  status: 'running' as const,
  type: 'build-flash',
  model: 'GPT-5.4',
  metadata: {
    attempt: '2/3',
    actions: '15/30',
    duration: '3.2s',
    timestamp: '14:23:35',
  },
  executionLogs: [
    'Starting cross-compilation process...',
    'Target architecture: ARM (Linux)',
    'Toolchain: gcc-arm-linux-gnueabihf',
    'Compiler flags: -O2 -Wall -Wextra',
    'Compiling hello_fancy.c...',
    'Linking binary...',
    'Binary size: 8.4 KB',
    'Stripping debug symbols...',
    'Final binary: 6.2 KB',
    'Compilation successful',
  ],
  stateJson: {
    phase: 'compile',
    target: 'ARM (Linux)',
    toolchain: 'gcc-arm-linux-gnueabihf',
    output_file: 'hello_fancy',
    binary_size: '6.2 KB',
    status: 'in_progress',
    progress: 75,
  },
};

export function SessionDetailView() {
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMessages([...messages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Processing your request...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Bar */}
      <SessionTopBar
        sessionTitle="Session: Fancy hello C on target via ttyS0"
        status="running"
        onBack={handleBack}
        onStop={() => console.log('Stop')}
        onRestart={() => console.log('Restart')}
        onStep={() => console.log('Step')}
      />

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat Session */}
        <div className="w-80 flex-shrink-0">
          <ChatSessionPanel messages={messages} onSendMessage={handleSendMessage} />
        </div>

        {/* Center Panel - Code Diff Viewer */}
        <div className="flex-1 min-w-0">
          <CodeDiffViewer diffs={mockDiffs} />
        </div>

        {/* Right Panel - Node State Inspector */}
        <div className="w-96 flex-shrink-0">
          <NodeStateInspector nodeState={mockNodeState} />
        </div>
      </div>
    </div>
  );
}
