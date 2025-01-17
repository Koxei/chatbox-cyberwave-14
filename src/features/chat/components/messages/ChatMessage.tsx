import React from "react";

interface ChatMessageProps {
  isAI?: boolean;
  message: string;
  imageUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isAI = false, message, imageUrl }) => {
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
        <div className="flex flex-col gap-2">
          <p className="font-sans">{message}</p>
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Generated" 
              className="rounded-lg max-w-[512px] w-full h-auto"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;