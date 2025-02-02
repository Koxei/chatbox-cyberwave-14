import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LandingProps {
  onStartClick?: () => void;
}

const Landing = ({ onStartClick }: LandingProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleClick = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play();
        setTimeout(() => {
          navigate("/login");
        }, 5000); // 5 seconds delay
      }
    }
  };

  if (isChecking) return null;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#000000] relative overflow-hidden">
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        muted
      >
        <source src="/lovable-uploads/vid.mp4" type="video/mp4" />
      </video>
      
      <Button 
        onClick={handleClick}
        className={`px-8 py-6 text-lg z-10 transition-opacity duration-500 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Start
      </Button>
    </div>
  );
};

export default Landing;