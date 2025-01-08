import React from "react";

interface ChatMessageProps {
  isAI?: boolean;
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isAI = false, message }) => {
  return (
    <div className={`message ${isAI ? "message-ai" : "message-user"}`}>
      <div className="flex items-start gap-2">
        <span className="font-arcade text-sm">
          {isAI ? (
    <img 
      src="/lovable-uploads/girl.png" 
      alt="AI Avatar" 
      width={48} 
      height={48} 
      className="w-[48px] h-[48px]" 
    />
  ) : ">"}
        </span>
        <p className="font-sans">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;