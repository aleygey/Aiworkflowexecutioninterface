import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { User, Bot, Terminal, Code } from 'lucide-react';

interface Message {
  id: string;
  role: 'system' | 'assistant' | 'user' | 'tool';
  content: string;
  timestamp: string;
}

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'System' },
  assistant: { icon: Bot, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Assistant' },
  user: { icon: User, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'User' },
  tool: { icon: Code, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Tool' },
};

export function SessionDialog({ open, onOpenChange, messages }: SessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle>Session Conversation</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const config = roleConfig[message.role];
              const Icon = config.icon;

              return (
                <div
                  key={message.id}
                  className="flex gap-3 p-4 rounded-lg bg-background/60 border border-border/50"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
