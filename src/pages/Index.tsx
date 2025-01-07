import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import MatrixRain from "@/components/MatrixRain";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Debug log - Starting API request
    console.log('Starting chat completion request...');

    const requestBody = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a friendly and creative assistant who loves to help people."
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ],
      max_tokens: 200,
      temperature: 0.7
    };

    // Debug log - Request configuration (excluding sensitive data)
    console.log('Request configuration:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      max_tokens: requestBody.max_tokens,
      temperature: requestBody.temperature
    });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody)
      });

      // Debug log - Response status
      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response received successfully');

      const aiResponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Detailed chat error:', error);
      
      let errorMessage = "The chatbot is currently unavailable. Please try again later.";
      
      if (error instanceof Error) {
        // If it's an API error with a specific message
        if (error.message.includes('API Error')) {
          errorMessage = `API Error: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error: Please check your internet connection.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      toast({
        title: "Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('Request completed');
    }
  };

  return (
    <div className="chat-container p-4">
      <MatrixRain />
      <div className="relative z-10 flex flex-col h-full">
        <Header />
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
              message="Thinking..."
            />
          )}
          <div ref={messagesEndRef} />
        </main>
        <form 
          onSubmit={handleSubmit}
          className="p-4 bg-black/50 backdrop-blur-sm border-t border-userMessage message"
        >
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Chat here . . ."
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