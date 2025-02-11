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
      width={35} 
      height={35} 
      className="w-[35px] h-[35px] flex-shrink-0 min-w-[35px] min-h-[35px]" 
    />
  ) : ">"}
        </span>
        <p className="font-sans">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;