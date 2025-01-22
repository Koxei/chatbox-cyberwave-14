import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
}

const AppOverlay = ({ children }: AppOverlayProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate('/home');
  };

  // Determine which route we're on
  const isChatboxRoute = location.pathname === '/home/chatbox';
  const isTerminalRoute = location.pathname === '/home/terminal';
  
  // Only render if we're on either route
  if (!isChatboxRoute && !isTerminalRoute) return null;

  // Set border color based on route
  const borderColorClass = isChatboxRoute ? 'border-green-500' : 'border-red-500';

  return (
    <div className={`animate-fade-in rounded-lg border ${borderColorClass} overflow-hidden relative`}>
      <div className="flex items-center justify-end p-4">
        <button
          onClick={handleClose}
          className="text-aiMessage hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default AppOverlay;