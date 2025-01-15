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
      // Start navigation earlier to improve perceived performance
      const navigationPromise = navigate('/home', { replace: true });

      // Run user check and signup in parallel
      const [userCheckResult, signUpResult] = await Promise.all([
        supabase.functions.invoke("check-user-exists", {
          body: { email }
        }),
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
          }
        })
      ]);

      const { data, error } = userCheckResult;
      const { error: signUpError } = signUpResult;

      if (error || data?.exists) {
        // If there's an error, prevent navigation
        window.history.pushState(null, '', window.location.pathname);
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return { error: new Error("Email already registered") };
      }

      if (signUpError) {
        // If there's an error, prevent navigation
        window.history.pushState(null, '', window.location.pathname);
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return { error: signUpError };
      }

      // Wait for navigation to complete
      await navigationPromise;

      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      onSuccess();
      return { error: null };

    } catch (err: any) {
      console.error("Unexpected Error:", err.message);
      // If there's an error, prevent navigation
      window.history.pushState(null, '', window.location.pathname);
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
