import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  onSubmit,
  isLoading,
}) => {
  return (
    <form 
      onSubmit={onSubmit}
      className="p-4"
    >
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 p-2 border-b border-userMessage text-white font-noto bg-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-2 text-userMessage rounded hover:bg-black/40 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <Send size={24} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;