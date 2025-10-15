import { useEffect, useRef, useState } from 'react';

interface JoystickProps {
  onMove: (direction: { x: number; y: number }) => void;
  onAction: () => void;
}

const Joystick = ({ onMove, onAction }: JoystickProps) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !joystickRef.current) return;
      
      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 40;
      
      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        setPosition({
          x: Math.cos(angle) * maxDistance,
          y: Math.sin(angle) * maxDistance
        });
      } else {
        setPosition({ x: deltaX, y: deltaY });
      }
      
      onMove({
        x: deltaX / maxDistance,
        y: deltaY / maxDistance
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
      onMove({ x: 0, y: 0 });
    };

    if (joystickRef.current) {
      joystickRef.current.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, onMove]);

  return (
    <div className="fixed bottom-8 left-8 z-50 md:hidden">
      <div className="flex gap-4 items-end">
        <div
          ref={joystickRef}
          className="relative w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full border-4 border-white/40 shadow-2xl"
        >
          <div
            className="absolute top-1/2 left-1/2 w-12 h-12 bg-cookie-pink rounded-full shadow-lg transition-transform"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white/50 font-montserrat text-xs">
            Движение
          </div>
        </div>
        
        <button
          onClick={onAction}
          className="w-20 h-20 bg-purple-magic backdrop-blur-lg rounded-full border-4 border-white/40 shadow-2xl active:scale-95 transition-transform flex items-center justify-center text-white font-caveat text-2xl"
        >
          E
        </button>
      </div>
    </div>
  );
};

export default Joystick;
