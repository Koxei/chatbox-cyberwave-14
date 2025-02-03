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
    <div className={cn(
      "p-4 mb-4 relative z-[100]",
      isAI ? "ml-0 mr-auto" : "ml-auto mr-0",
      "max-w-[70%] w-fit"
    )}>
      <div className={cn(
        "flex items-start gap-2 p-4 rounded-lg",
        isAI ? "text-aiMessage" : "text-userMessage"
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
              className="max-w-full rounded-lg"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <p className={cn(
            "text-lg break-words font-semibold",
            isAI ? "font-marck" : "font-noto"
          )}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;