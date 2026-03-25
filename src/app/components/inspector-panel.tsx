import { ScrollArea } from './ui/scroll-area';

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

interface InspectorPanelProps {
  nodeDetails: NodeDetails | null;
}

export function InspectorPanel({ nodeDetails }: InspectorPanelProps) {
  if (!nodeDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Select a node to view details</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Selected Node
          </div>
          <h2 className="text-lg font-medium text-foreground">{nodeDetails.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">{nodeDetails.type}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-emerald-500">{nodeDetails.status}</span>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Result</div>
              <div className="text-sm text-foreground">{nodeDetails.result}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Model</div>
              <div className="text-sm text-foreground">{nodeDetails.model}</div>
            </div>
          </div>
        </div>

        {/* Execution */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Execution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Attempt</div>
              <div className="text-sm text-foreground">{nodeDetails.attempt}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Actions</div>
              <div className="text-sm text-foreground">{nodeDetails.actions}</div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Metadata</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Session</div>
              <div className="text-sm text-foreground font-mono text-xs truncate">
                {nodeDetails.sessionId}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Pending Commands</div>
              <div className="text-sm text-foreground">{nodeDetails.pendingCommands}</div>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Communication</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Last Control</div>
              <div className="text-sm text-foreground">{nodeDetails.lastControl}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Last Pull</div>
              <div className="text-sm text-foreground">{nodeDetails.lastPull}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Last Update</div>
              <div className="text-sm text-foreground">{nodeDetails.lastUpdate}</div>
            </div>
          </div>
        </div>

        {/* State JSON */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">State_JSON</h3>
          <div className="bg-muted/30 rounded-lg p-3 overflow-auto">
            <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
              {JSON.stringify(nodeDetails.stateJson, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
