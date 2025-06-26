
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { toast } from 'sonner';

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();
  const audioRef = useRef<HTMLIFrameElement>(null);
  const jesusRef = useRef<THREE.Mesh | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 15 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2D1810);
    sceneRef.current = scene;

    // Camera setup - positioned inside the tunnel
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x2D1810, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load Jesus toast texture with proper blending
    const jesusTexture = textureLoader.load('/lovable-uploads/da8f0cd0-19c0-4515-aac5-50ae29e1f9b3.png');
    
    // Load regular bread texture for walls
    const breadTexture = textureLoader.load('/lovable-uploads/244d75e6-4ea0-4c09-80c6-67ed074e83a1.png');
    
    // Tunnel dimensions
    const tunnelWidth = 20;
    const tunnelHeight = 12;
    const tunnelDepth = 40;
    const toastSize = 2;
    const rows = Math.floor(tunnelHeight / toastSize);
    const cols = Math.floor(tunnelWidth / toastSize);

    // Create toast pieces for walls with proper material
    const toastGeometry = new THREE.PlaneGeometry(toastSize - 0.1, toastSize - 0.1);
    
    // Left wall
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          transparent: true,
          alphaTest: 0.1,
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2),
          side: THREE.DoubleSide
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          -tunnelWidth / 2,
          row * toastSize - tunnelHeight / 2 + toastSize / 2,
          -col * toastSize
        );
        toast.rotation.y = Math.PI / 2;
        toast.castShadow = true;
        toast.receiveShadow = true;
        scene.add(toast);
      }
    }

    // Right wall
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          transparent: true,
          alphaTest: 0.1,
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2),
          side: THREE.DoubleSide
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          tunnelWidth / 2,
          row * toastSize - tunnelHeight / 2 + toastSize / 2,
          -col * toastSize
        );
        toast.rotation.y = -Math.PI / 2;
        toast.castShadow = true;
        toast.receiveShadow = true;
        scene.add(toast);
      }
    }

    // Top wall
    for (let row = 0; row < Math.floor(tunnelWidth / toastSize); row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          transparent: true,
          alphaTest: 0.1,
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2),
          side: THREE.DoubleSide
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          row * toastSize - tunnelWidth / 2 + toastSize / 2,
          tunnelHeight / 2,
          -col * toastSize
        );
        toast.rotation.x = Math.PI / 2;
        toast.castShadow = true;
        toast.receiveShadow = true;
        scene.add(toast);
      }
    }

    // Bottom wall
    for (let row = 0; row < Math.floor(tunnelWidth / toastSize); row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          transparent: true,
          alphaTest: 0.1,
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2),
          side: THREE.DoubleSide
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          row * toastSize - tunnelWidth / 2 + toastSize / 2,
          -tunnelHeight / 2,
          -col * toastSize
        );
        toast.rotation.x = -Math.PI / 2;
        toast.castShadow = true;
        toast.receiveShadow = true;
        scene.add(toast);
      }
    }

    // Back wall (close the tunnel)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          transparent: true,
          alphaTest: 0.1,
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2),
          side: THREE.DoubleSide
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          col * toastSize - tunnelWidth / 2 + toastSize / 2,
          row * toastSize - tunnelHeight / 2 + toastSize / 2,
          -tunnelDepth + 1
        );
        toast.castShadow = true;
        toast.receiveShadow = true;
        scene.add(toast);
      }
    }

    // Create the rotating Jesus toast at the end with proper blending
    const jesusGeometry = new THREE.PlaneGeometry(6, 6);
    const jesusMaterial = new THREE.MeshBasicMaterial({
      map: jesusTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });
    const jesusToast = new THREE.Mesh(jesusGeometry, jesusMaterial);
    jesusToast.position.set(0, 0, -tunnelDepth + 5);
    scene.add(jesusToast);
    jesusRef.current = jesusToast;

    // Create divine light behind Jesus
    const divineGeometry = new THREE.RingGeometry(3, 8, 32);
    const divineMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFAA,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const divineLight = new THREE.Mesh(divineGeometry, divineMaterial);
    divineLight.position.set(0, 0, -tunnelDepth + 4.8);
    scene.add(divineLight);

    // Create bright glow around Jesus
    const glowGeometry = new THREE.PlaneGeometry(8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFAA,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, 0, -tunnelDepth + 4.9);
    scene.add(glow);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xFFAA55, 0.3);
    scene.add(ambientLight);

    // Strong light from Jesus position
    const jesusLight = new THREE.PointLight(0xFFFFFF, 3, 50);
    jesusLight.position.set(0, 0, -tunnelDepth + 10);
    jesusLight.castShadow = true;
    jesusLight.shadow.mapSize.width = 1024;
    jesusLight.shadow.mapSize.height = 1024;
    scene.add(jesusLight);

    // Warm directional light
    const directionalLight = new THREE.DirectionalLight(0xFFAA55, 0.6);
    directionalLight.position.set(0, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Apply device orientation to camera rotation
      if (cameraRef.current) {
        const camera = cameraRef.current;
        
        // Convert device orientation to radians and apply to camera
        camera.rotation.x = (deviceOrientation.beta * Math.PI) / 180;
        camera.rotation.y = (deviceOrientation.alpha * Math.PI) / 180;
        camera.rotation.z = (deviceOrientation.gamma * Math.PI) / 180;
        
        // Update camera position based on movement
        camera.position.x = cameraPosition.x;
        camera.position.y = cameraPosition.y;
        camera.position.z = cameraPosition.z;
      }

      // Rotate Jesus slowly
      if (jesusRef.current) {
        jesusRef.current.rotation.z = time * 0.2;
      }
      
      // Pulsing glow effect
      glow.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
      divineLight.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      
      // Pulsing Jesus light
      jesusLight.intensity = 2.5 + Math.sin(time * 2) * 0.8;

      // Update spatial audio volume based on distance to Jesus
      if (audioRef.current && audioStarted) {
        const distance = Math.abs(cameraPosition.z + tunnelDepth - 5);
        const volume = Math.max(0.1, Math.min(1, 1 - distance / 30));
        // Note: YouTube iframe doesn't allow direct volume control
        // This is a placeholder for spatial audio logic
      }

      renderer.render(scene, camera);
    };

    // Device orientation controls
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    // Touch controls for movement
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

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Request device orientation permission for iOS
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    animate();
    requestOrientationPermission();
    
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
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
      
      {/* Loading screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-yellow-800 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-pulse">🍞</div>
            <div className="text-2xl font-bold mb-2">Constructing Sacred AR Bread Tunnel...</div>
            <div className="text-lg opacity-75">Preparing immersive Cheesus Crust experience</div>
          </div>
        </div>
      )}

      {/* Audio controls */}
      {!audioStarted && !isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="text-center text-white p-8 rounded-lg bg-gradient-to-b from-orange-800 to-yellow-700">
            <div className="text-4xl mb-4">🍞✨</div>
            <h2 className="text-2xl font-bold mb-4">Enter the Sacred AR Bread Realm</h2>
            <p className="mb-6">Move your device to explore the divine tunnel</p>
            <button
              onClick={startAudio}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎵 Enter Sacred AR Tunnel 🍞
            </button>
          </div>
        </div>
      )}

      {/* Hidden YouTube audio with spatial audio */}
      {audioStarted && (
        <iframe
          ref={audioRef}
          className="absolute -left-full -top-full opacity-0 pointer-events-none w-1 h-1"
          src="https://www.youtube.com/embed/f6O0Ye5BPBk?autoplay=1&loop=1&playlist=f6O0Ye5BPBk&controls=0&mute=0"
          allow="autoplay"
          title="Sacred Audio"
        />
      )}

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white z-30">
        <h1 className="text-2xl font-bold mb-2 text-shadow-lg">🍞 Sacred AR Bread Tunnel ✨</h1>
        <p className="text-sm opacity-75">Move your device to explore</p>
      </div>

      {/* AR Controls hint */}
      <div className="absolute bottom-4 right-4 text-white text-sm opacity-75 z-30">
        <p>📱 Tilt device to look around</p>
        <p>👆 Touch & drag to move</p>
        <p>🎵 Spatial divine audio</p>
      </div>
    </div>
  );
};

export default Index;
