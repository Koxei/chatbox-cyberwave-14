import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PasswordResetFlow } from "@/features/auth/components/password-reset/PasswordResetFlow";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleSignUp } = useSignUp(() => {
    navigate('/home', { replace: true });
  });

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/home', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err.message);
      toast({
        title: "Error",
        description: "Invalid login credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting signup process');
    try {
      const result = await handleSignUp(email, password);
      if (!result?.error) {
        navigate('/home', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    if (onGuestLogin) {
      onGuestLogin();
      navigate('/home', { replace: true });
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
      <form onSubmit={isLogin ? handleLoginSubmit : handleSignUpSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#D3E4FD] hover:bg-[#C3D4F5] active:scale-[0.98] transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          disabled={loading}
        >
          {loading ? (isLogin ? "Signing in..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
        </Button>
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
              onClick={(e) => {
                e.preventDefault();
                handleGuestLogin();
              }}
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