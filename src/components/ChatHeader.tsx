import { Chat } from "@/types/chat";
import AuthenticatedChatHeader from "./headers/AuthenticatedChatHeader";
import GuestChatHeader from "./headers/GuestChatHeader";

interface ChatHeaderProps {
  currentChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
}

const ChatHeader = ({ 
  currentChat, 
  chats, 
  onChatSelect, 
  onNewChat, 
  isAuthenticated 
}: ChatHeaderProps) => {
  return isAuthenticated ? (
    <AuthenticatedChatHeader
      currentChat={currentChat}
      chats={chats}
      onChatSelect={onChatSelect}
      onNewChat={onNewChat}
    />
  ) : (
    <GuestChatHeader />
  );
};

export default ChatHeader;