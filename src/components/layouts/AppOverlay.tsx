import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
  title?: string;
}

const AppOverlay = ({ children, title }: AppOverlayProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClosing, setIsClosing] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useEffect(() => {
    // Reset states when location changes
    if (!location.pathname.includes('chatbox') && !location.pathname.includes('terminal')) {
      setIsClosing(false);
      setShouldUnmount(false);
    }
  }, [location]);

  useEffect(() => {
    if (isClosing) {
      // First wait for the animation to complete
      const animationTimer = setTimeout(() => {
        setShouldUnmount(true);
      }, 300);

      return () => clearTimeout(animationTimer);
    }
  }, [isClosing]);

  useEffect(() => {
    // Only navigate after we're ready to unmount
    if (shouldUnmount) {
      navigate('/home');
    }
  }, [shouldUnmount, navigate]);

  const handleClose = () => {
    setIsClosing(true);
  };

  // Don't render anything if we should unmount
  if (shouldUnmount) return null;

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