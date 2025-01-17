// src/features/chat/hooks/useMessageHandler.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";

export const useMessageHandler = (
  userId: string | null,
  currentChat: Chat | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>
) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentChat || !userId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if this is an image generation request
      const isImageRequest = userMessage.toLowerCase().includes('generate image') || 
                           userMessage.toLowerCase().includes('create image') ||
                           userMessage.toLowerCase().includes('make image');

      // Save user message
      const { data: savedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: userMessage,
            is_ai: false,
            chat_id: currentChat.id,
            user_id: userId,
            type: 'text'  // User messages are always text
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;
      setMessages(prev => [...prev, savedMessage]);

      // Handle image generation if requested
      if (isImageRequest) {
        // Extract the prompt from the message
        const prompt = userMessage.replace(/generate image|create image|make image/i, '').trim();
        
        // Call the image generation edge function
        const { data: imageData, error: imageError } = await supabase.functions
          .invoke('generate-image', {
            body: { prompt }
          });

        if (imageError) throw imageError;

        // Save AI image response
        const { data: savedAiMessage, error: aiMessageError } = await supabase
          .from('messages')
          .insert([
            {
              content: imageData.image,
              is_ai: true,
              chat_id: currentChat.id,
              user_id: userId,
              type: 'image'
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;
        setMessages(prev => [...prev, savedAiMessage]);
      } else {
        // Handle regular text response
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

        // Save AI text response
        const { data: savedAiMessage, error: aiMessageError } = await supabase
          .from('messages')
          .insert([
            {
              content: aiResponse,
              is_ai: true,
              chat_id: currentChat.id,
              user_id: userId,
              type: 'text'
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;
        setMessages(prev => [...prev, savedAiMessage]);
      }

      // Update chat title after first exchange if needed
      if (savedMessage && !currentChat.title) {
        const { error: updateError } = await supabase
          .from('chats')
          .update({ title: userMessage.slice(0, 30) + '...' })
          .eq('id', currentChat.id);

        if (updateError) throw updateError;
        
        setChats(prev => prev.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, title: userMessage.slice(0, 30) + '...' }
            : chat
        ));
        setCurrentChat(prev => prev ? { ...prev, title: userMessage.slice(0, 30) + '...' } : null);
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputMessage,
    setInputMessage,
    isLoading,
    handleSubmit
  };
};

export default useMessageHandler;
