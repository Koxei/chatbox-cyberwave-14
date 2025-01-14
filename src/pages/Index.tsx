import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Landing from "@/components/Landing";
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
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [showStartButton, setShowStartButton] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setShowStartButton(false);
          navigate('/home', { replace: true });
        }
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in Index:', event);
      if (event === 'SIGNED_IN' && session) {
        setShowStartButton(false);
        navigate('/home', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const handleStartClick = () => {
    setShowStartButton(false);
    setShowAuthModal(true);
  };

  const handleGuestLogin = () => {
    initGuestSession();
    setShowAuthModal(false);
    setShowStartButton(false);
  };

  // Show nothing while checking auth state
  if (isAuthChecking) {
    return null;
  }

  if (showStartButton) {
    return <Landing onStartClick={handleStartClick} />;
  }

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