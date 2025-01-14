import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleEmailCheck = async (email: string) => {
    console.log('Checking email existence:', email);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      console.log('Email check response:', { data, error });

      if (error) {
        console.error('Email check error:', error);
        toast({
          title: "Error",
          description: error.message || "Unable to verify email",
          variant: "destructive",
        });
        return false;
      }

      if (data?.exists) {
        console.log('Email already exists');
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return false;
      }

      console.log('Email available for registration');
      toast({
        title: "Success",
        description: "Email available, please choose a password",
      });
      return true;

    } catch (err: any) {
      console.error('Unexpected error during email check:', err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while checking email",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    console.log('Starting signup process for email:', email);
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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
    handleEmailCheck,
    handleSignUp
  };
};