import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PasswordResetState {
  email: string;
  otp: string;
  newPassword: string;
  loading: boolean;
  error: string | null;
}

// Validation functions
const validators = {
  email: (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return null;
  },
  otp: (otp: string) => {
    if (!otp) return "Verification code is required";
    if (!/^\d{6}$/.test(otp)) return "Code must be 6 digits";
    return null;
  },
  password: (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }
};

export const usePasswordReset = (onSuccess: () => void) => {
  const [state, setState] = useState<PasswordResetState>({
    email: "",
    otp: "",
    newPassword: "",
    loading: false,
    error: null
  });

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validators.email(state.email);
    if (emailError) {
      toast({
        title: "Validation Error",
        description: emailError,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: emailError }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if user exists
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email: state.email },
      });

      if (error) throw error;

      if (!data?.exists) {
        const errorMsg = "This email is not registered in our system.";
        setState(prev => ({ ...prev, error: errorMsg }));
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return false;
      }

      // Send reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        state.email
      );
      
      if (resetError) throw resetError;

      toast({
        title: "Success",
        description: "Check your email for the verification code.",
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send reset code";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP
    const otpError = validators.otp(state.otp);
    if (otpError) {
      toast({
        title: "Validation Error",
        description: otpError,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: otpError }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: state.email,
        token: state.otp,
        type: "recovery"
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Code verified successfully.",
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Invalid verification code";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordError = validators.password(state.newPassword);
    if (passwordError) {
      toast({
        title: "Validation Error",
        description: passwordError,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: passwordError }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.updateUser({
        password: state.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });
      onSuccess();
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update password";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    email: state.email,
    setEmail: (email: string) => setState(prev => ({ ...prev, email, error: null })),
    otp: state.otp,
    setOtp: (otp: string) => setState(prev => ({ ...prev, otp, error: null })),
    newPassword: state.newPassword,
    setNewPassword: (newPassword: string) => setState(prev => ({ ...prev, newPassword, error: null })),
    loading: state.loading,
    error: state.error,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword,
  };
};