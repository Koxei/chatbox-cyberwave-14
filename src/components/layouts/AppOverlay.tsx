import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface AppOverlayProps {
  children: React.ReactNode;
  title?: string;
}

const AppOverlay = ({ children, title }: AppOverlayProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 backdrop-blur-xl pointer-events-none animate-fade-in" />

      {/* Content container */}
      <div className="animate-fade-in backdrop-blur-sm rounded-lg border border-red-500 shadow-lg overflow-hidden">
        <div className="flex items-center justify-end p-4">
          <button
            onClick={() => navigate('/home')}
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