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
    <div className={`message ${isAI ? "message-ai" : "message-user"} relative z-50`}>
      <div className="flex items-start gap-2 relative z-50">
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
        <p className="font-sans text-base break-words flex-1 relative z-50 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
