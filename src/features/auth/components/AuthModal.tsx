// src/features/auth/components/AuthModal.tsx

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

  // Updated handler for back to login
  const handleBackToLogin = () => {
    console.log('Back to login clicked');
    setShowPasswordReset(false); // Reset password reset state
    setResetStep('email'); // Reset step
    setIsLogin(true); // Ensure we're in login mode
  };

  // Handle password reset state changes
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

  // New handler for step changes
  const handleStepChange = (step: 'email' | 'otp' | 'password') => {
    console.log('Step changed:', step);
    setResetStep(step);
    // Ensure modal stays open during step transitions
    setShowPasswordReset(true);
  };

  // Handle guest login
  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    onGuestLogin?.();
  };

  // Handle auth toggle
  const handleAuthToggle = () => {
    console.log('AuthModal toggle handler called');
    setIsLogin(!isLogin);
    // Reset password reset state when toggling
    if (showPasswordReset) {
      setShowPasswordReset(false);
      setResetStep('email');
    }
  };

  return (
    <Dialog open={keepOpen} modal>
      <DialogContent 
        className="sm:max-w-[425px] bg-white text-black p-6"
        aria-describedby="auth-modal-description"
      >
        <DialogTitle className="sr-only">{getDialogTitle()}</DialogTitle>
        {/* Add this hidden description for accessibility */}
        <div id="auth-modal-description" className="sr-only">
          Authentication modal for login, signup, and guest access
        </div>
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
