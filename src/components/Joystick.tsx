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
      const maxDistance = 30;
      
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
    <div className="fixed bottom-6 left-4 z-50 md:hidden">
      <div className="flex gap-3 items-end">
        <div
          ref={joystickRef}
          className="relative w-24 h-24 bg-black/30 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-lg"
        >
          <div
            className="absolute top-1/2 left-1/2 w-10 h-10 bg-white/40 rounded-full shadow-md transition-transform"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
            }}
          />
        </div>
        
        <button
          onClick={onAction}
          className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-lg active:scale-95 transition-all flex items-center justify-center text-white/60 font-montserrat text-lg"
        >
          E
        </button>
      </div>
    </div>
  );
};

export default Joystick;
