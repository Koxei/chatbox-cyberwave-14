// src/features/chat/hooks/useMessageHandler.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMessageSubmission } from "./message/useMessageSubmission";
import { useAIResponse } from "./message/useAIResponse";
import { Chat, Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

interface AIMessage {
  role: string;
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

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

  const { submitMessage } = useMessageSubmission(userId, currentChat?.id ?? null, setMessages);
  const { getAIResponse } = useAIResponse(userId, currentChat?.id ?? null, setMessages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit triggered with message:', inputMessage);
    
    if (!inputMessage.trim() || isLoading || !currentChat) {
      console.log('Validation failed:', { 
        hasInput: !!inputMessage.trim(), 
        isLoading, 
        hasChat: !!currentChat 
      });
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      const isGuestChat = currentChat.id.startsWith('chat_guest_');
      console.log('Session type:', isGuestChat ? 'guest' : 'authenticated');

      if (!userId && !isGuestChat) {
        throw new Error('User not authenticated and not in guest session');
      }

      const imageCommandRegex = /^(generate|create|make)\s+image\s*(?:of|:)?\s*/i;
      const isImageRequest = imageCommandRegex.test(userMessage);
      
      console.log('Command Analysis:', {
        originalMessage: userMessage,
        isImageRequest,
        regexMatch: userMessage.match(imageCommandRegex)
      });

      const savedMessage = await submitMessage(userMessage);
      if (!savedMessage) {
        throw new Error('Failed to save message');
      }

      if (isImageRequest) {
        const prompt = userMessage.replace(imageCommandRegex, '').trim();
        
        console.log('Image generation request:', {
          prompt,
          useRunpod: true
        });

        if (!prompt) {
          toast({
            title: "Invalid Input",
            description: "Please provide details for the image you want to generate.",
            variant: "destructive",
          });
          return;
        }

        const { data: imageData, error: imageError } = await supabase.functions
          .invoke('generate-image-runpod', {
            body: { prompt }
          });

        console.log('Runpod image generation response:', imageData);
        
        if (imageError) {
          console.error('Image generation error:', imageError);
          throw imageError;
        }

        const savedAiMessage = await submitMessage(imageData.image, 'image');
        if (!savedAiMessage) {
          throw new Error('Failed to save AI image message');
        }

      } else {
        console.log('Processing as text response');
        
        if (isGuestChat) {
          const response = await fetch('https://pqzhnpgwhcuxaduvxans.supabase.co/functions/v1/ai-chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
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

          if (!response.ok) {
            throw new Error('Failed to get AI response');
          }

          const data: AIResponse = await response.json();
          const aiResponse = data.choices[0].message.content;

          setMessages(prev => [...prev, {
            id: `guest_msg_${Date.now()}`,
            content: aiResponse,
            is_ai: true,
            chat_id: currentChat.id,
            created_at: new Date().toISOString(),
            type: 'text'
          }]);
        } else {
          const aiResponse = await getAIResponse(userMessage);
          if (!aiResponse) {
            throw new Error('Failed to get AI response');
          }
        }
      }

      if (!currentChat.title || currentChat.title === 'New Chat') {
        console.log('Updating chat title...');
        
        if (!isGuestChat) {
          const { error: updateError } = await supabase
            .from('chats')
            .update({ title: userMessage.slice(0, 30) + '...' })
            .eq('id', currentChat.id);

          if (updateError) {
            console.error('Error updating chat title:', updateError);
            throw updateError;
          }
        }
        
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
        description: "Failed to process your request. Please try again.",
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