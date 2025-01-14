import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    console.log('Starting signup process');
    setLoading(true);

    try {
      // 1. Validate email format first
      if (!isValidEmail(email)) {
        console.log('Invalid email format');
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return false;
      }

      // 2. Check if email exists using Edge Function
      console.log('Checking if email exists');
      const { data: checkData, error: checkError } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      if (checkError) {
        console.log('Error checking email:', checkError.message);
        toast({
          title: "Error",
          description: "Unable to verify email availability",
          variant: "destructive",
        });
        return false;
      }

      if (checkData?.exists) {
        console.log('Email already registered');
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return false;
      }

      // 3. If email is available, proceed with signup
      console.log('Email available, proceeding with signup');
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            email // Store email in user metadata
          }
        }
      });

      if (signUpError) {
        // Generic error message to avoid exposing sensitive info
        console.log('Signup error occurred');
        toast({
          title: "Error",
          description: "Unable to complete signup. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Signup successful');
      toast({
        title: "Success",
        description: "Account created successfully. Please check your email.",
      });
      onSuccess();
      return true;

    } catch (err) {
      // Generic error handling to avoid exposing sensitive info
      console.error('Unexpected error during signup');
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