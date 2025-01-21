import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import Landing from "@/components/Landing";
import Home from "@/pages/Home";
import NewHome from "@/pages/NewHome";
import Login from "@/pages/Login";
import SharedLayout from "@/components/layouts/SharedLayout";
import NewHomeLayout from "@/components/layouts/NewHomeLayout";
import TerminalPage from "@/pages/TerminalPage";
import AppOverlay from "@/components/layouts/AppOverlay";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="chatbox" element={<Home />} />
              <Route path="terminal" element={<TerminalPage />} />
            </Route>
            <Route element={<SharedLayout />}>
              <Route path="/chatbox" element={<Home />} />
              <Route path="/terminal" element={<TerminalPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;