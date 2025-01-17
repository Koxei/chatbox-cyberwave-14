import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";

export const useChats = (userId: string | null, isGuest: boolean) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isGuest) {
      const guestChat: Chat = {
        id: `chat_guest_${Date.now()}`,
        title: 'Guest Chat',
        user_id: `guest_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_guest: true
      };
      setChats([guestChat]);
      setCurrentChat(guestChat);
      setMessages([]);
    } else if (userId) {
      loadChats();
    }
  }, [userId, isGuest]);

  const loadChats = async () => {
    if (isGuest) return;
    
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;

      setChats(chatsData || []);
      if (chatsData && chatsData.length > 0) {
        setCurrentChat(chatsData[0]);
        await loadMessages(chatsData[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async (chatId: string) => {
    if (isGuest) return;

    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      // Ensure each message has the correct type
      const typedMessages: Message[] = (messagesData || []).map(msg => ({
        ...msg,
        type: (msg.type === 'image' ? 'image' : 'text') as 'text' | 'image'
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    chats,
    currentChat,
    messages,
    setMessages,
    loadChats,
    createNewChat: undefined,
    handleChatSelect: isGuest ? undefined : loadMessages
  };
};