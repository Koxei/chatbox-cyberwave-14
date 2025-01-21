// src/components/layouts/AppOverlay.tsx

import React, { useState } from 'react';

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

<>
  {/* Full-screen overlay with only fade-in animation */}
  <div 
    className="fixed inset-0 backdrop-blur-md bg-black/30 z-[40] animate-fade-in"
  />
  {/* Content container */}
  <div 
    className="animate-fade-in backdrop-blur-md rounded-lg border border-red-500 shadow-lg overflow-hidden z-[50] relative"
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

