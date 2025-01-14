// src/components/Landing.tsx
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
        const guestSession = localStorage.getItem('guest_session');
        
        // Only redirect if there's a valid session
        if (session || (guestSession && JSON.parse(guestSession).guestId)) {
          navigate('/home', { replace: true });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in Landing:', event);
      if (session) {
        navigate('/home', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading state while checking
  if (isChecking) {
    return null;
  }

  const handleClick = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      navigate("/login");
    }
  };

  // Always render the button if not authenticated
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
