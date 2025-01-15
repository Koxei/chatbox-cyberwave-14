import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordUpdate = (onSuccess: () => void) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      onSuccess();
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
    newPassword,
    setNewPassword,
    loading,
    handleUpdatePassword
  };
};