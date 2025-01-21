import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
  title?: string;
}

const AppOverlay = ({ children, title }: AppOverlayProps) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Navigate slightly before animation completes to prevent flash
    setTimeout(() => {
      navigate('/home');
    }, 450); // Slightly shorter than the animation duration
  };

  return (
    <>
      {/* Full-screen overlay with animation */}
      <div className={`fixed inset-0 backdrop-blur-xl bg-black/30 pointer-events-none ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} />
      {/* Content container */}
      <div className={`${isClosing ? 'animate-fade-out' : 'animate-fade-in'} backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden`}>
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