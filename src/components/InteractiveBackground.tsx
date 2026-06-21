import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function InteractiveBackground() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [rippleCount, setRippleCount] = useState(0);

  const colors = [
    'rgba(255, 62, 0, 0.45)',  // brand-purple (#FF3E00)
    'rgba(0, 209, 255, 0.45)',  // brand-cyan (#00D1FF)
    'rgba(224, 255, 0, 0.45)',  // brand-rose (#E0FF00)
    'rgba(255, 214, 0, 0.45)'   // yellow (#FFD600)
  ];

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Find coordinates
      const x = e.clientX;
      const y = e.clientY;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newRipple: Ripple = {
        id: rippleCount,
        x,
        y,
        color: randomColor,
      };

      setRipples((prev) => [...prev.slice(-10), newRipple]); // keep only last 10
      setRippleCount((prev) => prev + 1);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [rippleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden bg-[#FFF5E1]">
      {/* Background Glowing Vector Orbs in Neobrutalist tones */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.12]"
        style={{ backgroundColor: '#FF3E00' }} 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[160px] opacity-[0.14]"
        style={{ backgroundColor: '#00D1FF' }} 
      />
      <div 
        className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-[0.08]"
        style={{ backgroundColor: '#E0FF00' }} 
      />

      {/* Grid Pattern overlay - dark ink color */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70"></div>

      {/* Render interactive click ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.9, scale: 0 }}
            animate={{ opacity: 0, scale: 3.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: ripple.color,
              border: '2px solid #000000',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              pointerEvents: 'none',
              transformOrigin: 'center center',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
