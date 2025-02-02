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
      initializeGuestChat();
    } else if (userId) {
      loadChats();
    }
  }, [userId, isGuest]);

  const initializeGuestChat = () => {
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
  };

  const loadChats = async () => {
    if (isGuest) return;
    
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (chatsError) {
        console.error('Error loading chats:', chatsError);
        toast({
          title: "Error",
          description: "Failed to load chats. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // If no chats exist, create a new one
      if (!chatsData || chatsData.length === 0) {
        const newChat = await createNewChat();
        if (newChat) {
          setChats([newChat]);
          setCurrentChat(newChat);
          setMessages([]);
        }
        return;
      }

      // Otherwise load existing chats
      setChats(chatsData);
      setCurrentChat(chatsData[0]);
      await loadMessages(chatsData[0].id);
    } catch (error) {
      console.error('Error in loadChats:', error);
      if (!isGuest) {
        toast({
          title: "Error",
          description: "Failed to load chats. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const createNewChat = async () => {
    if (isGuest || !userId) return null;

    try {
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating new chat:', createError);
        if (!isGuest) {
          toast({
            title: "Error",
            description: "Failed to create new chat. Please try again.",
            variant: "destructive",
          });
        }
        return null;
      }

      return newChat;
    } catch (error) {
      console.error('Error in createNewChat:', error);
      if (!isGuest) {
        toast({
          title: "Error",
          description: "Failed to create new chat. Please try again.",
          variant: "destructive",
        });
      }
      return null;
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

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        if (!isGuest) {
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
      
      const typedMessages: Message[] = (messagesData || []).map(msg => ({
        ...msg,
        type: (msg.type === 'image' ? 'image' : 'text') as 'text' | 'image'
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error in loadMessages:', error);
      if (!isGuest) {
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleChatSelect = async (chatId: string) => {
    if (isGuest) return;
    
    // Find the selected chat from the chats array
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChat(selectedChat);
      await loadMessages(chatId);
    }
  };

  return {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    loadChats,
    createNewChat,
    handleChatSelect
  };
};
