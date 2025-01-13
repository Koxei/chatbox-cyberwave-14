import { useState, useEffect } from 'react';

interface GuestChat {

id: string;

title: string;

messages: any[];

isGuest: boolean;

createdAt: number;

}

export const useGuestSession = () => {

const [isGuest, setIsGuest] = useState(false);

const [guestId, setGuestId] = useState<string | null>(null);

const [guestChat, setGuestChat] = useState<GuestChat | null>(null);

// Initialize guest session

const initGuestSession = () => {

const guestId = `guest_${Date.now()}`;
const guestChat = {
  id: guestId,
  title: 'Guest Chat',
  messages: [],
  isGuest: true,
  createdAt: Date.now()
};
localStorage.setItem('guest_id', guestId);
localStorage.setItem('guest_chat', JSON.stringify(guestChat));
localStorage.setItem('guest_session_start', Date.now().toString());
setIsGuest(true);
setGuestId(guestId);
setGuestChat(guestChat);
};

// Check session expiry (36 hours)

const checkSessionExpiry = () => {

const sessionStart = localStorage.getItem('guest_session_start');
if (sessionStart) {
  const expiryTime = parseInt(sessionStart) + (36 * 60 * 60 * 1000); // 36 hours in milliseconds
  if (Date.now() > expiryTime) {
    clearGuestSession();
  }
}
};

// Clear guest session

const clearGuestSession = () => {

localStorage.removeItem('guest_id');
localStorage.removeItem('guest_chat');
localStorage.removeItem('guest_session_start');
setIsGuest(false);
setGuestId(null);
setGuestChat(null);
};

// Load existing guest session

useEffect(() => {

const storedGuestId = localStorage.getItem('guest_id');
const storedGuestChat = localStorage.getItem('guest_chat');
if (storedGuestId && storedGuestChat) {
  checkSessionExpiry();
  setIsGuest(true);
  setGuestId(storedGuestId);
  setGuestChat(JSON.parse(storedGuestChat));
}
}, []);

return {

isGuest,
guestId,
guestChat,
initGuestSession,
clearGuestSession
};

};