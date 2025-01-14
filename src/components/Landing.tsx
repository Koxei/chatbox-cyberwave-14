import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LandingProps {
  onStartClick?: () => void;
}

const Landing = ({ onStartClick }: LandingProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/home', { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (session) {
        navigate('/home', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isChecking) return null;

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