import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

export const useMessageSubmission = (
  userId: string | null,
  chatId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const { toast } = useToast();

  const submitMessage = async (content: string, type: 'text' | 'image' = 'text'): Promise<Message | null> => {
    if (!chatId) return null;

    // Check if this is a guest chat
    const isGuestChat = chatId.startsWith('chat_guest_');

    if (isGuestChat) {
      // Handle guest message - keep in memory only
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content,
        is_ai: false,
        created_at: new Date().toISOString(),
        chat_id: chatId,
        type
      };
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } else {
      if (!userId) return null;

      try {
        const { data: savedMessage, error: messageError } = await supabase
          .from('messages')
          .insert([
            {
              content,
              is_ai: false,
              chat_id: chatId,
              user_id: userId,
              type
            }
          ])
          .select()
          .single();

        if (messageError) throw messageError;

        const typedMessage: Message = {
          ...savedMessage,
          type: savedMessage.type as 'text' | 'image'
        };

        setMessages(prev => [...prev, typedMessage]);
        return typedMessage;
      } catch (error) {
        console.error('Error submitting message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    }
  };

  return { submitMessage };
};

export default useMessageSubmission;
