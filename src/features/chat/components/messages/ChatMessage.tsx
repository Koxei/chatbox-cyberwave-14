// src/features/chat/components/messages/ChatMessage.tsx
import React from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { MessageSquare, User } from "lucide-react";

interface ChatMessageProps {
  isAI?: boolean;
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isAI = false, message }) => {
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
        <p className="font-sans text-lg break-words flex-1 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
