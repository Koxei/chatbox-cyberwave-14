// src/components/AuthModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { AuthFooter } from "./auth/AuthFooter";

interface AuthModalProps {
  isOpen: boolean;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
}

const AuthModal = ({ 
  isOpen, 
  onPasswordResetStart, 
  onPasswordResetComplete 
}: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');
  const redirectURL = 'https://preview--micaai.lovable.app/auth/v1/callback';

  // Keep dialog open during password reset
  const keepOpen = isOpen || showPasswordReset;

  // Handle password reset state changes
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

  // New handler for back to login
  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setResetStep('email');
    setIsLogin(true);
  };

  // New handler for step changes
  const handleStepChange = (step: 'email' | 'otp' | 'password') => {
    setResetStep(step);
    // Ensure modal stays open during step transitions
    setShowPasswordReset(true);
  };

  return (
    <Dialog open={keepOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <div className="space-y-6">
          <AuthHeader 
            isLogin={isLogin} 
            showPasswordReset={showPasswordReset}
            resetStep={resetStep}
          />
          <AuthForm 
            isLogin={isLogin} 
            redirectURL={redirectURL}
            onToggle={() => setIsLogin(!isLogin)}
            showPasswordReset={showPasswordReset}
            setShowPasswordReset={handlePasswordResetStart}
            resetStep={resetStep}
            setResetStep={handleStepChange}  // Use new handler
            onPasswordResetComplete={handlePasswordResetComplete}
            onBackToLogin={handleBackToLogin}
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

