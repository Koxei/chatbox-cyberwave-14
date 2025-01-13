import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";

export const useMessageSubmission = (
  userId: string | null,
  chatId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const { toast } = useToast();

  const submitMessage = async (content: string): Promise<Message | null> => {
    if (!userId || !chatId) return null;

    try {
      const { data: savedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content,
            is_ai: false,
            chat_id: chatId,
            user_id: userId
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      setMessages(prev => [...prev, savedMessage]);
      return savedMessage;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { submitMessage };
};