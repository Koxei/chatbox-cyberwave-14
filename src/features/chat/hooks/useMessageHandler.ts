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
      const isImageCommand = userMessage.startsWith('/image');
      
      const { data: savedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: userMessage,
            is_ai: false,
            chat_id: currentChat.id,
            user_id: userId,
            type: 'text'
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;
      setMessages(prev => [...prev, savedMessage]);

      if (isImageCommand) {
        const imagePrompt = userMessage.replace('/image', '').trim();
        const response = await supabase.functions.invoke('generate-image', {
          body: { prompt: imagePrompt }
        });

        if (response.error) throw response.error;

        const { data: savedAiMessage, error: aiMessageError } = await supabase
          .from('messages')
          .insert([
            {
              content: `Generated image for: ${imagePrompt}`,
              is_ai: true,
              chat_id: currentChat.id,
              user_id: userId,
              type: 'image',
              image_url: response.data.url
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;
        setMessages(prev => [...prev, savedAiMessage]);
      } else {
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
              type: 'text'
            }
          ])
          .select()
          .single();

        if (aiMessageError) throw aiMessageError;
        setMessages(prev => [...prev, savedAiMessage]);
      }

    } catch (error) {
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