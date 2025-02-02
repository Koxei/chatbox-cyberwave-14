import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import Landing from "@/components/Landing";
import ChatboxPage from "@/pages/ChatboxPage";
import NewHome from "@/pages/NewHome";
import Login from "@/pages/Login";
import NewHomeLayout from "@/components/layouts/NewHomeLayout";
import TerminalPage from "@/pages/TerminalPage";
import AppOverlay from "@/components/layouts/AppOverlay";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useChats } from "@/features/chat/hooks/useChats";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, userId } = useAuth();
  const {
    chats,
    currentChat,
    handleChatSelect,
    createNewChat,
  } = useChats(userId, false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<NewHomeLayout />}>
                <Route index element={<NewHome />} />
                <Route path="chatbox" element={
                  <AppOverlay
                    currentChat={currentChat}
                    chats={chats}
                    onChatSelect={handleChatSelect}
                    onNewChat={createNewChat}
                    isAuthenticated={isAuthenticated}
                  >
                    <ChatboxPage />
                  </AppOverlay>
                } />
                <Route path="terminal" element={<AppOverlay><TerminalPage /></AppOverlay>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;