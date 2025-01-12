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

}: OTPStepProps) => {

console.log('OTPStep rendering with otp:', otp);

// Only initialize OTP input if we're on this step

const [isReady, setIsReady] = useState(false);

useEffect(() => {

// Small delay to ensure proper mounting
const timer = setTimeout(() => setIsReady(true), 100);
return () => clearTimeout(timer);
}, []);

if (!isReady) {

return <div>Loading verification input...</div>;
}

return (

<div className="space-y-4">
  <h2 className="text-xl font-semibold text-center">Check your Mail for reset code</h2>
  <form onSubmit={(e) => {
    e.preventDefault();
    console.log('OTP form submitted with code:', otp);
    onSubmit(e);
  }} className="space-y-4">
    <div className="flex justify-center">
      {/* Only render InputOTP when ready */}
      {isReady && (
        <InputOTP
          value={otp}
          onChange={(value) => {
            console.log('OTP changed to:', value);
            onOTPChange(value);
          }}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots && slots.map((slot, idx) => (
                <InputOTPSlot key={idx} {...slot} index={idx} />
              ))}
            </InputOTPGroup>
          )}
        />
      )}
    </div>
    <Button
      type="submit"
      className="w-full"
      disabled={loading || !otp || otp.length !== 6}
    >
      {loading ? "Verifying..." : "Confirm Code"}
    </Button>
  </form>
</div>
);

};