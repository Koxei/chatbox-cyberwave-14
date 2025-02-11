import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN') {
        // Clear any guest session data when user signs in
        localStorage.removeItem('guest_session');
        localStorage.removeItem('guest_chat');
        
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setUserId(session?.user?.id || null);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setShowAuthModal(true);
        setUserId(null);
      }
    });

    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const guestSession = localStorage.getItem('guest_session');
      
      if (session) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        // Clear any guest session data on initial auth check
        localStorage.removeItem('guest_session');
        localStorage.removeItem('guest_chat');
      } else if (guestSession) {
        // Consider guest sessions as authenticated
        const parsedSession = JSON.parse(guestSession);
        setUserId(parsedSession.guestId);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  return {
    isAuthenticated,
    showAuthModal,
    setShowAuthModal,
    isResettingPassword,
    setIsResettingPassword,
    userId
  };
};