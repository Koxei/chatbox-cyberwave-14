import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import AuthModal from "@/features/auth/components/AuthModal";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showAuthModal, setShowAuthModal, isResettingPassword, setIsResettingPassword, userId } = useAuth();

  if (!isAuthenticated) {
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
          onGuestLogin={() => navigate('/home')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div 
        className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
        onClick={() => navigate("/chatbox")}
      >
        <div className="w-20 h-20 bg-black rounded-lg shadow-lg"></div>
        <p className="mt-2 text-white font-medium">Chatbox</p>
      </div>
    </div>
  );
};

export default NewHome;