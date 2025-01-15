import { useState } from "react";
import { Chat, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useChatState = () => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = async (chatId: string) => {
    setLoading(true);
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
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    loading,
    loadMessages
  };
};