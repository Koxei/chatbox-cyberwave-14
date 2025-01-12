import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

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

<form onSubmit={onSubmit} className="space-y-4">
<h2 className="text-xl font-semibold text-center">
  Check your Mail for reset code
</h2>
<div>
  <Input
    type="text"
    placeholder="Enter 6-digit code"
    value={otp}
    onChange={(e) => {
      // Only allow numbers and limit to 6 digits
      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
      onOTPChange(value);
    }}
    required
    className="w-full text-center tracking-widest font-mono text-lg"
    maxLength={6}
    pattern="\d{6}"
    inputMode="numeric"
  />
</div>
<Button
  type="submit"
  className="w-full"
  disabled={loading || !otp || otp.length !== 6}
>
  {loading ? "Verifying..." : "Confirm Code"}
</Button>
</form>
);