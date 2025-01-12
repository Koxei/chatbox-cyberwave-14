import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { useToast } from "@/hooks/use-toast";

export const usePasswordReset = (onSuccess: () => void) => {

const [state, setState] = useState({

email: "",
otp: "",
newPassword: "",
loading: false
});

const { toast } = useToast();

const handleRequestCode = async (e: React.FormEvent) => {

e.preventDefault();
setState(prev => ({ ...prev, loading: true }));
try {
  const { error } = await supabase.auth.resetPasswordForEmail(state.email);
  if (error) {
    if (error.message.includes('User not found')) {
      toast({
        title: "Error",
        description: "This email is not registered in our system.",
        variant: "destructive",
      });
      return false;
    }
    throw error;
  }
  toast({
    title: "Code sent!",
    description: "Check your email for the verification code.",
  });
  return true;
} catch (err: any) {
  toast({
    title: "Error",
    description: err.message,
    variant: "destructive",
  });
  return false;
} finally {
  setState(prev => ({ ...prev, loading: false }));
}
};

const handleVerifyOTP = async (e: React.FormEvent) => {

e.preventDefault();
setState(prev => ({ ...prev, loading: true }));
try {
  const { error } = await supabase.auth.verifyOtp({
    email: state.email,
    token: state.otp,
    type: 'recovery'
  });
  if (error) throw error;
  toast({
    title: "Code verified!",
    description: "You can now set your new password.",
  });
  return true;
} catch (err: any) {
  toast({
    title: "Error",
    description: err.message,
    variant: "destructive",
  });
  return false;
} finally {
  setState(prev => ({ ...prev, loading: false }));
}
};

const handleUpdatePassword = async (e: React.FormEvent) => {

e.preventDefault();
setState(prev => ({ ...prev, loading: true }));
try {
  const { error } = await supabase.auth.updateUser({
    password: state.newPassword
  });
  if (error) throw error;
  toast({
    title: "Success!",
    description: "Your password has been updated.",
  });
  onSuccess();
  return true;
} catch (err: any) {
  toast({
    title: "Error",
    description: err.message,
    variant: "destructive",
  });
  return false;
} finally {
  setState(prev => ({ ...prev, loading: false }));
}
};

return {

email: state.email,
setEmail: (email: string) => setState(prev => ({ ...prev, email })),
otp: state.otp,
setOtp: (otp: string) => setState(prev => ({ ...prev, otp })),
newPassword: state.newPassword,
setNewPassword: (newPassword: string) => setState(prev => ({ ...prev, newPassword })),
loading: state.loading,
handleRequestCode,
handleVerifyOTP,
handleUpdatePassword
};

};