import { useState, useCallback } from 'react';
import { Chat, Message } from '../types/chat';
import { supabase } from '@/integrations/supabase/client';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const loadChats = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setChats(data);
    }
  }, []);

  return {
    chats,
    currentChat,
    loadChats,
    setCurrentChat,
  };
};