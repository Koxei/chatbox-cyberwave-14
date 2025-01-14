import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { PasswordResetFlow } from "@/features/auth/components/password-reset/PasswordResetFlow";
import { SignUpForm } from "@/features/auth/components/signup/SignUpForm";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session:', session);
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        console.log('Redirecting to home page...');
        navigate('/home');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString();
      const password = formData.get('password')?.toString();
      
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (!isLogin) {
    return (
      <SignUpForm
        onSuccess={() => navigate('/home')}
        onBack={onToggle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleLoginSubmit} className="space-y-4">
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
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

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