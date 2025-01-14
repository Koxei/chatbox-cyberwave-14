// src/features/auth/hooks/useSignUp.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignUp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First check if user exists using the same edge function
      const { data, error } = await supabase.functions.invoke("check-user-exists", {
        body: { email }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
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
        return false;
      }

      // If user doesn't exist, proceed with signup
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Account created successfully",
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
    loading,
    handleSignUp
  };
};

// src/features/auth/components/auth/AuthForm.tsx
// Add to your imports
import { useSignUp } from "@/features/auth/hooks/useSignUp";

export const AuthForm = ({ /* existing props */ }) => {
  const navigate = useNavigate();
  const { loading, handleSignUp } = useSignUp(() => {
    navigate('/home');
  });

  // Add this function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!isLogin) {
      await handleSignUp(email, password);
    }
  };

  // In your return statement, replace <Auth> with:
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
        </button>
      </form>
      
      {/* Rest of your component remains the same */}
    </div>
  );
};
