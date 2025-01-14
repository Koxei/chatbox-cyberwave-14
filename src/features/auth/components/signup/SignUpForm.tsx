import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleSignUp } = useSignUp(onSuccess);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Handling signup submit with:', email);
    await handleSignUp(email, password);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
    </div>
  );
};