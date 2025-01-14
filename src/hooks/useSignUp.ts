// src/features/auth/hooks/useSignUp.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 1. Check existence first, just like password reset
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      // 2. Return early if check fails, before any auth call
      if (error || data?.exists) {
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return false;
      }

      // 3. Only if email is available, proceed with signup
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
