import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Terminal as TerminalIcon } from 'lucide-react';

const NewHomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAppOpen = location.pathname.includes('/chatbox') || location.pathname.includes('/terminal');

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Content overlay with proper opacity and transition */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-all duration-300 ease-in-out ${
          isAppOpen ? 'blur brightness-50' : ''
        }`}
      />

      {/* Content container with transition */}
      <div className={`relative z-10 min-h-screen flex flex-col justify-end pb-16 transition-all duration-300 ease-in-out ${
        isAppOpen ? 'opacity-0 pointer-events-none' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
            {/* Chatbox App */}
            <div
              onClick={() => navigate('/home/chatbox')}
              className="group relative cursor-pointer flex items-center justify-center"
            >
              <div className="text-cyan-500 transform transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="w-12 h-12" />
              </div>
            </div>
            {/* Terminal App */}
            <div
              onClick={() => navigate('/home/terminal')}
              className="group relative cursor-pointer flex items-center justify-center"
            >
              <div className="text-purple-500 transform transition-transform duration-300 group-hover:scale-110">
                <TerminalIcon className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* App overlay container - increased z-index */}
      <div className={`fixed inset-0 ${isAppOpen ? 'z-50' : 'pointer-events-none'}`}>
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className="pointer-events-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHomeLayout;