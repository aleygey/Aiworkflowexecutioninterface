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

interface ChatPanelProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

const roleConfig = {
  system: { icon: Terminal, color: 'text-muted-foreground', bg: 'bg-muted/30' },
  assistant: { icon: Bot, color: 'text-foreground', bg: 'bg-muted/40' },
  user: { icon: User, color: 'text-foreground', bg: 'bg-muted/40' },
  tool: { icon: Code, color: 'text-muted-foreground', bg: 'bg-muted/30' },
};

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
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
    <div className="h-80 border-t border-emerald-500/20 bg-background/95 backdrop-blur-sm flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-medium text-foreground">Agent Chat</h3>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {messages.length} messages
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const config = roleConfig[message.role];
            const Icon = config.icon;

            return (
              <div key={message.id} className="flex gap-3 group">
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${config.bg} flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-6 py-3 border-t border-border/30 bg-muted/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to the agent..."
            className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}