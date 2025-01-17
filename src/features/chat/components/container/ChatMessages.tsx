import React from 'react';
import { Message } from '@/types/chat';
import ChatMessage from '../messages/ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || index}
          isAI={message.is_ai}
          message={message.content}
        />
      ))}
      {isLoading && (
        <ChatMessage
          isAI
          message="Wait a second pwease. . ."
        />
      )}
    </>
  );
};

export default ChatMessages;