// src/components/auth/password-reset/usePasswordReset.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordReset = (onSuccess: () => void) => {
  const [state, setState] = useState({
    email: "",
    otp: "",
    newPassword: "",
    loading: false,
  });

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Call Edge Function to check if user exists
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email: state.email },
      });

      if (error || !data?.exists) {
        toast({
          title: "Error",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
        return false;
      }

      // If user exists, proceed with password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(state.email);
      if (resetError) throw resetError;

      toast({
        title: "Code sent!",
        description: "Check your email for the verification code.",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: state.email,
        token: state.otp,
        type: "recovery",
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
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: state.newPassword,
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
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    email: state.email,
    setEmail: (email: string) => {
      setState((prev) => ({ ...prev, email }));
    },
    otp: state.otp,
    setOtp: (otp: string) => {
      setState((prev) => ({ ...prev, otp }));
    },
    newPassword: state.newPassword,
    setNewPassword: (newPassword: string) => {
      setState((prev) => ({ ...prev, newPassword }));
    },
    loading: state.loading,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword,
  };
};



/*import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordReset = (onSuccess: () => void) => {
  const [state, setState] = useState({
    email: "",
    otp: "",
    newPassword: "",
    loading: false
  });

  // Remove console.log for hook state
  
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // First check if user exists - removed console.log
      const { data: { users }, error: adminError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        query: state.email
      });

      if (adminError || !users || users.length === 0) {
        toast({
          title: "Error",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
        return false;
      }

      // If user exists, proceed with password reset
      const { error } = await supabase.auth.resetPasswordForEmail(state.email);
      if (error) throw error;
      
      // Success toast only
      toast({
        title: "Code sent!",
        description: "Check your email for the verification code.",
      });
      return true;
    } catch (err: any) {
      // Remove error logging
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
      const { data, error } = await supabase.auth.verifyOtp({
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
      const { data, error } = await supabase.auth.updateUser({
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

  // Remove useEffect for state logging

  return {
    email: state.email,
    setEmail: (email: string) => {
      setState(prev => ({ ...prev, email }));
    },
    otp: state.otp,
    setOtp: (otp: string) => {
      setState(prev => ({ ...prev, otp }));
    },
    newPassword: state.newPassword,
    setNewPassword: (newPassword: string) => {
      setState(prev => ({ ...prev, newPassword }));
    },
    loading: state.loading,
    handleRequestCode,
    handleVerifyOTP,
    handleUpdatePassword
  };
};*/



