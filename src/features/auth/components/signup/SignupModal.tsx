import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignUpForm } from "./SignUpForm";
import { AuthHeader } from "../shared/AuthHeader";
import { AuthFooter } from "../shared/AuthFooter";

interface SignupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onToggleMode: () => void;
}

export const SignupModal = ({
  isOpen,
  onClose,
  onToggleMode
}: SignupModalProps) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
        <DialogTitle className="sr-only">Sign Up</DialogTitle>
        <div className="space-y-6">
          <AuthHeader isLogin={false} showPasswordReset={false} />
          <SignUpForm onToggle={onToggleMode} />
          <AuthFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};