import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Landing from "@/components/Landing";
import AuthModal from "@/components/AuthModal";
import ChatMessage from "@/components/ChatMessage";
import ChatHeader from "@/components/ChatHeader";
import MatrixRain from "@/components/MatrixRain";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [showStartButton, setShowStartButton] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setShowStartButton(false);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setShowAuthModal(true);
        setShowStartButton(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartClick = () => {
    setShowStartButton(false);
    setShowAuthModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('https://pqzhnpgwhcuxaduvxans.supabase.co/functions/v1/ai-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxemhucGd3aGN1eGFkdXZ4YW5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjI1MzkyNiwiZXhwIjoyMDUxODI5OTI2fQ.gfsuMi2O2QFzpixTfAhFKalWmL0mZxxYa8pxJ4kGbGM',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are MICA, a 19-year-old female AI assistant..."  // Your full system prompt here
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
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

  if (showStartButton) {
    return <Landing onStartClick={handleStartClick} />;
  }

  if (!isAuthenticated) {
    return <AuthModal isOpen={showAuthModal} />;
  }

  return (
    <div className="chat-container p-4">
      <MatrixRain />
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader />
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              isAI={message.role === 'assistant'}
              message={message.content}
            />
          ))}
          {isLoading && (
            <ChatMessage
              isAI
              message="Wait a second pwease. . ."
            />
          )}
        </main>
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
      </div>
    </div>
  );
};

export default Index;
