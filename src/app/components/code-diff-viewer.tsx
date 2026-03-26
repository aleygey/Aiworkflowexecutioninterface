import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { FileCode, GitBranch, Plus, Minus } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'header';
  content: string;
  lineNumber?: number;
}

interface FileDiff {
  fileName: string;
  path: string;
  lines: DiffLine[];
  additions: number;
  deletions: number;
}

interface CodeDiffViewerProps {
  diffs: FileDiff[];
}

export function CodeDiffViewer({ diffs }: CodeDiffViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0);

  if (diffs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background/40">
        <div className="text-center space-y-2">
          <FileCode className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">No code changes to display</p>
        </div>
      </div>
    );
  }

  const currentDiff = diffs[selectedFile];

  return (
    <div className="h-full flex flex-col bg-background/40">
      {/* Header with file tabs */}
      <div className="border-b border-border/30 bg-background/60">
        <div className="px-4 py-3 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Code Changes
          </h3>
        </div>
        
        <div className="flex gap-1 px-2 overflow-x-auto">
          {diffs.map((diff, index) => (
            <button
              key={index}
              onClick={() => setSelectedFile(index)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                selectedFile === index
                  ? 'bg-background/80 text-foreground border-t border-x border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5" />
                <span>{diff.fileName}</span>
                <div className="flex items-center gap-1.5 ml-1">
                  {diff.additions > 0 && (
                    <span className="text-emerald-400 text-xs">+{diff.additions}</span>
                  )}
                  {diff.deletions > 0 && (
                    <span className="text-red-400 text-xs">-{diff.deletions}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* File path */}
      <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
        <div className="text-xs text-muted-foreground font-mono">{currentDiff.path}</div>
      </div>

      {/* Diff content */}
      <ScrollArea className="flex-1">
        <div className="font-mono text-xs">
          {currentDiff.lines.map((line, index) => {
            let bgColor = '';
            let textColor = 'text-foreground/90';
            let icon = null;
            let lineNumberColor = 'text-muted-foreground/50';

            if (line.type === 'added') {
              bgColor = 'bg-emerald-500/10 hover:bg-emerald-500/15';
              textColor = 'text-emerald-300';
              lineNumberColor = 'text-emerald-400';
              icon = <Plus className="w-3 h-3 text-emerald-400" />;
            } else if (line.type === 'removed') {
              bgColor = 'bg-red-500/10 hover:bg-red-500/15';
              textColor = 'text-red-300';
              lineNumberColor = 'text-red-400';
              icon = <Minus className="w-3 h-3 text-red-400" />;
            } else if (line.type === 'header') {
              bgColor = 'bg-blue-500/10';
              textColor = 'text-blue-300';
              lineNumberColor = 'text-blue-400';
            } else {
              bgColor = 'hover:bg-muted/30';
            }

            return (
              <div
                key={index}
                className={`flex items-center ${bgColor} border-l-2 ${
                  line.type === 'added'
                    ? 'border-emerald-500/50'
                    : line.type === 'removed'
                    ? 'border-red-500/50'
                    : 'border-transparent'
                }`}
              >
                <div className={`w-12 flex-shrink-0 text-right pr-3 py-1 ${lineNumberColor} select-none`}>
                  {line.lineNumber || ''}
                </div>
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div className={`flex-1 py-1 pr-4 ${textColor} whitespace-pre-wrap break-all`}>
                  {line.content}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Stats footer */}
      <div className="px-4 py-2 border-t border-border/30 bg-muted/20 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Plus className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">{currentDiff.additions} additions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Minus className="w-3 h-3 text-red-400" />
          <span className="text-red-400">{currentDiff.deletions} deletions</span>
        </div>
      </div>
    </div>
  );
}
