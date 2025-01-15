import React from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
  showPasswordReset?: boolean;
  resetStep?: 'email' | 'otp' | 'password';
}

export const AuthHeader = ({ isLogin, showPasswordReset, resetStep }: AuthHeaderProps) => {
  if (showPasswordReset) {
    switch (resetStep) {
      case 'email':
        return <h2 className="text-2xl font-bold text-center">Reset Password</h2>;
      case 'otp':
        return <h2 className="text-2xl font-bold text-center">Enter Verification Code</h2>;
      case 'password':
        return <h2 className="text-2xl font-bold text-center">Set New Password</h2>;
      default:
        return <h2 className="text-2xl font-bold text-center">Reset Password</h2>;
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-1">
        {isLogin ? "Welcome back" : "Create your account"}
      </h2>
      {isLogin && (
        <p className="text-sm text-gray-500">
          Please enter your details
        </p>
      )}
    </div>
  );
};