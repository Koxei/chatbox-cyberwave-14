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

const [shouldRender, setShouldRender] = useState(true);

useEffect(() => {

if (isClosing) {
  const timer = setTimeout(() => {
    setShouldRender(false);
    navigate('/home');
  }, 270);
  return () => clearTimeout(timer);
}
}, [isClosing, navigate]);

const handleClose = () => {

setIsClosing(true);
};

if (!shouldRender) return null;

return (

<>
  <div 
    className={`fixed inset-0 backdrop-blur-xl bg-black/30 z-[40] ${
      isClosing ? 'animate-fade-out' : 'animate-fade-in'
    }`} 
  />
  <div 
    className={`${
      isClosing ? 'animate-fade-out' : 'animate-fade-in'
    } backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden z-[50] relative`}
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

