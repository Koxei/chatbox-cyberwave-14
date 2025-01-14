// src/features/auth/hooks/useSignUp.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    console.log('Starting signup process for email:', email);
    setLoading(true);
    try {
      // First validate email exists using edge function
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      // Mirror password reset flow error handling
      if (error || data?.exists) {
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return false;
      }

      // Only proceed with signup if email doesn't exist
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success",
        description: "Account created successfully",
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
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp
  };
};
