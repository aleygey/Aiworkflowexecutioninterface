import { Play, Square, MessageSquare, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface TopBarProps {
  workflowTitle: string;
  sessionStatus: 'running' | 'completed' | 'failed' | 'idle';
  environment: string;
  onSessionClick: () => void;
}

const statusConfig = {
  running: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Running' },
  completed: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Completed' },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
  idle: { color: 'text-muted-foreground', bg: 'bg-muted/30', label: 'Idle' },
};

export function TopBar({ workflowTitle, sessionStatus, environment, onSessionClick }: TopBarProps) {
  const status = statusConfig[sessionStatus];

  return (
    <div className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
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
