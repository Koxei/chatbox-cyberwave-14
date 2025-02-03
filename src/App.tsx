import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

import Landing from "@/components/Landing";

import ChatboxPage from "@/pages/ChatboxPage";

import NewHome from "@/pages/NewHome";

import Login from "@/pages/Login";

import NewHomeLayout from "@/components/layouts/NewHomeLayout";

import TerminalPage from "@/pages/TerminalPage";

import AppOverlay from "@/components/layouts/AppOverlay";

const queryClient = new QueryClient();

const VideoBackground = () => {

const location = useLocation();

const showOverlay = location.pathname === '/login';

return (

<div className="fixed inset-0 w-full h-full -z-10">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/lovable-uploads/vid2.mp4" type="video/mp4" />
  </video>
  {showOverlay && <div className="absolute inset-0 bg-black/50" />}
</div>
);

};

const App = () => (

<ErrorBoundary>
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <BrowserRouter>
      <VideoBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<NewHomeLayout />}>
            <Route index element={<NewHome />} />
            <Route path="chatbox" element={<AppOverlay><ChatboxPage /></AppOverlay>} />
            <Route path="terminal" element={<AppOverlay><TerminalPage /></AppOverlay>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
    <Toaster />
    <Sonner />
  </TooltipProvider>
</QueryClientProvider>
</ErrorBoundary>
);

export default App;