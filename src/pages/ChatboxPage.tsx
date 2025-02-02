import { useState } from "react";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/features/chat/components/container/ChatContainer";
import ChatControls from "@/components/ChatControls";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useMessageHandler } from "@/features/chat/hooks/useMessageHandler";

const ChatboxPage = () => {
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

  const handleGuestLogin = () => {
    console.log("Initializing guest session...");
    initGuestSession();
    setShowAuthModal(false);
  };

  const handleNewChat = async () => {
    console.log("Creating new chat...");
    const newChat = await createNewChat();
    if (newChat) {
      setCurrentChat(newChat);
      setMessages([]); // Clear messages for the new chat
      console.log("New chat created:", newChat);
    }
  };

  if (!isAuthenticated && !isGuest) {
    return (
      <div className="fixed inset-0 bg-black/80">
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
    <div className="relative w-full h-full">
      <ChatControls
        currentChat={currentChat}
        chats={chats}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        isAuthenticated={isAuthenticated}
      />
      <div className="relative z-10">
        <div className="chat-container">
          <ChatHeader />
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