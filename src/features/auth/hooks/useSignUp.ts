// src/features/auth/hooks/useSignUp.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First check if user exists
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      if (error || data?.exists) {
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return { error: new Error("Email already registered") };
      }

      // If user doesn't exist, proceed with signup
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
        }
      });

      if (signUpError) {
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return { error: signUpError };
      }

      // On success, navigate immediately before other operations
      navigate('/home', { replace: true });
      
      // Show success toast after navigation starts
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }, 100);
      
      onSuccess();
      return { error: null };

    } catch (err: any) {
      console.error("Unexpected Error:", err.message);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp
  };
};
