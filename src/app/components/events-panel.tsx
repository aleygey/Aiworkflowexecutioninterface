import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

interface Event {
  id: string;
  type: string;
  summary: string;
  timestamp: string;
  details?: string;
  tags?: string[];
}

interface EventsPanelProps {
  events: Event[];
}

export function EventsPanel({ events }: EventsPanelProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-background/60 backdrop-blur-sm">
      <div className="px-6 py-3 border-b border-border/50">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
          Execution Events
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg bg-background/80 shadow-sm border border-border/50 overflow-hidden transition-all hover:shadow-md"
            >
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => toggleExpand(event.id)}
              >
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  {expandedEvent === event.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                    {event.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-accent/50 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground truncate">{event.summary}</p>
                </div>

                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {event.timestamp}
                </div>
              </div>

              <AnimatePresence>
                {expandedEvent === event.id && event.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-3 pb-3 pl-10">
                      <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                        {event.details}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
