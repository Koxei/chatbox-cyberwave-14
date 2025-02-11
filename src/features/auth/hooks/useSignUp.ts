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
      // Prioritize user redirection over toast display
      let userExists = false;

      // Check if user exists (optional optimization: debounce or cache requests)
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email },
      });

      if (error) {
        console.error("Error checking user existence:", error);
        toast({
          title: "Error",
          description: "Could not verify email. Please try again.",
          variant: "destructive",
        });
        return { error };
      }

      if (data?.exists) {
        userExists = true;
        toast({
          title: "Error",
          description: "Email already registered",
          variant: "destructive",
        });
        return { error: new Error("Email already registered") };
      }

      if (!userExists) {
        // Proceed with user signup
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
          },
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
          return { error: signUpError };
        }

        // Navigate to home immediately
        navigate("/home", { replace: true });

        // Display success toast after navigation
        setTimeout(() => {
          toast({
            title: "Success",
            description: "Account created successfully",
          });
        }, 100);

        onSuccess();
        return { error: null };
      }
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
    handleSignUp,
  };
};
