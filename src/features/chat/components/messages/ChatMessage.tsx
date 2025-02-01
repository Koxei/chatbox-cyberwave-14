import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  isAI?: boolean;
  message: string;
  type?: 'text' | 'image';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  isAI = false, 
  message, 
  type = 'text'
}) => {
  return (
    <div className="w-full p-4 mb-4 relative z-[100] bg-black bg-opacity-50">
      <div className={cn(
        "flex items-start gap-2 p-4 rounded-lg border-2",
        isAI ? "border-aiMessage text-aiMessage" : "border-userMessage text-userMessage"
      )}>
        <span className="font-arcade text-base flex-shrink-0">
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
        
        {type === 'image' ? (
          <div className="flex-1">
            <img 
              src={message} 
              alt="AI Generated Image" 
              className="max-w-full rounded-lg border-2 border-aiMessage"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <p className="font-sans text-lg break-words flex-1 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;