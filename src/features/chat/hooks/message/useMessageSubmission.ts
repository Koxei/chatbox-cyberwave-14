import { Message } from "@/types/chat";

import { supabase } from "@/integrations/supabase/client";

import { useToast } from "@/hooks/use-toast";

export const useMessageSubmission = (

userId: string | null,

chatId: string | null,

setMessages: React.Dispatch<React.SetStateAction<Message[]>>

) => {

const { toast } = useToast();

const submitMessage = async (content: string): Promise<Message | null> => {

if (!chatId) return null;
const isGuestChat = chatId.startsWith('chat_guest_');
if (isGuestChat) {
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    content,
    is_ai: false,
    created_at: new Date().toISOString(),
    chat_id: chatId,
    type: 'text',
    user_id: 'guest'
  };
  setMessages(prev => [...prev, newMessage]);
  return newMessage;
}
if (!userId) return null;
try {
  const { data: savedMessage, error: messageError } = await supabase
    .from('messages')
    .insert([{
      content,
      is_ai: false,
      chat_id: chatId,
      user_id: userId
    }])
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
};

return { submitMessage };

};