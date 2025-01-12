// src/components/auth/AuthHeader.tsx
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

// src/components/auth/AuthForm.tsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isLogin: boolean;
  redirectURL: string;
}

export const AuthForm = ({ isLogin, redirectURL }: AuthFormProps) => (
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
      },
      className: {
        container: 'space-y-4',
        label: 'text-sm font-medium text-gray-700',
        input: 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500',
        button: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500',
        divider: 'my-4',
        anchor: 'text-sm text-cyan-600 hover:text-cyan-500'
      }
    }}
    providers={["google"]}
    redirectTo={redirectURL}
    showLinks={false}
    localization={{
      variables: {
        sign_in: {
          email_label: "Email",
          password_label: "Password",
          button_label: "Sign in",
          loading_button_label: "Signing in ...",
          social_provider_text: "Sign in with {{provider}}"
        },
        sign_up: {
          email_label: "Email",
          password_label: "Password",
          button_label: "Sign up",
          loading_button_label: "Signing up ...",
          social_provider_text: "Sign up with {{provider}}"
        }
      }
    }}
  />
);

// src/components/auth/AuthToggle.tsx
interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => (
  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
    <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
    <button
      onClick={onToggle}
      className="text-cyan-600 hover:text-cyan-500 font-medium"
    >
      {isLogin ? "Sign up" : "Sign in"}
    </button>
  </div>
);

// src/components/auth/AuthFooter.tsx
export const AuthFooter = () => (
  <div className="text-center text-xs text-gray-500 mt-6">
    <div className="flex flex-col items-center justify-center space-y-2">
      <span>Protected by</span>
      <a 
        href="https://supabase.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
      >
        <img 
          src="/lovable-uploads/supabaselogo.png"
          alt="Supabase" 
          className="h-6"
        />
      </a>
    </div>
  </div>
);

// src/components/AuthModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { AuthToggle } from "./auth/AuthToggle";
import { AuthFooter } from "./auth/AuthFooter";

interface AuthModalProps {
  isOpen: boolean;
}

const AuthModal = ({ isOpen }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const redirectURL = 'https://preview--micaai.lovable.app/auth/v1/callback';

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <div className="space-y-6">
          <AuthHeader isLogin={isLogin} />
          <AuthForm isLogin={isLogin} redirectURL={redirectURL} />
          <AuthToggle 
            isLogin={isLogin} 
            onToggle={() => setIsLogin(!isLogin)} 
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
