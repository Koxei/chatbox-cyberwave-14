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

  return (
    <Dialog open={isOpen || showPasswordReset} modal>
      <AuthModalContent 
        isLogin={isLogin}
        showPasswordReset={showPasswordReset}
        resetStep={resetStep}
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