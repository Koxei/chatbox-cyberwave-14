import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
}

const AuthModal = ({ isOpen }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const redirectURL = 'https://preview--micaai.lovable.app/auth/v1/callback';

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <div className="space-y-6">
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
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign in",
                  loading_button_label: "Signing in ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in"
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                  social_provider_text: "Sign up with {{provider}}",
                  link_text: "Don't have an account? Sign up"
                }
              }
            }}
          />

          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-600 hover:text-cyan-500 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

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
                  src="https://raw.githubusercontent.com/supabase/supabase/master/packages/common/assets/images/supabase-logo.svg" 
                  alt="Supabase" 
                  className="h-6"
                />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
