
import { useState, useEffect } from 'react';

interface DeviceOrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

export const useDeviceOrientation = () => {
  const [deviceOrientation, setDeviceOrientation] = useState<DeviceOrientationData>({ 
    alpha: 0, 
    beta: 0, 
    gamma: 0 
  });

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    const requestOrientationPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (error) {
          console.log('Device orientation permission denied');
        }
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    requestOrientationPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return deviceOrientation;
};
