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
    console.log('handleSubmit triggered with message:', inputMessage);
    if (!inputMessage.trim() || isLoading || !currentChat || !userId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // CHANGE #1: Enhanced image command detection
      const imageCommandRegex = /^(generate|create|make)\s+image\s*(?:of|:)?\s*/i;
      const isImageRequest = imageCommandRegex.test(userMessage);
      
      console.log('Command Analysis:', {
        originalMessage: userMessage,
        isImageRequest,
        regexMatch: userMessage.match(imageCommandRegex)
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

      // CHANGE #2: Enhanced prompt validation and error handling
      if (isImageRequest) {
        const prompt = userMessage.replace(imageCommandRegex, '').trim();
        
        console.log('Prompt Extraction:', {
          originalMessage: userMessage,
          extractedPrompt: prompt,
          promptLength: prompt.length
        });

        // CHANGE #3: Improved empty prompt handling with user feedback
        if (!prompt) {
          console.error('Image generation skipped: Prompt is empty');
          toast({
            title: "Invalid Input",
            description: "Please provide details for the image you want to generate.",
            variant: "destructive",
          });
          return;
        }

        console.log('Starting image generation with prompt:', prompt);

        const { data: imageData, error: imageError } = await supabase.functions
          .invoke('generate-image', {
            body: { prompt }
          });

        console.log('Image generation response:', imageData);
        
        if (imageError) {
          console.error('Image generation error:', imageError);
          throw imageError;
        }

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
        return;
      }

      console.log('Processing as text response');
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
