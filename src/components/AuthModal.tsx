// src/components/AuthModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { AuthFooter } from "./auth/AuthFooter";

interface AuthModalProps {
  isOpen: boolean;
  onPasswordResetStart?: () => void;  // Added new prop
  onPasswordResetComplete?: () => void;  // Added new prop
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
    onPasswordResetStart?.();
  };

  const handlePasswordResetComplete = () => {
    setShowPasswordReset(false);
    setResetStep('email');
    onPasswordResetComplete?.();
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
            setResetStep={setResetStep}
            onPasswordResetComplete={handlePasswordResetComplete}
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
