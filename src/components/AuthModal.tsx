import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
interface AuthModalProps {
isOpen: boolean;
}
const AuthModal = ({ isOpen }: AuthModalProps) => {
return (
<Dialog open={isOpen} modal>
  <DialogContent className="sm:max-w-[425px]">
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
      theme="light"
      redirectTo="https://preview--micaai.lovable.app"
      showLinks={false}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Password",
          },
        },
      }}
    />
  </DialogContent>
</Dialog>
);
};
export default AuthModal;