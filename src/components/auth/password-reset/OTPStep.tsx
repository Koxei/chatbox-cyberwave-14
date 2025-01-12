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
  onSubmit: (e: React.FormEvent) => void;
}

export const OTPStep = ({
  otp,
  loading,
  onOTPChange,
  onSubmit
}: OTPStepProps) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-center">Check your Mail for reset code</h2>
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
        {loading ? "Verifying..." : "Confirm Code"}
      </Button>
    </form>
  </div>
);