import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";

export const useChats = (userId: string | null, isAuthenticated: boolean) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const loadChats = async () => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
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

  const handleChatSelect = async (chat: Chat) => {
    setCurrentChat(chat);
    await loadMessages(chat.id);
  };

  return {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    loadChats,
    loadMessages,
    createNewChat,
    handleChatSelect
  };
};