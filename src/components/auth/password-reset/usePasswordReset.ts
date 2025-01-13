// src/components/auth/password-reset/usePasswordReset.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordReset = (onSuccess: () => void) => {
  const [state, setState] = useState({
    email: "",
    otp: "",
    newPassword: "",
    loading: false
  });
  
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting password reset for email:', state.email);
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Calling check-user-exists function...');
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email: state.email }
      });
      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.exists) {
        console.log('User does not exist, stopping password reset');
        toast({
          title: "Error",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
        return false;
      }

      console.log('User exists, proceeding with password reset email');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(state.email);
      if (resetError) {
        console.error('Reset email error:', resetError);
        throw resetError;
      }
      
      console.log('Reset email sent successfully');
      toast({
        title: "Code sent!",
        description: "Check your email for the verification code.",
      });
      return true;
    } catch (err: any) {
      console.error('Password reset error:', err);
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
    console.log('Starting OTP verification for email:', state.email);
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log('Verifying OTP:', state.otp);
      const { data, error } = await supabase.auth.verifyOtp({
        email: state.email,
        token: state.otp,
        type: 'recovery'
      });
      
      if (error) {
        console.error('OTP verification error:', error);
        throw error;
      }
      
      console.log('OTP verified successfully');
      toast({
        title: "Code verified!",
        description: "You can now set your new password.",
      });
      return true;
    } catch (err: any) {
      console.error('OTP verification error:', err);
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
    console.log('Starting password update');
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log('Updating password...');
      const { data, error } = await supabase.auth.updateUser({
        password: state.newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        throw error;
      }
      
      console.log('Password updated successfully');
      toast({
        title: "Success!",
        description: "Your password has been updated.",
      });
      onSuccess();
      return true;
    } catch (err: any) {
      console.error('Password update error:', err);
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
    setEmail: (email: string) => {
      console.log('Email changed:', email);
      setState(prev => ({ ...prev, email }));
    },
    otp: state.otp,
    setOtp: (otp: string) => {
      console.log('OTP changed:', otp);
      setState(prev => ({ ...prev, otp }));
    },
    newPassword: state.newPassword,
    setNewPassword: (newPassword: string) => {
      console.log('New password changed');
      setState(prev => ({ ...prev, newPassword }));
    },
    loading: state.loading,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword
  };
};
