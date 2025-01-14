import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {

const [loading, setLoading] = useState(false);

const handleSignUp = async (email: string, password: string) => {

console.log('Starting signup process for email:', email);
setLoading(true);
try {
  // First check if user exists using edge function
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
  // Only proceed with signup if email doesn't exist
  console.log('Email available, proceeding with signup');
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
handleSignUp
};

};