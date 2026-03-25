import { WorkflowNode, NodeStatus, NodeType } from './workflow-node';
import { motion } from 'motion/react';

interface Node {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
}

interface WorkflowCanvasProps {
  nodes: Node[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
}

export function WorkflowCanvas({ nodes, selectedNodeId, onNodeSelect }: WorkflowCanvasProps) {
  return (
    <div className="relative h-full overflow-auto">
      <div className="p-8 min-h-full">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative">
              <WorkflowNode
                {...node}
                isSelected={selectedNodeId === node.id}
                onClick={() => onNodeSelect(node.id)}
              />
              
              {index < nodes.length - 1 && (
                <div className="flex justify-center my-4">
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                    <motion.path
                      d="M12 0 L12 28 M12 28 L8 24 M12 28 L16 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground/30"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
