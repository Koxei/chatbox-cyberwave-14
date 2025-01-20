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
    <div className="animate-fade-in bg-black/80 backdrop-blur-sm rounded-lg border border-aiMessage shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-aiMessage">
        <h2 className="text-aiMessage font-arcade text-sm">{title}</h2>
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
  );
};

export default AppOverlay;