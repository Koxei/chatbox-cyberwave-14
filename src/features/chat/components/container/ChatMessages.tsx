import React, { useEffect, useRef } from 'react';

import { Message } from '@/types/chat';

import ChatMessage from '../messages/ChatMessage';

interface ChatMessagesProps {

messages: Message[];

isLoading: boolean;

}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {

// Add ref for scroll management

const messagesEndRef = useRef<HTMLDivElement>(null);

// Auto scroll to bottom when messages change

const scrollToBottom = () => {

messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {

scrollToBottom();
}, [messages, isLoading]); // Scroll when messages or loading state changes

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
  {/* Add div ref for scrolling */}
  <div ref={messagesEndRef} />
</div>
);

};

export default ChatMessages;