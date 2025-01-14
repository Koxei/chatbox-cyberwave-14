import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Error code to user-friendly message mapping
const errorMessages = {
  'duplicate_email': 'Email is already registered. Please use a different one.',
  'invalid_credentials': 'Invalid credentials provided. Please check your email and password.',
  'default': 'An unexpected error occurred. Please try again later.',
};

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
        options: {
          emailRedirectTo: "your_redirect_url_here",
        }
      });

      // Handle the error by sanitizing the error object
      if (signUpError) {
        // Map to a user-friendly message
        let errorMessage = "An unexpected error occurred. Please try again later.";
        
        if (signUpError.code === 'duplicate_email') {
          errorMessage = "Email is already registered. Please use a different one.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        // Prevent the admin key or sensitive data from being logged
        console.error("SignUp Error:", signUpError.message);

        return false;
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      });
      onSuccess();
      return true;

    } catch (err: any) {
      // Log only non-sensitive errors
      console.error("Unexpected Error:", err.message);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
