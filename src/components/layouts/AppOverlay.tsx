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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay setting visibility to true to ensure mount animation works
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    
    // Navigate after animation completes, with a slight delay
    setTimeout(() => {
      navigate('/home', { replace: true });
    }, 300); // Match animation duration
  };

  return (
    <>
      {/* Transition layer that stays mounted longer */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-xl transition-all duration-300 ease-in-out z-[40] ${
          isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ visibility: isVisible || isClosing ? 'visible' : 'hidden' }}
      />
      
      {/* Content container with visibility transition */}
      <div 
        className={`transition-all duration-300 ease-in-out backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden z-[50] relative ${
          isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ visibility: isVisible || isClosing ? 'visible' : 'hidden' }}
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