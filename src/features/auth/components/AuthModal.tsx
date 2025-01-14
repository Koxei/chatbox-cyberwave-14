import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthModalContent } from "./AuthModalContent";

interface AuthModalProps {
  isOpen: boolean;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
  onGuestLogin?: () => void;
}

const AuthModal = ({
  isOpen,
  onPasswordResetStart,
  onPasswordResetComplete,
  onGuestLogin
}: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');

  const handleToggle = () => {
    console.log('AuthModal handleToggle called');
    console.log('Current isLogin:', isLogin);
    setIsLogin(!isLogin);
    console.log('New isLogin will be:', !isLogin);
  };

  return (
    <Dialog open={isOpen || showPasswordReset} modal>
      <AuthModalContent 
        isLogin={isLogin}
        showPasswordReset={showPasswordReset}
        resetStep={resetStep}
        onToggle={handleToggle}
        onPasswordResetStart={() => {
          setShowPasswordReset(true);
          onPasswordResetStart?.();
        }}
        onPasswordResetComplete={() => {
          setShowPasswordReset(false);
          onPasswordResetComplete?.();
        }}
        onGuestLogin={onGuestLogin}
      />
    </Dialog>
  );
};

export default AuthModal;