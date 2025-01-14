// src/features/auth/hooks/useSignUp.ts

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

// Error mapping utility
const getSignUpErrorMessage = (error: AuthError): string => {
  // Log the full error for debugging (only visible in console)
  console.error('Signup error:', {
    code: error.status,
    name: error.name,
    message: 'Authentication error occurred'  // Sanitized message for logging
  });

  // Map specific error codes to user-friendly messages
  switch (error.status) {
    case 422:
      return "This email is already registered. Please try signing in instead.";
    case 400:
      return "Invalid email or password format.";
    case 429:
      return "Too many attempts. Please try again later.";
    default:
      return "An error occurred during signup. Please try again.";
  }
};

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

      // 2. Check if email exists
      console.log('Checking if email exists');
      const { data, error } = await supabase.functions.invoke("check-signup-email", {
        body: { email }
      });

      if (error) {
        console.error('Error checking email:', error);
        toast({
          title: "Error",
          description: "Unable to verify email",
          variant: "destructive",
        });
        return false;
      }

      if (data?.exists) {
        console.log('Email already registered');
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return false;
      }

      // 3. Proceed with signup
      console.log('Email available, proceeding with signup');
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
        }
      });

      if (signUpError) {
        // Use our error mapping utility instead of exposing raw error
        const userMessage = getSignUpErrorMessage(signUpError);
        toast({
          title: "Error",
          description: userMessage,
          variant: "destructive",
        });
        return false;
      }

      console.log('Signup successful');
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      onSuccess();
      return true;

    } catch (err: any) {
      // Handle unexpected errors
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
