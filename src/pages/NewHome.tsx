import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import { useEffect } from "react";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isGuest } = useGuestSession();

  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);

  return null;
};

export default NewHome;