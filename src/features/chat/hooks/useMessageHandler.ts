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
      // CHANGE #1: Detect image request first, before any API calls
      const imageCommandRegex = /^(generate|create|make)\s+image\s+/i;
      const isImageRequest = imageCommandRegex.test(userMessage);
      
      // CHANGE #2: Add debug logs for image detection
      console.log('Image Request Detection:', {
        message: userMessage,
        isImageRequest,
        matchResult: userMessage.match(imageCommandRegex)
      });

      // Save user message first
      const { data: savedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: userMessage,
            is_ai: false,
            chat_id: currentChat.id,
            user_id: userId,
            type: 'text' as const
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      const typedUserMessage: Message = {
        ...savedMessage,
        type: 'text' as const
      };
      
      setMessages(prev => [...prev, typedUserMessage]);

      // CHANGE #3: Handle image generation if detected
      if (isImageRequest) {
        console.log('Processing image request...');
        const prompt = userMessage.replace(imageCommandRegex, '').trim();
        
        if (!prompt) {
          throw new Error('No image prompt provided');
        }

        console.log('Generating image with prompt:', prompt);
        
        try {
          const { data: imageData, error: imageError } = await supabase.functions
            .invoke('generate-image', {
              body: { prompt }
            });

          console.log('Image generation response:', imageData);
          
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
                type: 'image' as const
              }
            ])
            .select()
            .single();

          if (aiMessageError) throw aiMessageError;

          const typedAiMessage: Message = {
            ...savedAiMessage,
            type: 'image' as const
          };
          
          setMessages(prev => [...prev, typedAiMessage]);
          return; // Exit early after successful image generation
        } catch (imageError) {
          console.error('Image generation failed:', imageError);
          throw imageError;
        }
      }

      // CHANGE #4: Only proceed with text response if not an image request
      console.log('Processing text response...');
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

      const { data: savedAiMessage, error: aiMessageError } = await supabase
        .from('messages')
        .insert([
          {
            content: aiResponse,
            is_ai: true,
            chat_id: currentChat.id,
            user_id: userId,
            type: 'text' as const
          }
        ])
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      const typedAiMessage: Message = {
        ...savedAiMessage,
        type: 'text' as const
      };
      
      setMessages(prev => [...prev, typedAiMessage]);

      // Update chat title if needed
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
