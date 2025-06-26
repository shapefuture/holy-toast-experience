
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { toast } from 'sonner';

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8B4513);
    sceneRef.current = scene;

    // Camera setup - positioned inside the tunnel looking toward Jesus
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
    renderer.setClearColor(0x4A4A4A, 1);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create toast texture from uploaded images
    const textureLoader = new THREE.TextureLoader();
    
    // Load Jesus toast texture
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

    // Create toast pieces for walls
    const toastGeometry = new THREE.PlaneGeometry(toastSize - 0.1, toastSize - 0.1);
    
    // Left wall
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2)
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          -tunnelWidth / 2,
          row * toastSize - tunnelHeight / 2 + toastSize / 2,
          -col * toastSize
        );
        toast.rotation.y = Math.PI / 2;
        scene.add(toast);
      }
    }

    // Right wall
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2)
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          tunnelWidth / 2,
          row * toastSize - tunnelHeight / 2 + toastSize / 2,
          -col * toastSize
        );
        toast.rotation.y = -Math.PI / 2;
        scene.add(toast);
      }
    }

    // Top wall
    for (let row = 0; row < Math.floor(tunnelWidth / toastSize); row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2)
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          row * toastSize - tunnelWidth / 2 + toastSize / 2,
          tunnelHeight / 2,
          -col * toastSize
        );
        toast.rotation.x = Math.PI / 2;
        scene.add(toast);
      }
    }

    // Bottom wall
    for (let row = 0; row < Math.floor(tunnelWidth / toastSize); row++) {
      for (let col = 0; col < Math.floor(tunnelDepth / toastSize); col++) {
        const toastMaterial = new THREE.MeshPhongMaterial({
          map: breadTexture.clone(),
          color: new THREE.Color().setHSL(0.08, 0.7, 0.6 + Math.random() * 0.2)
        });
        
        const toast = new THREE.Mesh(toastGeometry, toastMaterial);
        toast.position.set(
          row * toastSize - tunnelWidth / 2 + toastSize / 2,
          -tunnelHeight / 2,
          -col * toastSize
        );
        toast.rotation.x = -Math.PI / 2;
        scene.add(toast);
      }
    }

    // Create the glowing Jesus toast at the end
    const jesusGeometry = new THREE.PlaneGeometry(6, 6);
    const jesusMaterial = new THREE.MeshBasicMaterial({
      map: jesusTexture,
      transparent: true,
      alphaTest: 0.1
    });
    const jesusToast = new THREE.Mesh(jesusGeometry, jesusMaterial);
    jesusToast.position.set(0, 0, -tunnelDepth + 5);
    scene.add(jesusToast);

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
    const ambientLight = new THREE.AmbientLight(0xFFAA55, 0.4);
    scene.add(ambientLight);

    // Strong light from Jesus position
    const jesusLight = new THREE.PointLight(0xFFFFFF, 2, 50);
    jesusLight.position.set(0, 0, -tunnelDepth + 10);
    scene.add(jesusLight);

    // Warm directional light
    const directionalLight = new THREE.DirectionalLight(0xFFAA55, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Add some floating bread crumbs
    const crumbGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    for (let i = 0; i < 50; i++) {
      const crumbMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08, 0.8, 0.7)
      });
      
      const crumb = new THREE.Mesh(crumbGeometry, crumbMaterial);
      crumb.position.set(
        (Math.random() - 0.5) * tunnelWidth * 0.8,
        (Math.random() - 0.5) * tunnelHeight * 0.8,
        -Math.random() * tunnelDepth
      );
      scene.add(crumb);
    }

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.2) * 0.3;
      camera.position.y = Math.cos(time * 0.15) * 0.2;
      
      // Pulsing glow effect
      glow.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
      
      // Pulsing Jesus light
      jesusLight.intensity = 1.8 + Math.sin(time * 2) * 0.4;

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
  }, []);

  const startAudio = () => {
    setAudioStarted(true);
    toast("🎵 Divine audio activated! Behold the sacred bread tunnel! 🍞✨");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-orange-900 to-yellow-800">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Loading screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-yellow-800 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-pulse">🍞</div>
            <div className="text-2xl font-bold mb-2">Constructing Sacred Bread Tunnel...</div>
            <div className="text-lg opacity-75">Preparing to meet Cheesus Crust</div>
          </div>
        </div>
      )}

      {/* Audio controls */}
      {!audioStarted && !isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="text-center text-white p-8 rounded-lg bg-gradient-to-b from-orange-800 to-yellow-700">
            <div className="text-4xl mb-4">🍞✨</div>
            <h2 className="text-2xl font-bold mb-4">Enter the Sacred Bread Realm</h2>
            <p className="mb-6">Click to begin your divine Cheesus Crust pilgrimage</p>
            <button
              onClick={startAudio}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎵 Enter Sacred Tunnel 🍞
            </button>
          </div>
        </div>
      )}

      {/* YouTube audio (hidden) */}
      {audioStarted && (
        <iframe
          className="absolute -left-full -top-full opacity-0 pointer-events-none"
          width="1"
          height="1"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&playlist=dQw4w9WgXcQ&controls=0"
          allow="autoplay"
          title="Sacred Audio"
        />
      )}

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white z-30">
        <h1 className="text-2xl font-bold mb-2 text-shadow-lg">🍞 Sacred Bread Tunnel ✨</h1>
        <p className="text-sm opacity-75">Journey toward Cheesus Crust</p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-white text-sm opacity-75 z-30">
        <p>🎵 Divine audio playing</p>
        <p>📱 Mobile optimized</p>
      </div>
    </div>
  );
};

export default Index;
