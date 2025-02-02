import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/types/chat";
import { toast } from "@/hooks/use-toast";

export const useChats = (userId: string | null, isGuest: boolean) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    try {
      // For guest users, we'll use local storage instead of database
      if (isGuest) {
        const guestChatStr = localStorage.getItem('guest_chat');
        if (guestChatStr) {
          const guestChat = JSON.parse(guestChatStr);
          setChats([guestChat]);
          setCurrentChat(guestChat);
        }
        setIsLoading(false);
        return;
      }

      // Only proceed with database query for authenticated users
      if (!userId || userId.startsWith('guest_')) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading chats:", error);
        throw error;
      }

      setChats(data || []);
      if (data && data.length > 0) {
        setCurrentChat(data[0]);
      }
    } catch (error: any) {
      console.error("Error loading chats:", error);
      toast({
        title: "Error loading chats",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, isGuest]);

  const createNewChat = async () => {
    try {
      if (isGuest) {
        const newGuestChat = {
          id: `chat_${Date.now()}`,
          title: 'Guest Chat',
          messages: [],
          isGuest: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem('guest_chat', JSON.stringify(newGuestChat));
        setChats([newGuestChat]);
        return newGuestChat;
      }

      if (!userId || userId.startsWith('guest_')) return null;

      const { data, error } = await supabase
        .from("chats")
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      setChats((prevChats) => [data, ...prevChats]);
      return data;
    } catch (error: any) {
      console.error("Error creating new chat:", error);
      toast({
        title: "Error creating new chat",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      if (isGuest) {
        const guestChatStr = localStorage.getItem('guest_chat');
        if (guestChatStr) {
          const guestChat = JSON.parse(guestChatStr);
          setCurrentChat(guestChat);
          setMessages(guestChat.messages || []);
        }
        return;
      }

      const selectedChat = chats.find((chat) => chat.id === chatId);
      if (selectedChat) {
        setCurrentChat(selectedChat);
        // Load messages for the selected chat
        const { data: messages, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(messages || []);
      }
    } catch (error: any) {
      console.error("Error selecting chat:", error);
      toast({
        title: "Error selecting chat",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    isLoading,
    loadChats,
    createNewChat,
    handleChatSelect,
  };
};