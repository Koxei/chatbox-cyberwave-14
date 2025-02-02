import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import AuthModal from "@/features/auth/components/AuthModal";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showAuthModal, setShowAuthModal, isResettingPassword, setIsResettingPassword } = useAuth();
  const { initGuestSession } = useGuestSession();

  const handleGuestLogin = async () => {
    await initGuestSession();
    setShowAuthModal(false);
    navigate('/home', { replace: true });
  };

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
};

export default Login;