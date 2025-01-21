import React, { useState, useEffect } from 'react';

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

const [isMounted, setIsMounted] = useState(true);

useEffect(() => {

// Reset states when location changes
if (!location.pathname.includes('chatbox') && !location.pathname.includes('terminal')) {
  setIsClosing(false);
  setIsMounted(false);
}
}, [location]);

const handleClose = () => {

setIsClosing(true);
// Navigate immediately
navigate('/home', { replace: true });
// Remove portal after animation
setTimeout(() => {
  setIsMounted(false);
}, 300);
};

if (!isMounted) return null;

return createPortal(

<>
  <div 
    className={`fixed inset-0 backdrop-blur-xl bg-black/30 z-[40] transition-all duration-300 ${
      isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100'
    }`} 
  />
  <div 
    className={`fixed inset-0 z-[50] pointer-events-none`}
  >
    <div className="container mx-auto h-full flex items-center justify-center">
      <div 
        className={`pointer-events-auto w-full max-w-2xl backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
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
    </div>
  </div>
</>,
document.body
);

};

export default AppOverlay;