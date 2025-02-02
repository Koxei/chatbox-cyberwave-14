import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatControls from '../ChatControls';

interface AppOverlayProps {
  children: React.ReactNode;
  currentChat?: any;
  chats?: any[];
  onChatSelect?: (chat: any) => void;
  onNewChat?: () => void;
  isAuthenticated?: boolean;
}

const AppOverlay = ({ 
  children, 
  currentChat, 
  chats = [], 
  onChatSelect = () => {}, 
  onNewChat = () => {}, 
  isAuthenticated = false 
}: AppOverlayProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which route we're on
  const isChatboxRoute = location.pathname === '/home/chatbox';
  const isTerminalRoute = location.pathname === '/home/terminal';
  
  // Only render if we're on either route
  if (!isChatboxRoute && !isTerminalRoute) return null;

  // Set border color based on route
  const borderColorClass = isChatboxRoute ? 'border-green-500' : 'border-red-500';

  return (
    <div className={`animate-fade-in rounded-lg border ${borderColorClass} overflow-hidden relative`}>
      {isChatboxRoute && (
        <ChatControls
          currentChat={currentChat}
          chats={chats}
          onChatSelect={onChatSelect}
          onNewChat={onNewChat}
          isAuthenticated={isAuthenticated}
        />
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default AppOverlay;