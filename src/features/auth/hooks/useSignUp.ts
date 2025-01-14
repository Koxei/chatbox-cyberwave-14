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

      // 2. Check if email exists
      console.log('Checking if email exists');
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
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

      // 3. Proceed with signup using consistent redirectTo URL
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
        console.error('Signup error:', signUpError);
        toast({
          title: "Error",
          description: signUpError.message,
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
      console.error('Unexpected error during signup:', err);
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