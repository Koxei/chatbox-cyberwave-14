import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0);

    let frameId: number;
    let lastFrame = 0;
    const fps = 15; // Slower animation
    const frameInterval = 1000 / fps;

    const draw = (timestamp: number) => {
      if (timestamp - lastFrame < frameInterval) {
        frameId = requestAnimationFrame(draw);
        return;
      }
      
      lastFrame = timestamp;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#7FDBFF'; // Cyan color to match MICA text
      ctx.font = `${fontSize}px "Press Start 2P"`;
      
      // Only draw in the middle 60% of the canvas width
      const startColumn = Math.floor(columns * 0.2);
      const endColumn = Math.floor(columns * 0.8);
      
      for (let i = startColumn; i < endColumn; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(char, x, y);
        
        if (y > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixRain;
