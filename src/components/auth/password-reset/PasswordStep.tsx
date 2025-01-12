import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordStepProps {
  password: string;
  loading: boolean;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordStep = ({
  password,
  loading,
  onPasswordChange,
  onSubmit
}: PasswordStepProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <Input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
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
      {loading ? "Updating..." : "Confirm"}
    </Button>
  </form>
);