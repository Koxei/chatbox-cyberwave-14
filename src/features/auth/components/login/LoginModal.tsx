import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { AuthHeader } from "../shared/AuthHeader";
import { AuthFooter } from "../shared/AuthFooter";

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onGuestLogin?: () => void;
  onPasswordResetStart?: () => void;
}

export const LoginModal = ({
  isOpen,
  onClose,
  onGuestLogin,
  onPasswordResetStart
}: LoginModalProps) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="space-y-6">
          <AuthHeader isLogin={true} showPasswordReset={false} />
          <LoginForm
            onGuestLogin={onGuestLogin}
            onPasswordResetStart={onPasswordResetStart}
          />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};