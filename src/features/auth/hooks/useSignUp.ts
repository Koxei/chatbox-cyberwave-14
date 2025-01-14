import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    console.log('Starting signup process');
    setLoading(true);

    try {
      // 1. Check if email exists first, just like in password reset
      console.log('Checking if email exists');
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      // 2. If check fails or user exists, return early before any auth calls
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

      // 3. Only if email is available, proceed with signup
      console.log('Email available, proceeding with signup');
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
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