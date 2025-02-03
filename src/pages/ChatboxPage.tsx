import { useState, useEffect } from "react";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/features/chat/components/container/ChatContainer";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useMessageHandler } from "@/features/chat/hooks/useMessageHandler";
import { Chat } from "@/types/chat";

const ChatboxPage = () => {
  // Add new state for controlling mount animation
  const [isMounted, setIsMounted] = useState(false);
  
  const {
    isAuthenticated,
    showAuthModal,
    setShowAuthModal,
    isResettingPassword,
    setIsResettingPassword,
    userId
  } = useAuth();

  const { isGuest, initGuestSession } = useGuestSession();

  const {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    createNewChat,
    handleChatSelect
  } = useChats(userId, isGuest);

  const {
    inputMessage,
    setInputMessage,
    isLoading,
    handleSubmit
  } = useMessageHandler(
    userId,
    currentChat,
    setMessages,
    setChats,
    setCurrentChat
  );

  // Add useEffect for mount animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGuestLogin = () => {
    initGuestSession();
    setShowAuthModal(false);
  };

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      setCurrentChat(newChat);
      setMessages([]);
    }
  };

  if (!isAuthenticated && !isGuest) {
    return (
      <div className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        <AuthModal 
          isOpen={true}
          onPasswordResetStart={() => setIsResettingPassword(true)}
          onPasswordResetComplete={() => {
            setIsResettingPassword(false);
            if (isAuthenticated) {
              setShowAuthModal(false);
            }
          }}
          onGuestLogin={handleGuestLogin}
        />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative z-10">
        <div className="chat-container">
          <ChatHeader 
            currentChat={currentChat}
            chats={chats}
            onChatSelect={(chat: Chat) => handleChatSelect(chat.id)}
            onNewChat={handleNewChat}
            isAuthenticated={!isGuest}
          />
          <ChatContainer
            currentChat={currentChat}
            messages={messages}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatboxPage;
