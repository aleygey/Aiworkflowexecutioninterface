import { ScrollArea } from './ui/scroll-area';
import { Box, CheckCircle2, XCircle, Loader2, Circle, Terminal } from 'lucide-react';

interface NodeState {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  type: string;
  model: string;
  executionLogs: string[];
  metadata: {
    attempt: string;
    actions: string;
    duration?: string;
    timestamp?: string;
  };
  stateJson: Record<string, any>;
}

interface NodeStateInspectorProps {
  nodeState: NodeState | null;
}

const statusConfig = {
  running: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
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
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
          Node State
        </h3>
        
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
          {/* Metadata */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Metadata
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">Model</div>
                <div className="text-xs text-foreground font-mono">{nodeState.model}</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">Attempt</div>
                <div className="text-xs text-foreground">{nodeState.metadata.attempt}</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">Actions</div>
                <div className="text-xs text-foreground">{nodeState.metadata.actions}</div>
              </div>
              {nodeState.metadata.duration && (
                <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">Duration</div>
                  <div className="text-xs text-foreground">{nodeState.metadata.duration}</div>
                </div>
              )}
            </div>
          </div>

          {/* Execution Logs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Execution Logs
              </h4>
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
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No logs available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* State JSON */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              State JSON
            </h4>
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
