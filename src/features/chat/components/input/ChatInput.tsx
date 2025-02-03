import React from 'react';

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
      className="p-4 border-t border-userMessage"
    >
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 p-2 border-b border-userMessage text-white bg-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 border border-userMessage text-userMessage rounded font-arcade hover:bg-black/40 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
