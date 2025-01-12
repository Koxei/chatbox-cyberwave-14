import { EmailStep } from "./password-reset/EmailStep";
import { OTPStep } from "./password-reset/OTPStep";
import { PasswordStep } from "./password-reset/PasswordStep";
import { usePasswordReset } from "./password-reset/usePasswordReset";

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
    const success = await handleRequestCode(e);
    if (success) onStepChange('otp');
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    const success = await handleVerifyOTP(e);
    if (success) onStepChange('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    await handleUpdatePassword(e);
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
          otp={otp}
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
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};