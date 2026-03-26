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
  running: { icon: Loader2, label: 'Running', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/10' },
  idle: { icon: Square, label: 'Idle', color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function SessionTopBar({ 
  sessionTitle, 
  status, 
  onBack,
  onStop,
  onRestart,
  onStep 
}: SessionTopBarProps) {
  const statusCfg = statusConfig[status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="h-14 border-b border-border/50 bg-background/95 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
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
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Square className="w-3.5 h-3.5 mr-2" />
            Stop
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="border-border/50"
        >
          <RotateCw className="w-3.5 h-3.5 mr-2" />
          Restart
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStep}
          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        >
          <SkipForward className="w-3.5 h-3.5 mr-2" />
          Step
        </Button>

        <Button
          size="sm"
          onClick={onStep}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={status === 'running'}
        >
          <Play className="w-3.5 h-3.5 mr-2" />
          Run
        </Button>
      </div>
    </div>
  );
}
