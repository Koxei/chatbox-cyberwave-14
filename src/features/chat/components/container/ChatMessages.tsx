import React from 'react';
import { Message } from '@/types/chat';
import ChatMessage from '../messages/ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <div className="relative z-30">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || index}
          isAI={message.is_ai}
          message={message.content}
          type={message.type}  // Added type prop
        />
      ))}
      {isLoading && (
        <ChatMessage
          isAI
          message="Wait a second pwease. . ."
          type="text"  // Added explicit text type for loading message
        />
      )}
    </div>
  );
};

export default ChatMessages;