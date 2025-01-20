import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GlitchTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Duration of the glitch effect

    return () => clearTimeout(timer);
  }, [location]);

  if (!isTransitioning) return null;

  return (
    <div className="glitch-transition">
      <div className="glitch-layers">
        <div className="glitch-layer" />
        <div className="glitch-layer" />
        <div className="glitch-layer" />
      </div>
    </div>
  );
};

export default GlitchTransition;