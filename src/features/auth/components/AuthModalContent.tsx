import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthHeader } from "@/features/auth/components/auth/AuthHeader";
import { AuthForm } from "@/features/auth/components/auth/AuthForm";
import { AuthFooter } from "@/features/auth/components/auth/AuthFooter";

interface AuthModalContentProps {
  isLogin: boolean;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
  showPasswordReset: boolean;
  resetStep: 'email' | 'otp' | 'password';
  onGuestLogin?: () => void;
}

export const AuthModalContent = ({
  isLogin,
  onPasswordResetStart,
  onPasswordResetComplete,
  showPasswordReset,
  resetStep,
  onGuestLogin
}: AuthModalContentProps) => {
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
          redirectURL="https://preview--micaai.lovable.app/auth/v1/callback"
          showPasswordReset={showPasswordReset}
          setShowPasswordReset={onPasswordResetStart || (() => {})}
          resetStep={resetStep}
          setResetStep={(step) => console.log('Step changed:', step)}
          onPasswordResetComplete={onPasswordResetComplete}
          onBackToLogin={() => console.log('Back to login')}
          onToggle={() => console.log('Toggle login/signup')}
          onGuestLogin={onGuestLogin}
        />
        <AuthFooter />
      </div>
    </DialogContent>
  );
};