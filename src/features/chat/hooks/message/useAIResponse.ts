import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";

export const useAIResponse = (
  userId: string | null,
  chatId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const { toast } = useToast();

  const getAIResponse = async (userMessage: string): Promise<Message | null> => {
    if (!chatId) return null;

    try {
      const response = await fetch('https://pqzhnpgwhcuxaduvxans.supabase.co/functions/v1/ai-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxemhucGd3aGN1eGFkdXZ4YW5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjI1MzkyNiwiZXhwIjoyMDUxODI5OTI2fQ.gfsuMi2O2QFzpixTfAhFKalWmL0mZxxYa8pxJ4kGbGM',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are ALICE, a 19-year-old female AI assistant..."
            },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Check if this is a guest chat
      const isGuestChat = chatId.startsWith('chat_guest_');

      if (isGuestChat) {
        // Handle guest AI response - keep in memory only
        const newAiMessage: Message = {
          id: `msg_${Date.now()}`,
          content: aiResponse,
          is_ai: true,
          created_at: new Date().toISOString(),
          chat_id: chatId,
          type: 'text' as const
        };
        
        setMessages(prev => [...prev, newAiMessage]);
        return newAiMessage;
      } else {
        if (!userId) return null;

        const { data: savedAiMessage, error: aiMessageError } = await supabase
          .from('messages')
          .insert([
            {
              content: aiResponse,
              is_ai: true,
              chat_id: chatId,
              user_id: userId,
              type: 'text' as const
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;

        const typedMessage: Message = {
          ...savedAiMessage,
          type: 'text' as const
        };

        setMessages(prev => [...prev, typedMessage]);
        return typedMessage;
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { getAIResponse };
};
