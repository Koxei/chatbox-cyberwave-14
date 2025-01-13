import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Landing from "@/components/Landing";
import AuthModal from "@/features/auth/components/AuthModal";
import ChatMessage from "@/features/chat/components/messages/ChatMessage";
import ChatHeader from "@/components/ChatHeader";
import MatrixRain from "@/features/effects/MatrixRain";
import { Chat, Message } from "@/types/chat";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const [showStartButton, setShowStartButton] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setShowStartButton(false);
        await loadChats();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setShowAuthModal(true);
        setShowStartButton(false);
        setChats([]);
        setCurrentChat(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadChats = async () => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;

      setChats(chatsData || []);
      if (chatsData && chatsData.length > 0) {
        setCurrentChat(chatsData[0]);
        await loadMessages(chatsData[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createNewChat = async () => {
    try {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert([
          { 
            is_guest: !isAuthenticated,
            title: 'New Chat'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentChat) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // Save user message
      const { data: savedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: userMessage,
            is_ai: false,
            chat_id: currentChat.id
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      setMessages(prev => [...prev, savedMessage]);

      // Get AI response
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
            ...messages.map(msg => ({
              role: msg.is_ai ? "assistant" : "user",
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Save AI response
      const { data: savedAiMessage, error: aiMessageError } = await supabase
        .from('messages')
        .insert([
          {
            content: aiResponse,
            is_ai: true,
            chat_id: currentChat.id
          }
        ])
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      setMessages(prev => [...prev, savedAiMessage]);

      // Update chat title after first exchange
      if (messages.length === 0) {
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
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartClick = () => {
    setShowStartButton(false);
    setShowAuthModal(true);
  };

  const handleChatSelect = async (chat: Chat) => {
    setCurrentChat(chat);
    await loadMessages(chat.id);
  };

  // Show auth modal if not authenticated or resetting password
  const showModal = !isAuthenticated || isResettingPassword;

  if (showStartButton) {
    return <Landing onStartClick={handleStartClick} />;
  }

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/80">
        <AuthModal 
          isOpen={true}
          onPasswordResetStart={() => setIsResettingPassword(true)}
          onPasswordResetComplete={() => {
            setIsResettingPassword(false);
            if (isAuthenticated) {
              setShowAuthModal(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="chat-container p-4">
      <MatrixRain />
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader 
          currentChat={currentChat}
          chats={chats}
          onChatSelect={handleChatSelect}
          onNewChat={createNewChat}
          isAuthenticated={isAuthenticated}
        />
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              isAI={message.is_ai}
              message={message.content}
            />
          ))}
          {isLoading && (
            <ChatMessage
              isAI
              message="Wait a second pwease. . ."
            />
          )}
          {!currentChat && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <PlusCircle className="w-12 h-12 mb-4" />
              <p className="text-lg">Start a new chat</p>
            </div>
          )}
        </main>
        {currentChat && (
          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-black/50 backdrop-blur-sm border-t border-userMessage"
          >
            <div className="max-w-3xl mx-auto flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Write something c:"
                className="flex-1 bg-container p-2 rounded border border-userMessage text-white font-arcade"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-container border border-userMessage text-userMessage rounded font-arcade hover:opacity-80 transition-opacity disabled:opacity-50"
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;