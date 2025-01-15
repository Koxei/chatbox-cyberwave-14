// src/pages/NewHome.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import AuthModal from "@/features/auth/components/AuthModal";
import { Terminal as TerminalIcon } from "lucide-react";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showAuthModal, setShowAuthModal, isResettingPassword, setIsResettingPassword } = useAuth();
  const { isGuest, initGuestSession } = useGuestSession();

  const handleGuestLogin = () => {
    initGuestSession();
    navigate('/home', { replace: true });
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
    <div className="fixed inset-0 bg-deep-sea-blue flex flex-col items-center justify-center p-4">
      <div className="flex gap-8">
        <div 
          className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => navigate("/chatbox")}
        >
          <div className="w-20 h-20 bg-black rounded-lg shadow-lg"></div>
          <p className="mt-2 text-white font-medium">Chatbox</p>
        </div>

        <div 
          className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => navigate("/terminal")}
        >
          <div className="w-20 h-20 bg-black rounded-lg shadow-lg flex items-center justify-center">
            <TerminalIcon className="w-12 h-12 text-cyan-500" />
          </div>
          <p className="mt-2 text-white font-medium">Terminal</p>
        </div>
      </div>
    </div>
  );
};

export default NewHome;
