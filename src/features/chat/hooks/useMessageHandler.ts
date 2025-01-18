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

  // Import the submission and AI response hooks
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
      // Handle guest session
      const isGuestChat = currentChat.id.startsWith('chat_guest_');
      console.log('Session type:', isGuestChat ? 'guest' : 'authenticated');

      if (!userId && !isGuestChat) {
        throw new Error('User not authenticated and not in guest session');
      }

      // CHANGE #1: Enhanced image command detection
      const imageCommandRegex = /^(generate|create|make)\s+image\s*(?:of|:)?\s*/i;
      const isImageRequest = imageCommandRegex.test(userMessage);
      
      console.log('Command Analysis:', {
        originalMessage: userMessage,
        isImageRequest,
        regexMatch: userMessage.match(imageCommandRegex)
      });

      // First save the user message using submitMessage
      const savedMessage = await submitMessage(userMessage);
      if (!savedMessage) {
        throw new Error('Failed to save message');
      }

      // Handle image generation if it's an image request
      if (isImageRequest) {
        const prompt = userMessage.replace(imageCommandRegex, '').trim();
        
        console.log('Prompt Extraction:', {
          originalMessage: userMessage,
          extractedPrompt: prompt,
          promptLength: prompt.length
        });

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

        // Save the AI image response
        const savedAiMessage = await submitMessage(imageData.image, 'image');
        if (!savedAiMessage) {
          throw new Error('Failed to save AI image message');
        }

      } else {
        console.log('Processing as text response');
        
        if (isGuestChat) {
          // Handle guest chat response
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

          // For guest sessions, we update messages in memory
          setMessages(prev => [...prev, {
            id: `guest_msg_${Date.now()}`,
            content: aiResponse,
            is_ai: true,
            chat_id: currentChat.id,
            created_at: new Date().toISOString(),
            type: 'text'
          }]);
        } else {
          // Get regular AI text response for authenticated users
          const aiResponse = await getAIResponse(userMessage);
          if (!aiResponse) {
            throw new Error('Failed to get AI response');
          }
        }
      }

      // Update chat title if needed
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
        console.log('Chat title updated successfully');
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
