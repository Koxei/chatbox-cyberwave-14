import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatHeader from "@/components/ChatHeader";
import MatrixRain from "@/features/effects/MatrixRain";
import ChatContainer from "@/features/chat/components/container/ChatContainer";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useMessageSubmission } from "@/features/chat/hooks/message/useMessageSubmission";
import { useAIResponse } from "@/features/chat/hooks/message/useAIResponse";
import { Chat } from "@/types/chat";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    currentChat,
    messages,
    setMessages,
    loadChats,
    createNewChat,
    handleChatSelect
  } = useChats(userId, isGuest);

  const { submitMessage } = useMessageSubmission(userId, currentChat?.id ?? null, setMessages);
  const { getAIResponse } = useAIResponse(userId, currentChat?.id ?? null, setMessages);

  // Check if we should show auth modal based on navigation state
  useEffect(() => {
    const showAuth = location.state?.showAuth;
    if (showAuth) {
      setShowAuthModal(true);
    }
  }, [location.state]);

  // Redirect to landing if accessed directly
  useEffect(() => {
    if (!location.state && !isAuthenticated && !isGuest) {
      navigate('/');
    }
  }, [location.state, isAuthenticated, isGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentChat) return;
    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);
    try {
      const savedMessage = await submitMessage(userMessage);
      if (savedMessage) {
        await getAIResponse(userMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    initGuestSession();
    setShowAuthModal(false);
  };

  if (!isAuthenticated && !isGuest) {
    return (
      <div className="fixed inset-0 bg-black/80">
        <AuthModal 
          isOpen={showAuthModal}
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
    <div className="chat-container p-4">
      <MatrixRain />
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
  );
};

export default Index;
