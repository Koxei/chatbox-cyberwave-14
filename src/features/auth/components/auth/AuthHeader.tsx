import React from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
  showPasswordReset?: boolean;
  resetStep?: 'email' | 'otp' | 'password';
}

export const AuthHeader = ({ isLogin, showPasswordReset }: AuthHeaderProps) => {
  if (!showPasswordReset) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">
          {isLogin ? "Log in to your account" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-500">
<<<<<<< HEAD
        {!
isLogin 
&& "Join us! Fill in your information below."}
=======
          {!isLogin && "Join us! Fill in your information below."}
>>>>>>> dd3790dfcb26c033213f0d61c324380e9ff43eeb
        </p>
      </div>
    );
  }
  return null;
};
