import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Auth } from "@supabase/auth-ui-react";

import { supabase } from "@/integrations/supabase/client";

import { ThemeSupa } from "@supabase/auth-ui-shared";

interface AuthModalProps {

isOpen: boolean;

}

const AuthModal = ({ isOpen }: AuthModalProps) => {

const redirectURL = new URL('/auth/callback', window.location.origin).toString();

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
        prompt: 'consent'
      }}
    />
  </DialogContent>
</Dialog>
);

};

export default AuthModal;

