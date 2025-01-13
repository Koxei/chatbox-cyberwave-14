import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartClick = async () => {
    console.log('Start button clicked');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Session check result:', { session, error });
      
      if (error) {
        console.error('Session check error:', error);
        throw error;
      }

      // Check for active session or guest session
      const hasGuestSession = localStorage.getItem('guest_session');
      console.log('Guest session check:', { hasGuestSession });

      if (session || hasGuestSession) {
        console.log('Active session found, navigating to home');
        navigate('/home');
      } else {
        console.log('No active session, showing auth modal');
        navigate('/home', { 
          state: { showAuth: true },
          replace: true 
        });
      }
    } catch (error: any) {
      console.error('Session check failed:', error);
      toast({
        title: "Error",
        description: "Failed to check session status. Please try again.",
        variant: "destructive",
      });
      // Redirect to auth as fallback
      navigate('/home', { 
        state: { showAuth: true },
        replace: true 
      });
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