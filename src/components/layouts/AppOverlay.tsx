import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
  title?: string;
}

const AppOverlay = ({ children, title }: AppOverlayProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/home');
  };

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