import { useState } from "react";
import Landing from "@/components/Landing";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatMessage from "@/features/chat/components/messages/ChatMessage";
import ChatHeader from "@/components/ChatHeader";
import MatrixRain from "@/features/effects/MatrixRain";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";
import { useMessageHandler } from "@/features/chat/hooks/useMessageHandler";

const Index = () => {
  const [showStartButton, setShowStartButton] = useState(true);
  
  const {
    isAuthenticated,
    showAuthModal,
    setShowAuthModal,
    isResettingPassword,
    setIsResettingPassword,
    userId
  } = useAuth();

  const {
    chats,
    currentChat,
    messages,
    loadChats,
    createNewChat,
    handleChatSelect
  } = useChats(userId, isAuthenticated);

  const {
    inputMessage,
    setInputMessage,
    isLoading,
    handleSubmit
  } = useMessageHandler(userId, currentChat, messages, chats, currentChat);

  const handleStartClick = () => {
    setShowStartButton(false);
    setShowAuthModal(true);
  };

  // Show auth modal if not authenticated or resetting password
  const showModal = !isAuthenticated || isResettingPassword;

  if (showStartButton) {
    return <Landing onStartClick={handleStartClick} />;
  }

  if (showModal) {
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
        />
      </div>
    );
  }

  return (
    <div className="chat-container p-4">
      <MatrixRain />
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader 
          currentChat={currentChat}
          chats={chats}
          onChatSelect={handleChatSelect}
          onNewChat={createNewChat}
          isAuthenticated={isAuthenticated}
        />
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              isAI={message.is_ai}
              message={message.content}
            />
          ))}
          {isLoading && (
            <ChatMessage
              isAI
              message="Wait a second pwease. . ."
            />
          )}
          {!currentChat && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <PlusCircle className="w-12 h-12 mb-4" />
              <p className="text-lg">Start a new chat</p>
            </div>
          )}
        </main>
        {currentChat && (
          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-black/50 backdrop-blur-sm border-t border-userMessage"
          >
            <div className="max-w-3xl mx-auto flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Write something c:"
                className="flex-1 bg-container p-2 rounded border border-userMessage text-white font-arcade"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-container border border-userMessage text-userMessage rounded font-arcade hover:opacity-80 transition-opacity disabled:opacity-50"
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;