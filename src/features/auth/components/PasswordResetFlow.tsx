import { ResetStepContainer } from "./password-reset/ResetStepContainer";

interface PasswordResetFlowProps {
  onBack: () => void;
  onSuccess: () => void;
  onStepChange: (step: 'email' | 'otp' | 'password') => void;
  currentStep: 'email' | 'otp' | 'password';
}

export const PasswordResetFlow = ({
  onBack,
  onSuccess,
  onStepChange,
  currentStep
}: PasswordResetFlowProps) => {
  return (
    <ResetStepContainer
      currentStep={currentStep}
      onBack={onBack}
      onSuccess={onSuccess}
      onStepChange={onStepChange}
    />
  );
};