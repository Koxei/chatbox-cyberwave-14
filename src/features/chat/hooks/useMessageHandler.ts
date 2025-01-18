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
      // CHANGE #1: Move image detection before any API calls
      const imageCommandRegex = /^(generate|create|make)\s+image\s+/i;
      const isImageRequest = imageCommandRegex.test(userMessage);
      
      // CHANGE #2: Add immediate logging to verify detection
      console.log('Message detection:', {
        message: userMessage,
        isImageRequest,
        matchResult: userMessage.match(imageCommandRegex)
      });

      // CHANGE #3: Extract prompt early if it's an image request
      let prompt = '';
      if (isImageRequest) {
        prompt = userMessage.replace(imageCommandRegex, '').trim();
        console.log('Extracted prompt:', prompt);
      }

      // Save user message
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

      // CHANGE #4: Add logging before branching
      console.log('Processing message:', {
        isImageRequest,
        hasPrompt: Boolean(prompt),
        messageType: isImageRequest ? 'image' : 'text'
      });

      if (isImageRequest && prompt) {
        console.log('Starting image generation for prompt:', prompt);
        
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
      } else {
        // CHANGE #5: Log when falling back to text response
        console.log('Falling back to text response:', {
          reason: isImageRequest ? 'empty prompt' : 'not an image request'
        });

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
      }

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
