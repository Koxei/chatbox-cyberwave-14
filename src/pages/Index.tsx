import { useState } from "react";
import Landing from "@/components/Landing";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatHeader from "@/components/ChatHeader";
import MatrixRain from "@/features/effects/MatrixRain";
import ChatContainer from "@/features/chat/components/container/ChatContainer";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChatList } from "@/features/chat/hooks/chat/useChatList";
import { useChatSelection } from "@/features/chat/hooks/chat/useChatSelection";
import { useMessageSubmission } from "@/features/chat/hooks/message/useMessageSubmission";
import { useAIResponse } from "@/features/chat/hooks/message/useAIResponse";

const Index = () => {
  const [showStartButton, setShowStartButton] = useState(true);
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

  const {
    chats,
    setChats,
    loadChats,
    createNewChat
  } = useChatList(userId, isAuthenticated);

  const {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    handleChatSelect
  } = useChatSelection();

  const { submitMessage } = useMessageSubmission(userId, currentChat?.id ?? null, setMessages);
  const { getAIResponse } = useAIResponse(userId, currentChat?.id ?? null, setMessages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentChat || !userId) return;

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

  if (showStartButton) {
    return <Landing onStartClick={handleStartClick} />;
  }

  if (!isAuthenticated || isResettingPassword) {
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
      <ChatHeader 
        currentChat={currentChat}
        chats={chats}
        onChatSelect={handleChatSelect}
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