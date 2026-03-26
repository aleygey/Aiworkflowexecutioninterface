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

          {/* Overall Status */}
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

              {/* Overview */}
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

              {/* Execution */}
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

              {/* State JSON */}
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