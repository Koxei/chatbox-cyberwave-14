import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

interface SignupFormProps {
  onToggle: () => void;
}

export const SignupForm = ({ onToggle }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleSignUp } = useSignUp(() => {});

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
          className="w-full bg-[#D3E4FD] hover:bg-[#C3D4F5] active:scale-[0.98] transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onToggle}
          className="w-full"
        >
          Back to Login
        </Button>
      </form>
    </div>
  );
};