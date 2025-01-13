import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { PasswordStep } from "./PasswordStep";
import { usePasswordReset } from "../../hooks/usePasswordReset";

interface ResetStepContainerProps {
  currentStep: 'email' | 'otp' | 'password';
  onBack: () => void;
  onSuccess: () => void;
  onStepChange: (step: 'email' | 'otp' | 'password') => void;
}

export const ResetStepContainer = ({
  currentStep,
  onBack,
  onSuccess,
  onStepChange
}: ResetStepContainerProps) => {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    loading,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword
  } = usePasswordReset(onSuccess);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleRequestCode(e);
    if (success) onStepChange('otp');
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleVerifyOTP(e);
    if (success) onStepChange('password');
  };

  return (
    <div className="space-y-4">
      {currentStep === "email" && (
        <EmailStep
          email={email}
          loading={loading}
          onEmailChange={setEmail}
          onSubmit={handleEmailSubmit}
          onBack={onBack}
        />
      )}
      {currentStep === "otp" && (
        <OTPStep
          otp={otp || ""}
          loading={loading}
          onOTPChange={setOtp}
          onSubmit={handleOTPSubmit}
        />
      )}
      {currentStep === "password" && (
        <PasswordStep
          password={newPassword}
          loading={loading}
          onPasswordChange={setNewPassword}
          onSubmit={handleUpdatePassword}
        />
      )}
    </div>
  );
};