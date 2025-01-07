import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import MatrixRain from "@/components/MatrixRain";
import { useState } from "react";

const Index = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission here
    setMessage("");
  };

  return (
    <div className="chat-container p-4">
      <MatrixRain />
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          <ChatMessage
            isAI
            message="Hello! I'm MICA, your friendly AI assistant. How can I help you today?"
          />
          <ChatMessage
            message="Hi MICA! Can you tell me more about yourself?"
          />
          <ChatMessage
            isAI
            message="I'm a minimalist AI chatbot designed to help users with various tasks while maintaining a clean and aesthetic interface. I love using emojis and keeping things simple! 😛"
          />
        </main>
        <form 
          onSubmit={handleSubmit}
          className="p-4 bg-black/50 backdrop-blur-sm border-t border-userMessage"
        >
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Chat here . . ."
              className="flex-1 bg-container p-2 rounded border border-userMessage text-white font-arcade"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-container border border-userMessage text-userMessage rounded font-arcade hover:opacity-80 transition-opacity"
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