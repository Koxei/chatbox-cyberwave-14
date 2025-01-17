import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GuestSession {
  guestId: string;
  createdAt: number;
}

interface GuestChat {
  id: string;
  title: string;
  messages: any[];
  isGuest: boolean;
  createdAt: number;
}

export const useGuestSession = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const navigate = useNavigate();

  const initGuestSession = () => {
    console.log('Initializing guest session...');
    const existingSession = localStorage.getItem('guest_session');
    if (existingSession) {
      const session = JSON.parse(existingSession);
      setGuestId(session.guestId);
      setIsGuest(true);
      navigate('/home', { replace: true });
      return;
    }

    const newGuestId = `guest_${Date.now()}`;
    const session: GuestSession = {
      guestId: newGuestId,
      createdAt: Date.now()
    };
    
    localStorage.setItem('guest_session', JSON.stringify(session));
    
    const guestChat: GuestChat = {
      id: `chat_${newGuestId}`,
      title: 'Guest Chat',
      messages: [],
      isGuest: true,
      createdAt: Date.now()
    };
    localStorage.setItem('guest_chat', JSON.stringify(guestChat));
    
    setGuestId(newGuestId);
    setIsGuest(true);
    navigate('/home', { replace: true });
  };

  const clearGuestSession = () => {
    localStorage.removeItem('guest_session');
    localStorage.removeItem('guest_chat');
    setGuestId(null);
    setIsGuest(false);
  };

  const checkSessionExpiry = () => {
    const sessionStr = localStorage.getItem('guest_session');
    if (sessionStr) {
      const session: GuestSession = JSON.parse(sessionStr);
      const now = Date.now();
      const expiryTime = 36 * 60 * 60 * 1000;
      
      if (now - session.createdAt > expiryTime) {
        clearGuestSession();
        return false;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    const sessionStr = localStorage.getItem('guest_session');
    if (sessionStr) {
      const session: GuestSession = JSON.parse(sessionStr);
      if (checkSessionExpiry()) {
        setGuestId(session.guestId);
        setIsGuest(true);
      }
    }

    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    isGuest,
    guestId,
    initGuestSession,
    clearGuestSession
  };
};