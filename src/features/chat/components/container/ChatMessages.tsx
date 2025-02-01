import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from '../messages/ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="relative z-30">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || index}
          isAI={message.is_ai}
          message={message.content}
          type={message.type || 'text'}
        />
      ))}
      {isLoading && (
        <ChatMessage
          isAI
          message="Wait a second pwease. . ."
          type="text"
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;