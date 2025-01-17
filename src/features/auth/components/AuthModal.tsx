import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { AuthFooter } from "./auth/AuthFooter";
import { AUTH_CONFIG } from "@/config/auth";
import { useNavigate } from "react-router-dom";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";

interface AuthModalProps {
  isOpen: boolean;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
  onClose?: () => void;
  onGuestLogin?: () => void;
}

const AuthModal = ({
  isOpen,
  onPasswordResetStart,
  onPasswordResetComplete,
  onClose,
  onGuestLogin,
}: AuthModalProps) => {
  const navigate = useNavigate();
  const { initGuestSession } = useGuestSession();
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');

  const keepOpen = isOpen || showPasswordReset;

  const getDialogTitle = () => {
    if (showPasswordReset) {
      switch (resetStep) {
        case 'email':
          return 'Reset Password';
        case 'otp':
          return 'Enter Verification Code';
        case 'password':
          return 'Set New Password';
        default:
          return 'Reset Password';
      }
    }
    return isLogin ? "Log In" : "Sign Up";
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setResetStep('email');
    setIsLogin(true);
  };

  const handlePasswordResetStart = () => {
    setShowPasswordReset(true);
    setResetStep('email');
    onPasswordResetStart?.();
  };

  const handlePasswordResetComplete = () => {
    setShowPasswordReset(false);
    setResetStep('email');
    onPasswordResetComplete?.();
  };

  const handleStepChange = (step: 'email' | 'otp' | 'password') => {
    setResetStep(step);
    setShowPasswordReset(true);
  };

  const handleGuestLogin = () => {
    initGuestSession();
    navigate('/home', { replace: true });
  };

  const handleAuthToggle = () => {
    setIsLogin(!isLogin);
    if (showPasswordReset) {
      setShowPasswordReset(false);
      setResetStep('email');
    }
  };

  return (
    <Dialog open={keepOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <DialogTitle className="sr-only">{getDialogTitle()}</DialogTitle>
        <div className="space-y-6">
          <AuthHeader 
            isLogin={isLogin} 
            showPasswordReset={showPasswordReset}
            resetStep={resetStep}
          />
          <AuthForm 
            isLogin={isLogin} 
            redirectURL={AUTH_CONFIG.redirectURL}
            onToggle={handleAuthToggle}
            showPasswordReset={showPasswordReset}
            setShowPasswordReset={handlePasswordResetStart}
            resetStep={resetStep}
            setResetStep={handleStepChange}
            onPasswordResetComplete={handlePasswordResetComplete}
            onBackToLogin={handleBackToLogin}
            onGuestLogin={handleGuestLogin}
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;