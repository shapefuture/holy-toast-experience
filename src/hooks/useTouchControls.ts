
import { useState, useEffect } from 'react';

interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export const useTouchControls = () => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>({ x: 0, y: 0, z: 15 });

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      
      const deltaX = (touchX - touchStartX) * 0.01;
      const deltaY = (touchY - touchStartY) * 0.01;
      
      setCameraPosition(prev => ({
        x: Math.max(-8, Math.min(8, prev.x + deltaX)),
        y: Math.max(-4, Math.min(4, prev.y - deltaY)),
        z: prev.z
      }));
      
      touchStartX = touchX;
      touchStartY = touchY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return { cameraPosition, setCameraPosition };
};
