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

      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      navigate('/home', { replace: true });
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