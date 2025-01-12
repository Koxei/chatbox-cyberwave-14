import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePasswordReset = (onSuccess: () => void) => {
  const [state, setState] = useState({
    email: "",
    otp: "",
    newPassword: "",
    loading: false,
    error: "" // New error state
  });

  console.log('usePasswordReset hook state:', state);

  const handleRequestCode = async (e: React.FormEvent) => {
    console.log('handleRequestCode called');
    e.preventDefault();
    setState(prev => ({
      ...prev,
      loading: true,
      error: "" // Clear previous errors
    }));
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(state.email);
      
      if (error) {
        if (error.message.includes('User not found')) {
          setState(prev => ({
            ...prev,
            error: "This email is not registered in our system"
          }));
          return false;
        }
        throw error;
      }
      
      console.log('Reset code sent successfully');
      toast({
        title: "Code sent!",
        description: "Check your email for the verification code.",
      });
      return true;
    } catch (err: any) {
      console.error('Error in handleRequestCode:', err);
      setState(prev => ({
        ...prev,
        error: err.message
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    console.log('handleVerifyOTP called with OTP:', state.otp);
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log('Calling verifyOtp');
      const { data, error } = await supabase.auth.verifyOtp({
        email: state.email,
        token: state.otp,
        type: 'recovery'
      });
      console.log('verifyOtp response:', { data, error });
      if (error) throw error;
      console.log('OTP verified successfully');
      toast({
        title: "Code verified!",
        description: "You can now set your new password.",
      });
      return true;
    } catch (err: any) {
      console.error('Error in handleVerifyOTP:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      console.log('Setting loading state to false');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    console.log('handleUpdatePassword called');
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log('Calling updateUser with new password');
      const { data, error } = await supabase.auth.updateUser({
        password: state.newPassword
      });
      console.log('updateUser response:', { data, error });
      if (error) throw error;
      console.log('Password updated successfully');
      toast({
        title: "Success!",
        description: "Your password has been updated.",
      });
      onSuccess();
      return true;
    } catch (err: any) {
      console.error('Error in handleUpdatePassword:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      console.log('Setting loading state to false');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    console.log('Password Reset State Updated:', state);
  }, [state]);

  return {
    email: state.email,
    error: state.error, // Expose error state
    setEmail: (email: string) => {
      console.log('Setting email:', email);
      setState(prev => ({ ...prev, email, error: "" })); // Clear error when email changes
    },
    otp: state.otp,
    setOtp: (otp: string) => {
      console.log('Setting OTP:', otp);
      setState(prev => ({ ...prev, otp }));
    },
    newPassword: state.newPassword,
    setNewPassword: (newPassword: string) => {
      console.log('Setting new password');
      setState(prev => ({ ...prev, newPassword }));
    },
    loading: state.loading,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword
  };
};