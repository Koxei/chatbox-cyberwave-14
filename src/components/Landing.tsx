import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useEffect, useState, useRef } from "react"; // Added useRef

import { supabase } from "@/integrations/supabase/client";

interface LandingProps {

onStartClick?: () => void;

}

const Landing = ({ onStartClick }: LandingProps) => {

const navigate = useNavigate();

const [isChecking, setIsChecking] = useState(true);

// Added state for video visibility

const [isPlaying, setIsPlaying] = useState(false);

// Added video ref for controlling playback

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

if (isChecking) return null;

const handleClick = () => {

if (onStartClick) {
  onStartClick();
} else {
  // Play video and set up transition
  setIsPlaying(true);
  if (videoRef.current) {
    videoRef.current.play();
    // Wait for video duration (5 seconds) before navigating
    setTimeout(() => {
      navigate("/login");
    }, 5000);
  }
}
};

return (

<div className="h-screen w-screen flex items-center justify-center bg-black">
  {/* Video element with fade-in animation when playing */}
  <video
    ref={videoRef}
    className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-500 ${
      isPlaying ? 'opacity-100' : 'opacity-0'
    }`}
    src="/lovable-uploads/vid.mp4"
    muted
    playsInline
  />
  {/* Button with fade-out animation when video starts */}
  <Button 
    onClick={handleClick}
    className={`px-8 py-6 text-lg transition-opacity duration-500 ${
      isPlaying ? 'opacity-0' : 'opacity-100'
    }`}
  >
    Start
  </Button>
</div>
);

};

export default Landing;