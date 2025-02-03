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
      <div className="flex flex-col h-full max-w-2xl mx-auto w-full border-2 border-red-500">
        {/* Fixed header with transparent background */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="relative flex justify-between items-center p-4">
            <div className="absolute inset-x-0 flex justify-center items-center">
              <h1 className="text-xl font-bold">Chat</h1>
            </div>
          </div>
        </div>
        
        {/* Messages container with padding-top to account for fixed header */}
        <main className="flex-1 overflow-y-auto px-4 pb-4 pt-16">
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
