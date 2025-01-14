import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

interface SignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const SignUpForm = ({
  onSuccess,
  onBack
}: SignUpFormProps) => {
  const { loading, handleSignUp } = useSignUp(onSuccess);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return;
    }

    await handleSignUp(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="Choose a password"
          required
          className="w-full"
          minLength={6}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full"
      >
        Back to Login
      </Button>
    </form>
  );
};