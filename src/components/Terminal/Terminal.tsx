import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TerminalLine {
  content: string;
  isCommand?: boolean;
}

export const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { content: "Welcome! Follow the instructions for more information below:" },
    { content: "- Press (Q) and 'Enter' for Social Links." },
    { content: "- Press (C) and 'Enter' for Contract Address." }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = async (command: string) => {
    const upperCommand = command.trim().toUpperCase();
    setLines([...lines, { content: command, isCommand: true }]);

    switch (upperCommand) {
      case "Q":
        const socialLink = "https://x.com/home";
        setLines(prev => [...prev, 
          { content: "Social Links:" },
          { content: `- ${socialLink}` }
        ]);
        try {
          await navigator.clipboard.writeText(socialLink);
          setLines(prev => [...prev, { content: "(Clipped to clipboard!)" }]);
          toast({
            title: "Success",
            description: "Social link copied to clipboard!",
          });
        } catch (err) {
          console.error("Failed to copy to clipboard:", err);
        }
        break;
      case "C":
        setLines(prev => [...prev, 
          { content: "Contract Address: aWnf38ANf8nj39NJRF" }
        ]);
        break;
      default:
        setLines(prev => [...prev, 
          { content: "Unknown command. Try 'Q' for social links or 'C' for contract address." }
        ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 h-[80vh] flex flex-col bg-black/90 rounded-lg border border-cyan-500/30">
      <div className="flex items-center gap-2 p-2 border-b border-cyan-500/30">
        <TerminalIcon className="w-4 h-4 text-cyan-500" />
        <span className="text-cyan-500 font-arcade text-sm">CYBERPUNK TERMINAL</span>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1"
      >
        {lines.map((line, i) => (
          <div key={i} className={line.isCommand ? "text-cyan-500" : "text-green-400"}>
            {line.isCommand && <span className="text-pink-500">→ </span>}
            {line.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="text-pink-500">→</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-cyan-500 font-mono"
            placeholder="Type a command (Q or C) and press Enter"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};