import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chat } from "@/types/chat";

export const useChatList = (userId: string | null, isAuthenticated: boolean) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { toast } = useToast();

  const loadChats = async () => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;
      setChats(chatsData || []);
      return chatsData;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  const createNewChat = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a chat.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert([
          { 
            user_id: userId,
            is_guest: !isAuthenticated,
            title: 'New Chat'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    chats,
    setChats,
    loadChats,
    createNewChat
  };
};