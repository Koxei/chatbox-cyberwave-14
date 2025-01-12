import React from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
  showPasswordReset?: boolean;
  resetStep?: 'email' | 'otp' | 'password';
}

export const AuthHeader = ({ isLogin, showPasswordReset, resetStep }: AuthHeaderProps) => {
  if (showPasswordReset) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">
          {resetStep === "email" && "Reset your password"}
          {resetStep === "otp" && "Enter verification code"}
          {resetStep === "password" && "Set new password"}
        </h2>
        <p className="text-sm text-gray-500">
          {resetStep === "email" && "We'll send you a code to reset your password"}
          {resetStep === "otp" && "Enter the 6-digit code sent to your email"}
          {resetStep === "password" && "Choose a new password for your account"}
        </p>
      </div>
    );
  }

  // Only show the login/signup header when not in password reset flow
  if (!showPasswordReset) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">
          {isLogin ? "Log in to your account" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-500">
          {isLogin 
            ? "Welcome back! Please enter your details." 
            : "Join us! Fill in your information below."}
        </p>
      </div>
    );
  }

  // Return null when in password reset flow
  return null;
};