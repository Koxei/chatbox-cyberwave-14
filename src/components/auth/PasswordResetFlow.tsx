import { useState, useEffect } from "react";

import { EmailStep } from "./password-reset/EmailStep";

import { OTPStep } from "./password-reset/OTPStep";

import { PasswordStep } from "./password-reset/PasswordStep";

import { usePasswordReset } from "./password-reset/usePasswordReset"; // Added missing import

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

console.log('PasswordResetFlow rendering, currentStep:', currentStep);

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

console.log('Handling email submit');
e.preventDefault();
const success = await handleRequestCode(e);
if (success) {
  console.log('Email step successful, changing to OTP step');
  onStepChange('otp');
}
};

const handleOTPSubmit = async (e: React.FormEvent) => {

console.log('Handling OTP submit');
e.preventDefault();
const success = await handleVerifyOTP(e);
if (success) {
  console.log('OTP verification successful, changing to password step');
  onStepChange('password');
}
};

const handlePasswordSubmit = async (e: React.FormEvent) => {

console.log('Handling password submit');
e.preventDefault();
await handleUpdatePassword(e);
};

// Only render the current step

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
      otp={otp || ""}  // Ensure otp is never undefined
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