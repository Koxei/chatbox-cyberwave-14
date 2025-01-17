import { useState } from 'react';

export const useGuestSession = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  const initGuestSession = () => {
    const newGuestId = `guest_${Date.now()}`;
    setGuestId(newGuestId);
    setIsGuest(true);
    return newGuestId; // Return the ID so we can use it immediately
  };

  const clearGuestSession = () => {
    setGuestId(null);
    setIsGuest(false);
  };

  return {
    isGuest,
    guestId,
    initGuestSession,
    clearGuestSession
  };
};