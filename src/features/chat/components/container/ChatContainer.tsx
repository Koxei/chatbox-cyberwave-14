import React from 'react';
import { Chat, Message } from '@/types/chat';
import ChatMessages from './ChatMessages';
import ChatInput from '../input/ChatInput';

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
      <div className="flex flex-col h-full max-w-2xl mx-auto w-full border-2 border-red-500 pt-16 relative">
        {/* Absolutely positioned header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-50 bg-transparent">
          <h1 className="text-xl font-bold">Chat</h1>
        </div>
        
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
          />
        </main>
        {currentChat && (
          <div className="sticky bottom-0 bg-transparent pt-2">
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
