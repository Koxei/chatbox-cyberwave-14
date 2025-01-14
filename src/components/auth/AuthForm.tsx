// src/features/auth/components/auth/AuthForm.tsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { PasswordResetFlow } from "@/features/auth/components/password-reset/PasswordResetFlow";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
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

export const AuthForm = ({
  isLogin,
  onToggle,
  redirectURL,
  showPasswordReset,
  setShowPasswordReset,
  resetStep,
  setResetStep,
  onPasswordResetComplete,
  onBackToLogin,
  onGuestLogin
}: AuthFormProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session:', session);

      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        console.log('Redirecting to home page...');
        navigate('/home');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };

  if (showPasswordReset) {
    return (
      <PasswordResetFlow
        onBack={onBackToLogin}
        onSuccess={() => {
          onPasswordResetComplete?.();
          onBackToLogin();
        }}
        onStepChange={setResetStep}
        currentStep={resetStep}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Auth
        supabaseClient={supabase}
        view={isLogin ? "sign_in" : "sign_up"}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#00ffff',
                brandAccent: '#00cccc'
              }
            }
          }
        }}
        providers={["google"]}
        redirectTo={redirectURL}
        showLinks={false}
      />
      
      {isLogin && (
        <>
          <button
            onClick={() => setShowPasswordReset(true)}
            className="text-sm text-cyan-600 hover:text-cyan-500 w-full text-center"
          >
            Forgot password?
          </button>
          {onGuestLogin && (
            <button
              onClick={onGuestLogin}
              className="w-full flex justify-center py-2 px-4 border border-cyan-600 rounded-md shadow-sm text-sm font-medium text-cyan-600 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Continue as Guest
            </button>
          )}
        </>
      )}

      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
        <button
          onClick={handleToggle}
          className="text-cyan-600 hover:text-cyan-500 font-medium"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
