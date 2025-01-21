import React, { useState, useCallback } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { X } from 'lucide-react';

import { createPortal } from 'react-dom';

interface AppOverlayProps {

children: React.ReactNode;

title?: string;

}

const AppOverlay = ({ children, title }: AppOverlayProps) => {

const navigate = useNavigate();

const location = useLocation();

const [isClosing, setIsClosing] = useState(false);

// Single handler for both animation and navigation

const handleClose = useCallback(() => {

setIsClosing(true);
// Use the transitionend event to handle navigation
const overlay = document.querySelector('.app-overlay');
const handleTransitionEnd = (e: TransitionEvent) => {
  if (e.propertyName === 'opacity') {
    overlay?.removeEventListener('transitionend', handleTransitionEnd);
    navigate('/home', { replace: true });
  }
};
overlay?.addEventListener('transitionend', handleTransitionEnd);
}, [navigate]);

// Create portal for better DOM management

return createPortal(

<>
  <div 
    className={`
      fixed inset-0 
      backdrop-blur-xl 
      bg-black/30 
      transition-[opacity,visibility] 
      duration-300 
      z-[40]
      ${isClosing ? 'opacity-0 invisible' : 'opacity-100 visible'}
    `} 
  />
  <div 
    className={`
      app-overlay
      fixed inset-0 
      flex flex-col
      backdrop-blur-sm 
      rounded-lg 
      border 
      border-red-500 
      shadow-lg 
      overflow-hidden 
      z-[50] 
      transition-[opacity,visibility,transform] 
      duration-300
      ${isClosing ? 
        'opacity-0 invisible scale-95' : 
        'opacity-100 visible scale-100'
      }
    `}
  >
    <div className="flex items-center justify-end p-4">
      <button
        onClick={handleClose}
        className="text-aiMessage hover:text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 flex-1 overflow-auto">
      {children}
    </div>
  </div>
</>,
document.body
);

};

export default AppOverlay;