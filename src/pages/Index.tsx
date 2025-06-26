
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { toast } from 'sonner';
import { createScene, createCamera, createRenderer, createLights } from '../utils/sceneSetup';
import { createTunnelWalls, createJesusElements } from '../utils/tunnelBuilder';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { useTouchControls } from '../hooks/useTouchControls';
import LoadingScreen from '../components/LoadingScreen';
import AudioControls from '../components/AudioControls';
import UIOverlay from '../components/UIOverlay';
import SpatialAudio from '../components/SpatialAudio';

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();
  const jesusRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const divineLightRef = useRef<THREE.Mesh | null>(null);
  const jesusLightRef = useRef<THREE.PointLight | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  
  const deviceOrientation = useDeviceOrientation();
  const { cameraPosition } = useTouchControls();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = createScene();
    sceneRef.current = scene;

    const camera = createCamera();
    cameraRef.current = camera;

    const renderer = createRenderer();
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Tunnel configuration
    const tunnelConfig = {
      width: 20,
      height: 12,
      depth: 40,
      toastSize: 2
    };

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures
    const jesusTexture = textureLoader.load('/lovable-uploads/da8f0cd0-19c0-4515-aac5-50ae29e1f9b3.png');
    const breadTexture = textureLoader.load('/lovable-uploads/244d75e6-4ea0-4c09-80c6-67ed074e83a1.png');

    // Build tunnel
    createTunnelWalls(scene, breadTexture, tunnelConfig);
    
    // Create Jesus elements
    const { jesusToast, divineLight, glow } = createJesusElements(scene, jesusTexture, tunnelConfig.depth);
    jesusRef.current = jesusToast;
    glowRef.current = glow;
    divineLightRef.current = divineLight;

    // Setup lighting
    const { jesusLight } = createLights(scene, tunnelConfig.depth);
    jesusLightRef.current = jesusLight;

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Apply device orientation to camera rotation
      if (cameraRef.current) {
        const camera = cameraRef.current;
        
        camera.rotation.x = (deviceOrientation.beta * Math.PI) / 180;
        camera.rotation.y = (deviceOrientation.alpha * Math.PI) / 180;
        camera.rotation.z = (deviceOrientation.gamma * Math.PI) / 180;
        
        camera.position.x = cameraPosition.x;
        camera.position.y = cameraPosition.y;
        camera.position.z = cameraPosition.z;
      }

      // Rotate Jesus slowly
      if (jesusRef.current) {
        jesusRef.current.rotation.z = time * 0.2;
      }
      
      // Pulsing glow effects
      if (glowRef.current) {
        glowRef.current.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
      }
      if (divineLightRef.current) {
        divineLightRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      }
      
      // Pulsing Jesus light
      if (jesusLightRef.current) {
        jesusLightRef.current.intensity = 2.5 + Math.sin(time * 2) * 0.8;
      }

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    
    animate();
    
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [deviceOrientation, cameraPosition]);

  const startAudio = () => {
    setAudioStarted(true);
    toast("🎵 Divine audio activated! Experience the sacred AR bread tunnel! 🍞✨");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-orange-900 to-yellow-800">
      <div ref={mountRef} className="w-full h-full" />
      
      <LoadingScreen isLoading={isLoading} />
      <AudioControls 
        audioStarted={audioStarted} 
        isLoading={isLoading} 
        onStartAudio={startAudio} 
      />
      <SpatialAudio audioStarted={audioStarted} />
      <UIOverlay />
    </div>
  );
};

export default Index;
