import React from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => (
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