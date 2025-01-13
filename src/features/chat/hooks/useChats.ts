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
      // Load guest chat from localStorage
      const guestChatStr = localStorage.getItem('guest_chat');
      if (guestChatStr) {
        const guestChat = JSON.parse(guestChatStr);
        setChats([guestChat]);
        setCurrentChat(guestChat);
        setMessages(guestChat.messages);
      }
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
      setMessages(messagesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createNewChat = async () => {
    if (isGuest) {
      toast({
        title: "Guest Mode",
        description: "Create new chat is not available in guest mode.",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a chat.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert([{ user_id: userId, title: 'New Chat' }])
        .select()
        .single();

      if (error) throw error;

      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateGuestChat = (newMessages: Message[]) => {
    if (!isGuest) return;

    const guestChatStr = localStorage.getItem('guest_chat');
    if (guestChatStr) {
      const guestChat = JSON.parse(guestChatStr);
      guestChat.messages = newMessages;
      localStorage.setItem('guest_chat', JSON.stringify(guestChat));
      setMessages(newMessages);
    }
  };

  return {
    chats,
    currentChat,
    messages,
    setMessages: isGuest ? updateGuestChat : setMessages,
    loadChats,
    createNewChat,
    handleChatSelect: isGuest ? undefined : loadMessages
  };
};
