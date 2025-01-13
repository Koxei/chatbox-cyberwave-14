import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button 
        onClick={() => navigate("/login")}
        className="px-8 py-6 text-lg"
      >
        Start
      </Button>
    </div>
  );
};

export default Landing;