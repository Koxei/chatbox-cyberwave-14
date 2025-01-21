import React from 'react';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
}

const AppOverlay = ({ children, title, onClose }: AppOverlayProps) => {
  return (
    <>
      <div 
        className="fixed inset-0 backdrop-blur-xl bg-black/30 z-[40] transition-all duration-300" 
      />
      <div 
        className="backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden z-[50] relative transition-all duration-300"
      >
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
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