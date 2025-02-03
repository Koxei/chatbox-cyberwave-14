import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Terminal as TerminalIcon } from 'lucide-react';

const NewHomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAppOpen = location.pathname.includes('/chatbox') || location.pathname.includes('/terminal');

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background overlay with blur effect when app is open */}
      <div 
        className={`fixed inset-0 transition-all duration-300 ease-in-out ${
          isAppOpen ? 'backdrop-blur-sm bg-black/50' : 'bg-black/30'
        }`}
      />
      
      {/* Icons container */}
      <div className={`relative z-10 min-h-screen flex flex-col justify-end pb-16 transition-opacity duration-300 ${
        isAppOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
            <div
              onClick={() => navigate('/home/chatbox')}
              className="group relative cursor-pointer flex items-center justify-center"
            >
              <div className="text-cyan-500 transform transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="w-12 h-12" />
              </div>
            </div>
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

      {/* App container */}
      <div 
        className={`fixed inset-0 transition-all duration-300 ease-in-out ${
          isAppOpen ? 'opacity-100 z-50' : 'opacity-0 -z-10'
        }`}
      >
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className={`w-full transition-transform duration-300 ease-in-out ${
            isAppOpen ? 'translate-y-0' : 'translate-y-4'
          }`}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHomeLayout;
