import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TerminalLine {
  type: "command" | "output" | "error" | "success";
  content: string;
  timestamp?: Date;
}

interface TerminalDisplayProps {
  lines?: TerminalLine[];
  prompt?: string;
  className?: string;
}

export default function TerminalDisplay({ 
  lines = [], 
  prompt = "user@cyberhack:~$",
  className = ""
}: TerminalDisplayProps) {
  const [displayLines, setDisplayLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (lines.length === 0) return;

    const timer = setInterval(() => {
      if (currentLineIndex < lines.length) {
        setDisplayLines(prev => [...prev, lines[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      } else {
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [lines, currentLineIndex]);

  const getLineColor = (type: string): string => {
    switch (type) {
      case "command":
        return "text-primary";
      case "output":
        return "text-foreground";
      case "error":
        return "text-destructive";
      case "success":
        return "text-secondary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`terminal-border bg-black/90 ${className}`}>
      <CardContent className="p-6 font-mono text-sm">
        <div className="space-y-1 min-h-[200px]" data-testid="terminal-display">
          {displayLines.map((line, index) => (
            <div key={index} className={`${getLineColor(line.type)} leading-relaxed`}>
              {line.type === "command" && (
                <span className="text-secondary mr-2">{prompt}</span>
              )}
              <span>{line.content}</span>
              {line.timestamp && (
                <span className="text-muted-foreground ml-2 text-xs">
                  [{line.timestamp.toLocaleTimeString()}]
                </span>
              )}
            </div>
          ))}
          
          {/* Blinking cursor */}
          <div className="flex items-center">
            <span className="text-secondary mr-2">{prompt}</span>
            <span className="animate-terminal-blink">_</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing terminal state
export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  
  const addLine = (content: string, type: TerminalLine["type"] = "output") => {
    setLines(prev => [...prev, { 
      content, 
      type, 
      timestamp: new Date() 
    }]);
  };

  const addCommand = (command: string) => {
    addLine(command, "command");
  };

  const addOutput = (output: string) => {
    addLine(output, "output");
  };

  const addError = (error: string) => {
    addLine(error, "error");
  };

  const addSuccess = (message: string) => {
    addLine(message, "success");
  };

  const clearTerminal = () => {
    setLines([]);
  };

  return {
    lines,
    addLine,
    addCommand,
    addOutput,
    addError,
    addSuccess,
    clearTerminal,
  };
}
