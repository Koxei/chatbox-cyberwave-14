export interface AuthModalProps {
  isOpen: boolean;
  onPasswordResetStart?: () => void;
  onPasswordResetComplete?: () => void;
  onClose?: () => void;
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