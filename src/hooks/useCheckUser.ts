import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("check-user-exists", {
      body: { email }
    });

    if (error) {
      toast({
        title: "Error",
        description: "Unable to verify email",
        variant: "destructive",
      });
      return false;
    }

    if (data.exists) {
      toast({
        title: "Error",
        description: "Email already registered",
        variant: "destructive",
      });
      return true;
    }

    return false;
  } catch (err) {
    toast({
      title: "Error",
      description: "An error occurred while checking email",
      variant: "destructive",
    });
    return false;
  }
};