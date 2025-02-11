// src/components/layouts/AppOverlay.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppOverlayProps {
  children: React.ReactNode;
}

const AppOverlay = ({ children }: AppOverlayProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which route we're on
  const isChatboxRoute = location.pathname === '/home/chatbox';
  const isTerminalRoute = location.pathname === '/home/terminal';
  
  // Only render if we're on either route
  if (!isChatboxRoute && !isTerminalRoute) return null;

  return (
    <div className="animate-fade-in overflow-hidden relative">
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default AppOverlay;
