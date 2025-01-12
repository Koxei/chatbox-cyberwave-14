import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
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
          <AuthForm 
            isLogin={isLogin} 
            redirectURL={redirectURL}
            onToggle={() => setIsLogin(!isLogin)}
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;