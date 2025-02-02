import { useState } from "react";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useMessageHandler } from "@/features/chat/hooks/useMessageHandler";
import AuthenticatedChatbox from "@/features/chat/components/AuthenticatedChatbox";
import GuestChatbox from "@/features/chat/components/GuestChatbox";
import { Chat } from "@/types/chat";
//s
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
    handleChatSelect,
    createNewChat,
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
      setMessages([]);
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

  return isAuthenticated ? (
    <AuthenticatedChatbox
      currentChat={currentChat}
      chats={chats}
      messages={messages}
      isLoading={isLoading}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      onSubmit={handleSubmit}
      onChatSelect={(chat: Chat) => handleChatSelect(chat.id)}
      onNewChat={handleNewChat}
    />
  ) : (
    <GuestChatbox
      currentChat={currentChat}
      messages={messages}
      isLoading={isLoading}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      onSubmit={handleSubmit}
    />
  );
  
  

export default ChatboxPage;