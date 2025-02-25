import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { AuthFooter } from "./auth/AuthFooter";
import { AUTH_CONFIG } from "@/config/auth";

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
  onGuestLogin
}: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');

  // Keep dialog open during password reset
  const keepOpen = isOpen || showPasswordReset;

  // Get the appropriate title based on current state
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
    console.log('Back to login clicked');
    setShowPasswordReset(false);
    setResetStep('email');
    setIsLogin(true);
  };

  const handlePasswordResetStart = () => {
    console.log('Password reset started');
    setShowPasswordReset(true);
    setResetStep('email');
    onPasswordResetStart?.();
  };

  const handlePasswordResetComplete = () => {
    console.log('Password reset completed');
    setShowPasswordReset(false);
    setResetStep('email');
    onPasswordResetComplete?.();
  };

  const handleStepChange = (step: 'email' | 'otp' | 'password') => {
    console.log('Step changed:', step);
    setResetStep(step);
    setShowPasswordReset(true);
  };

  const handleGuestLogin = async () => {
    console.log('Guest login clicked');
    if (onGuestLogin) {
      await onGuestLogin();
    }
  };

  const handleAuthToggle = () => {
    console.log('AuthModal toggle handler called');
    setIsLogin(!isLogin);
    if (showPasswordReset) {
      setShowPasswordReset(false);
      setResetStep('email');
    }
  };

  return (
    <Dialog open={keepOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-sm text-black p-6">
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