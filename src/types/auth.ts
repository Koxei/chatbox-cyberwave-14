export interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
  redirectURL: string;
  showPasswordReset: boolean;
  setShowPasswordReset: (show: boolean) => void;
  resetStep: 'email' | 'otp' | 'password';
  setResetStep: (step: 'email' | 'otp' | 'password') => void;
  onPasswordResetComplete?: () => void;
  onBackToLogin: () => void;
  onGuestLogin?: () => void;
}

export interface PasswordResetFlowProps {
  onBack: () => void;
  onSuccess: () => void;
  onStepChange: (step: 'email' | 'otp' | 'password') => void;
  currentStep: 'email' | 'otp' | 'password';
}

export interface AuthHeaderProps {
  isLogin: boolean;
  showPasswordReset?: boolean;
  resetStep?: 'email' | 'otp' | 'password';
}