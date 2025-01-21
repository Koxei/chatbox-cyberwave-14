import { useState } from "react";

import AuthModal from "@/features/auth/components/AuthModal";

import ChatHeader from "@/components/ChatHeader";

import ChatContainer from "@/features/chat/components/container/ChatContainer";

import { useAuth } from "@/features/chat/hooks/useAuth";

import { useChats } from "@/features/chat/hooks/useChats";

import { useGuestSession } from "@/features/chat/hooks/useGuestSession";

import { useMessageHandler } from "@/features/chat/hooks/useMessageHandler";

import { Chat } from "@/types/chat";

const Home = () => {

const {

isAuthenticated,
showAuthModal,
setShowAuthModal,
isResettingPassword,
setIsResettingPassword,
userId
} = useAuth();

const { isGuest, guestId, initGuestSession, clearGuestSession } = useGuestSession();

const {

chats,
setChats,
currentChat,
setCurrentChat,
messages,
setMessages,
loadChats,
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
  <>
    {/* New full-screen background overlay */}
    <div className="fixed inset-0 bg-black/30 pointer-events-none" />
    
    {/* Chat container with relative positioning */}
    <div className="relative z-10">
      <div className="chat-container">
        <ChatHeader 
          currentChat={currentChat}
          chats={chats}
          onChatSelect={(chat: Chat) => handleChatSelect(chat.id)}
          onNewChat={createNewChat}
          isAuthenticated={isAuthenticated}
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
  </>
);


};

export default Home;