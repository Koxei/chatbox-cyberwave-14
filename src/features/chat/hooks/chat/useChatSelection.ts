import { useState } from "react";
import { Chat, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChatSelection = () => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const loadMessages = async (chatId: string) => {
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

  const handleChatSelect = async (chat: Chat) => {
    setCurrentChat(chat);
    await loadMessages(chat.id);
  };

  return {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    loadMessages,
    handleChatSelect
  };
};