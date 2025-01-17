import React from "react";

interface ChatMessageProps {
  isAI?: boolean;
  message: string;
  type?: 'text' | 'image';
  imageUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isAI = false, message, type = 'text', imageUrl }) => {
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
        {type === 'image' ? (
          <div className="flex flex-col gap-2">
            <p className="font-sans">{message}</p>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="AI Generated" 
                className="max-w-full rounded-lg shadow-lg"
                style={{ maxHeight: '512px' }}
              />
            )}
          </div>
        ) : (
          <p className="font-sans">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;