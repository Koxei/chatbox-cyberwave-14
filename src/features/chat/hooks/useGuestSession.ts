import { useState, useEffect } from 'react';

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

  const initGuestSession = () => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('sb-pqzhnpgwhcuxaduvxans-auth-token');
    if (authToken) {
      clearGuestSession();
      return;
    }

    const existingSessionStr = localStorage.getItem('guest_session');
    if (existingSessionStr) {
      const existingGuestSession = JSON.parse(existingSessionStr);
      setGuestId(existingGuestSession.guestId);
      setIsGuest(true);
      return;
    }

    const newGuestId = `guest_${Date.now()}`;
    const newGuestSession: GuestSession = {
      guestId: newGuestId,
      createdAt: Date.now()
    };
    
    localStorage.setItem('guest_session', JSON.stringify(newGuestSession));
    
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
      const guestSession: GuestSession = JSON.parse(sessionStr);
      const now = Date.now();
      const expiryTime = 36 * 60 * 60 * 1000; // 36 hours
      
      if (now - guestSession.createdAt > expiryTime) {
        clearGuestSession();
        return false;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('sb-pqzhnpgwhcuxaduvxans-auth-token');
    if (authToken) {
      clearGuestSession();
      return;
    }

    const sessionStr = localStorage.getItem('guest_session');
    if (sessionStr) {
      const guestSession: GuestSession = JSON.parse(sessionStr);
      if (checkSessionExpiry()) {
        setGuestId(guestSession.guestId);
        setIsGuest(true);
      }
    }

    const interval = setInterval(checkSessionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    isGuest,
    guestId,
    initGuestSession,
    clearGuestSession
  };
};