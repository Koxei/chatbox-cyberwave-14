import { useState, useCallback } from 'react';
import { TerminalState, Command } from '../types/terminal';

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    history: [],
    currentCommand: '',
  });

  const executeCommand = useCallback((command: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, `> ${command}`],
      currentCommand: '',
    }));
  }, []);

  return {
    state,
    executeCommand,
    updateCurrentCommand: (command: string) => setState(prev => ({ ...prev, currentCommand: command })),
  };
};