import { useState } from 'react';
import { Send, User, Bot, Terminal, Code } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'system' | 'assistant' | 'user' | 'tool';
  content: string;
  timestamp: string;
}

interface ChatSessionPanelProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'System' },
  assistant: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Agent' },
  user: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'You' },
  tool: { icon: Code, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Tool' },
};

export function ChatSessionPanel({ messages, onSendMessage }: ChatSessionPanelProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Chat Session
        </h3>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const config = roleConfig[message.role];
            const Icon = config.icon;

            return (
              <div key={message.id} className="flex gap-3 group">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      {message.timestamp}
                    </span>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-border/30 bg-muted/10">
        <div className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to the agent..."
            rows={3}
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="sm"
            className="self-end bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="w-3.5 h-3.5 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
