import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, Terminal as TerminalIcon } from 'lucide-react';

const NewHomeLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-deep-sea-blue overflow-hidden">
      {/* Background image with proper opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/lovable-uploads/73e97728-d0f0-4a4f-8e49-34667bc28380.png')" }}
      />
      
      {/* Content container - fixed at bottom */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
            {/* Chatbox App */}
            <div
              onClick={() => navigate('/home/chatbox', { replace: true })}
              className="group relative cursor-pointer flex items-center justify-center"
            >
              <div className="text-cyan-500 transform transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="w-12 h-12" />
              </div>
            </div>
            {/* Terminal App */}
            <div
              onClick={() => navigate('/home/terminal', { replace: true })}
              className="group relative cursor-pointer flex items-center justify-center"
            >
              <div className="text-purple-500 transform transition-transform duration-300 group-hover:scale-110">
                <TerminalIcon className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay container for nested routes with improved transition handling */}
      <div className="fixed inset-0 z-20">
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHomeLayout;