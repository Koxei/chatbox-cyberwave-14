import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LandingProps {
  onStartClick?: () => void;
}

const Landing = ({ onStartClick }: LandingProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button 
        onClick={handleClick}
        className="px-8 py-6 text-lg"
      >
        Start
      </Button>
    </div>
  );
};

export default Landing;