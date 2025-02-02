import React from 'react';
import { Chat } from '@/types/chat';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistoryProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
}

const ChatHistory = ({ chats, onChatSelect }: ChatHistoryProps) => {
  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-4 p-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className="p-4 rounded-lg border border-aiMessage bg-black/50 cursor-pointer hover:bg-black/70 transition-colors"
          >
            <h3 className="text-aiMessage font-arcade text-sm truncate">
              {chat.title}
            </h3>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(chat.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatHistory;