import { Chat } from "@/types/chat";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/features/chat/components/container/ChatContainer";

interface AuthenticatedChatboxProps {
  currentChat: Chat | null;
  chats: Chat[];
  messages: any[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
}

const AuthenticatedChatbox = ({
  currentChat,
  chats,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSubmit,
  onChatSelect,
  onNewChat,
}: AuthenticatedChatboxProps) => {
  return (
    <>
      <div className="relative z-10">
        <div className="chat-container">
          <ChatHeader 
            currentChat={currentChat}
            chats={chats}
            onChatSelect={onChatSelect}
            onNewChat={onNewChat}
            isAuthenticated={true}
          />
          <ChatContainer
            currentChat={currentChat}
            messages={messages}
            isLoading={isLoading}
            onSubmit={onSubmit}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        </div>
      </div>
    </>
  );
};

export default AuthenticatedChatbox;