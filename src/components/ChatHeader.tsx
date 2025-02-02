import { Chat } from "@/types/chat";

interface ChatHeaderProps {
  currentChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
}

const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2 flex-1 justify-center">
        <h1 className="text-xl font-bold">Chat</h1>
      </div>
    </div>
  );
};

export default ChatHeader;