import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

interface AuthModalProps {
  isOpen: boolean;
}

const AuthModal = ({ isOpen }: AuthModalProps) => {
  const redirectURL = 'https://preview--micaai.lovable.app/auth/v1/callback';

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px]">
        <Auth
          supabaseClient={supabase}
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
          theme="light"
          redirectTo={redirectURL}
          showLinks={true}
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
                link_text: "Already have an account? Sign in"
              },
              sign_up: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign up",
                link_text: "Don't have an account? Sign up"
              }
            },
          }}
          queryParams={{
            access_type: 'offline',
            prompt: 'consent',
            redirect_uri: redirectURL
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
