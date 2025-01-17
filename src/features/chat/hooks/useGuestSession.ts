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
  const [isInitializing, setIsInitializing] = useState(false);

  const initGuestSession = async () => {
<<<<<<< HEAD
    if (isInitializing) return false;
    
    try {
      setIsInitializing(true);
      console.log('Initializing guest session...');
      const existingSession = localStorage.getItem('guest_session');
      
      if (existingSession) {
        const session = JSON.parse(existingSession);
        await Promise.resolve(); // Ensure state updates are batched
        setGuestId(session.guestId);
        setIsGuest(true);
        return true;
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
      
      await Promise.resolve(); // Ensure state updates are batched
      setGuestId(newGuestId);
      setIsGuest(true);
      return true;
    } catch (error) {
      console.error('Error initializing guest session:', error);
      return false;
    } finally {
      setIsInitializing(false);
    }
=======
    console.log('Initializing guest session...');
    const existingSession = localStorage.getItem('guest_session');
    
    if (existingSession) {
      const session = JSON.parse(existingSession);
      await Promise.resolve(); // Ensure state updates are batched
      setGuestId(session.guestId);
      setIsGuest(true);
      return true;
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
    
    await Promise.resolve(); // Ensure state updates are batched
    setGuestId(newGuestId);
    setIsGuest(true);
    return true;
>>>>>>> 012d40434e1e4c68364b05d9b8bd333ce3897bdc
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
