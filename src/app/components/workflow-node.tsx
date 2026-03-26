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
      style={{
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isRunning && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
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