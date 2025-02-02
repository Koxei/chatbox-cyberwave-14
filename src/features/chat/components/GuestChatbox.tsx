import { Chat } from "@/types/chat";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/features/chat/components/container/ChatContainer";

interface GuestChatboxProps {
  currentChat: Chat | null;
  messages: any[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const GuestChatbox = ({
  currentChat,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSubmit,
}: GuestChatboxProps) => {
  return (
    <>
      <div className="relative z-10">
        <div className="chat-container">
          <ChatHeader 
            currentChat={currentChat}
            chats={[]}
            onChatSelect={() => {}}
            onNewChat={() => {}}
            isAuthenticated={false}
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

export default GuestChatbox;