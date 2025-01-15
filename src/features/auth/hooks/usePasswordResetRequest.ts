import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      if (error || !data.exists) {
        toast({
          title: "Error",
          description: "Email not found",
          variant: "destructive",
        });
        return false;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;

      toast({
        title: "Success",
        description: "Check your email for the reset code",
      });
      return true;
    } catch (err: any) {
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
    email,
    setEmail,
    loading,
    handleRequestCode
  };
};