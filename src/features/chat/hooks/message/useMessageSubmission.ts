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

  const generateImage = async (prompt: string): Promise<string | null> => {
    try {
      const response = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data.image;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const getAIResponse = async (userMessage: string): Promise<Message | null> => {
    if (!chatId) return null;

    try {
      // Check if message is requesting an image
      const isImageRequest = userMessage.toLowerCase().includes('generate image') || 
                           userMessage.toLowerCase().includes('create image') ||
                           userMessage.toLowerCase().includes('make image');

      if (isImageRequest) {
        // Extract the prompt from the message
        const prompt = userMessage.replace(/generate image|create image|make image/i, '').trim();
        const imageUrl = await generateImage(prompt);

        if (!imageUrl) throw new Error('Failed to generate image');

        // Create AI response with image
        const aiResponse = {
          content: imageUrl,
          type: 'image' as const,
          is_ai: true,
          created_at: new Date().toISOString(),
          chat_id: chatId,
          id: `msg_${Date.now()}`
        };

        // Handle guest vs authenticated user
        if (chatId.startsWith('chat_guest_')) {
          setMessages(prev => [...prev, aiResponse]);
          return aiResponse;
        } else if (userId) {
          const { data: savedMessage, error } = await supabase
            .from('messages')
            .insert([{
              content: imageUrl,
              is_ai: true,
              chat_id: chatId,
              user_id: userId,
              type: 'image'
            }])
            .select()
            .single();

          if (error) throw error;
          setMessages(prev => [...prev, savedMessage]);
          return savedMessage;
        }
      }

      // Handle regular text messages (existing code)
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

      const isGuestChat = chatId.startsWith('chat_guest_');

      if (isGuestChat) {
        const newAiMessage = {
          id: `msg_${Date.now()}`,
          content: aiResponse,
          is_ai: true,
          created_at: new Date().toISOString(),
          chat_id: chatId,
          type: 'text'
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
              type: 'text'
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;

        setMessages(prev => [...prev, savedAiMessage]);
        return savedAiMessage;
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