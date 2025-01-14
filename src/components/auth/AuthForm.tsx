import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { PasswordResetFlow } from "@/features/auth/components/password-reset/PasswordResetFlow";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserExists } from "@/hooks/useCheckUser";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!isLogin) {
      // First check if user exists
      const exists = await checkUserExists(email);
      if (!exists) {
        // Only proceed with signup if user doesn't exist
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to create account",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
    }
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>
      
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
          onClick={onToggle}
          className="text-cyan-600 hover:text-cyan-500 font-medium"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
};