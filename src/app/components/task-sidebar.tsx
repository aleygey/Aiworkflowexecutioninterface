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