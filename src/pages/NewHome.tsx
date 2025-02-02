import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isGuest, initGuestSession } = useGuestSession();

  // If not authenticated and not a guest, initialize guest session
  if (!isAuthenticated && !isGuest) {
    initGuestSession();
  }

  return null;
};

export default NewHome;