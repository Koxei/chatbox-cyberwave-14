// src/features/chat/hooks/message/useMessageSubmission.ts
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

  const submitMessage = async (content: string): Promise<Message | null> => {
    if (!chatId) return null;

    // Check if this is a guest chat
    const isGuestChat = chatId.startsWith('chat_guest_');

    if (isGuestChat) {
      // Handle guest message
      const guestChatStr = localStorage.getItem('guest_chat');
      if (!guestChatStr) return null;

      const guestChat = JSON.parse(guestChatStr);
      const newMessage = {
        id: `msg_${Date.now()}`,
        content,
        is_ai: false,
        created_at: new Date().toISOString(),
<<<<<<< HEAD
        chat_id: chatId,
        type: 'text'
=======
        chat_id: chatId
>>>>>>> b142570bbb0fdca28161903831e0d45053cdebfe
      };

      guestChat.messages = [...(guestChat.messages || []), newMessage];
      localStorage.setItem('guest_chat', JSON.stringify(guestChat));
      
      setMessages(prev => [...prev, newMessage]);
<<<<<<< HEAD
      return newMessage; // Return the message object to trigger AI response
=======
      return newMessage;
>>>>>>> b142570bbb0fdca28161903831e0d45053cdebfe
    } else {
      // Handle authenticated user message
      if (!userId) return null;

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
