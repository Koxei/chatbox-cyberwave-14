import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const GlitchTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  useEffect(() => {
    const captureAndTransition = async () => {
      setIsTransitioning(true);
      
      // Capture the current page state
      try {
        const content = document.documentElement;
        const canvas = await html2canvas(content);
        setSnapshot(canvas.toDataURL());
      } catch (error) {
        console.error('Failed to capture page:', error);
      }

      // Reset after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setSnapshot(null);
      }, 1000);
    };

    captureAndTransition();
  }, [location]);

  if (!isTransitioning || !snapshot) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className="glitch-container w-full h-full"
        style={{ 
          backgroundImage: `url(${snapshot})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="glitch-layers">
          <div className="glitch-layer" />
          <div className="glitch-layer" />
          <div className="glitch-layer" />
        </div>
      </div>
    </div>
  );
};