// src/features/auth/components/AuthModalContent.tsx

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthHeader } from "@/features/auth/components/auth/AuthHeader";
import { AuthForm } from "@/features/auth/components/auth/AuthForm";
import { AuthFooter } from "@/features/auth/components/auth/AuthFooter";

interface AuthModalContentProps {
  isLogin: boolean;
  onToggle: () => void;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
  showPasswordReset: boolean;
  resetStep: 'email' | 'otp' | 'password';
  onBackToLogin: () => void;
  onGuestLogin?: () => void;
}

export const AuthModalContent = ({
  isLogin,
  onToggle,
  onPasswordResetStart,
  onPasswordResetComplete,
  showPasswordReset,
  resetStep,
  onBackToLogin,
  onGuestLogin
}: AuthModalContentProps) => {
  const redirectURL = `${window.location.origin}/auth/callback`;

  // Updated to ensure state sync
  const handleBackToLogin = () => {
    console.log('AuthModalContent: Back to login');
    onBackToLogin();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
      <DialogTitle className="sr-only">
        {showPasswordReset ? "Reset Password" : (isLogin ? "Log In" : "Sign Up")}
      </DialogTitle>
      <div className="space-y-6">
        <AuthHeader 
          isLogin={isLogin} 
          showPasswordReset={showPasswordReset}
          resetStep={resetStep}
        />
        <AuthForm 
          isLogin={isLogin}
          redirectURL={redirectURL}
          onToggle={onToggle}
          showPasswordReset={showPasswordReset}
          setShowPasswordReset={onPasswordResetStart || (() => {})}
          resetStep={resetStep}
          setResetStep={(step) => console.log('Step changed:', step)}
          onPasswordResetComplete={onPasswordResetComplete}
          onBackToLogin={handleBackToLogin}
          onGuestLogin={onGuestLogin}
        />
        <AuthFooter />
      </div>
    </DialogContent>
  );
};
