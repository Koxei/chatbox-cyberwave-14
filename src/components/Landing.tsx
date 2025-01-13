import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { supabase } from "@/integrations/supabase/client";

import { useToast } from "@/hooks/use-toast";

const Landing = () => {

const navigate = useNavigate();

const { toast } = useToast();

const handleStartClick = async () => {

try {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  // Check for active session or guest session
  const hasGuestSession = localStorage.getItem('guest_session');
  if (session || hasGuestSession) {
    navigate('/home');
  } else {
    // Show auth modal by setting showAuth to true in navigation state
    navigate('/home', { state: { showAuth: true } });
  }
} catch (error: any) {
  console.error('Session check failed:', error);
  toast({
    title: "Error",
    description: "Failed to check session status. Please try again.",
    variant: "destructive",
  });
  // Redirect to auth as fallback
  navigate('/home', { state: { showAuth: true } });
}
};

return (

<div className="h-screen w-screen flex items-center justify-center">
  <Button 
    onClick={handleStartClick}
    className="px-8 py-6 text-lg"
  >
    Start
  </Button>
</div>
);

};

export default Landing;