import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPStepProps {
  otp: string;
  loading: boolean;
  onOTPChange: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const OTPStep = ({
  otp,
  loading,
  onOTPChange,
  onSubmit
}: OTPStepProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="flex justify-center">
      <InputOTP
        value={otp}
        onChange={onOTPChange}
        maxLength={6}
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, idx) => (
              <InputOTPSlot key={idx} {...slot} index={idx} />
            ))}
          </InputOTPGroup>
        )}
      />
    </div>
    <Button
      type="submit"
      className="w-full"
      disabled={loading || otp.length !== 6}
    >
      {loading ? "Verifying..." : "Verify Code"}
    </Button>
  </form>
);