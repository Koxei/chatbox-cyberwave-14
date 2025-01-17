export interface Command {
  name: string;
  description: string;
  action: () => void;
}

export interface TerminalState {
  history: string[];
  currentCommand: string;
}