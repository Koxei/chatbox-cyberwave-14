import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

interface AuthModalProps {
  isOpen: boolean;
}

const AuthModal = ({ isOpen }: AuthModalProps) => {
  // Explicitly set the full callback URL
  const redirectURL = 'https://preview--micaai.lovable.app/auth/v1/callback';

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px]">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="light"
          redirectTo={redirectURL}
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
              },
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
