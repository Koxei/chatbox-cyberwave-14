import { Button } from "@/components/ui/button";
interface LandingProps {
  onStartClick: () => void;
}
const Landing = ({ onStartClick }: LandingProps) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button 
        onClick={onStartClick}
        className="px-8 py-6 text-lg"
      >
        Start
      </Button>
    </div>
  );
};
export default Landing;