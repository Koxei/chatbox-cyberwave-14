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
    const guestId = `guest_${Date.now()}`;
    const session: GuestSession = {
      guestId,
      createdAt: Date.now()
    };
    
    // Store guest session
    localStorage.setItem('guest_session', JSON.stringify(session));
    
    // Initialize guest chat
    const guestChat: GuestChat = {
      id: `chat_${guestId}`,
      title: 'Guest Chat',
      messages: [],
      isGuest: true,
      createdAt: Date.now()
    };
    localStorage.setItem('guest_chat', JSON.stringify(guestChat));
    
    setGuestId(guestId);
    setIsGuest(true);
    return guestId;
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
      const expiryTime = 36 * 60 * 60 * 1000; // 36 hours in milliseconds
      
      if (now - session.createdAt > expiryTime) {
        clearGuestSession();
        return false;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Check for existing session on mount
    const sessionStr = localStorage.getItem('guest_session');
    if (sessionStr) {
      const session: GuestSession = JSON.parse(sessionStr);
      if (checkSessionExpiry()) {
        setGuestId(session.guestId);
        setIsGuest(true);
      }
    }

    // Set up periodic check for session expiry
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