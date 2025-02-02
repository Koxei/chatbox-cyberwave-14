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
  isAuthenticated?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentChat,
  messages,
  isLoading,
  onSubmit,
  inputMessage,
  setInputMessage,
  isAuthenticated = true,
}) => {
  return (
    <div className="relative z-30 flex flex-col h-full">
      <div className={`flex flex-col h-full max-w-3xl mx-auto w-full border-2 ${isAuthenticated ? 'border-red-500' : 'border-yellow-400'}`}>
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