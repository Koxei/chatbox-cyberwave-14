// src/components/layouts/AppOverlay.tsx

import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { X } from 'lucide-react';

interface AppOverlayProps {

children: React.ReactNode;

title?: string;

}

const AppOverlay = ({ children, title }: AppOverlayProps) => {

const navigate = useNavigate();

const location = useLocation();

const handleClose = () => {

navigate('/home');
};

// Get the current path

const currentPath = location.pathname;

// Check if we should render based on the current path and title

const shouldRender =

(currentPath === '/home/chatbox' && title === "Chatbox") ||
(currentPath === '/home/terminal' && title === "CYBERPUNK TERMINAL");
if (!shouldRender) return null;

return (

<div className="animate-fade-in rounded-lg border border-red-500 overflow-hidden relative">
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

