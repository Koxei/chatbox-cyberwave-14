import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthModal from "@/features/auth/components/AuthModal";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { initGuestSession } = useGuestSession();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGuestLogin = async () => {
    try {
      console.log('Initializing guest session...');
      await initGuestSession();
      console.log('Guest session initialized, navigating to home...');
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Guest login error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize guest session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0">
      <div className="relative z-10">
        <AuthModal 
          isOpen={true}
          onPasswordResetStart={() => {}}
          onPasswordResetComplete={() => {}}
          onGuestLogin={handleGuestLogin}
        />
      </div>
    </div>
  );
};

export default Login;