import React from 'react';
import { Chat, Message } from '@/types/chat';
import ChatMessages from './ChatMessages';
import ChatInput from '../input/ChatInput';
import { PlusCircle } from "lucide-react";

interface ChatContainerProps {
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  inputMessage: string;
  setInputMessage: (message: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentChat,
  messages,
  isLoading,
  onSubmit,
  inputMessage,
  setInputMessage,
}) => {
  return (
    <div className="relative z-30 flex flex-col h-full">
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
        />
        {!currentChat && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <PlusCircle className="w-12 h-12 mb-4" />
            <p className="text-lg">Start a new chat</p>
          </div>
        )}
      </main>
      {currentChat && (
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ChatContainer;