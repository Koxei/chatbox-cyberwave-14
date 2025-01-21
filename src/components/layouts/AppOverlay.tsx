import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { X } from 'lucide-react';

interface AppOverlayProps {

children: React.ReactNode;

title?: string;

}

const AppOverlay = ({ children, title }: AppOverlayProps) => {

const navigate = useNavigate();

const [isClosing, setIsClosing] = useState(false);

useEffect(() => {

if (isClosing) {
  // Wait for both fade and blur animations to complete
  const timer = setTimeout(() => {
    navigate('/home');
  }, 300); // Slightly longer than animation duration
  return () => clearTimeout(timer);
}
}, [isClosing, navigate]);

const handleClose = () => {

setIsClosing(true);
};

return (

<>
  <div 
    className={`fixed inset-0 backdrop-blur-xl bg-black/30 z-[40] transition-all duration-300 ${
      isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100'
    }`} 
  />
  <div 
    className={`backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden z-[50] relative transition-all duration-300 ${
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
</>
);

};

export default AppOverlay;

