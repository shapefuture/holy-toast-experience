
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

    // Camera setup - positioned for tunnel view
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x8B4513, 1);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create tunnel geometry - circular tunnel
    const tunnelRadius = 8;
    const tunnelLength = 50;
    const tunnelSegments = 32;
    
    // Create tunnel walls
    const tunnelGeometry = new THREE.CylinderGeometry(
      tunnelRadius, tunnelRadius, tunnelLength, tunnelSegments, 1, true
    );
    
    // Create bread-like texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Golden brown bread texture
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    gradient.addColorStop(0, '#DAA520');
    gradient.addColorStop(0.5, '#B8860B');
    gradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add texture details
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 8 + 2;
      ctx.fillStyle = `rgba(${139 + Math.random() * 80}, ${69 + Math.random() * 80}, ${19 + Math.random() * 50}, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const breadTexture = new THREE.CanvasTexture(canvas);
    breadTexture.wrapS = THREE.RepeatWrapping;
    breadTexture.wrapT = THREE.RepeatWrapping;
    breadTexture.repeat.set(4, 8);
    
    const tunnelMaterial = new THREE.MeshPhongMaterial({
      map: breadTexture,
      side: THREE.BackSide,
      color: 0xCD853F
    });
    
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.x = Math.PI / 2;
    tunnel.position.z = -10;
    scene.add(tunnel);

    // Lighting setup - key for the golden effect
    const ambientLight = new THREE.AmbientLight(0xFFA500, 0.4);
    scene.add(ambientLight);

    // Bright light at the end of tunnel
    const endLight = new THREE.PointLight(0xFFFFFF, 3, 100);
    endLight.position.set(0, 0, -35);
    scene.add(endLight);

    // Additional golden lighting
    const goldenLight = new THREE.DirectionalLight(0xFFA500, 1.5);
    goldenLight.position.set(0, 10, 5);
    scene.add(goldenLight);

    // Create the bright end of tunnel
    const endGeometry = new THREE.CircleGeometry(tunnelRadius * 0.8, 32);
    const endMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.9
    });
    const tunnelEnd = new THREE.Mesh(endGeometry, endMaterial);
    tunnelEnd.position.set(0, 0, -35);
    scene.add(tunnelEnd);

    // Create Jesus toast at the end
    const jesusGeometry = new THREE.PlaneGeometry(3, 3);
    const jesusTexture = new THREE.TextureLoader().load('/lovable-uploads/5262d44d-60b0-4c39-a3d1-861421c6f1b1.png');
    const jesusMaterial = new THREE.MeshBasicMaterial({
      map: jesusTexture,
      transparent: true,
      alphaTest: 0.1
    });
    const jesusToast = new THREE.Mesh(jesusGeometry, jesusMaterial);
    jesusToast.position.set(0, 0, -34);
    scene.add(jesusToast);

    // Create floating bread pieces
    const breadPieces: THREE.Mesh[] = [];
    const breadGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    
    for (let i = 0; i < 80; i++) {
      const breadMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 0.8, 0.4 + Math.random() * 0.3)
      });
      
      const bread = new THREE.Mesh(breadGeometry, breadMaterial);
      
      // Position bread pieces throughout the tunnel
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (tunnelRadius - 1) + 1;
      const distance = Math.random() * 40 - 20;
      
      bread.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        distance
      );
      
      bread.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      breadPieces.push(bread);
      scene.add(bread);
    }

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.3) * 0.5;
      camera.position.y = Math.cos(time * 0.2) * 0.3;

      // Animate floating bread
      breadPieces.forEach((bread, index) => {
        bread.rotation.x += 0.005;
        bread.rotation.y += 0.008;
        bread.rotation.z += 0.003;
        
        // Gentle floating motion
        bread.position.x += Math.sin(time + index) * 0.002;
        bread.position.y += Math.cos(time + index * 0.5) * 0.002;
      });

      // Animate tunnel end light
      endLight.intensity = 2.5 + Math.sin(time * 2) * 0.5;
      
      // Animate Jesus toast
      jesusToast.rotation.z = Math.sin(time * 0.5) * 0.05;

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
    
    setTimeout(() => setIsLoading(false), 1000);

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
    toast("🎵 Divine audio activated! 🍞✨");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-orange-900 to-yellow-800">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Loading screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-yellow-800 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-pulse">🍞</div>
            <div className="text-2xl font-bold mb-2">Loading Sacred Experience...</div>
            <div className="text-lg opacity-75">Preparing the divine bread tunnel</div>
          </div>
        </div>
      )}

      {/* Audio controls */}
      {!audioStarted && !isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="text-center text-white p-8 rounded-lg bg-gradient-to-b from-orange-800 to-yellow-700">
            <div className="text-4xl mb-4">🍞✨</div>
            <h2 className="text-2xl font-bold mb-4">Enter the Sacred Bread Realm</h2>
            <p className="mb-6">Click to begin your divine Cheesus Crust experience</p>
            <button
              onClick={startAudio}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎵 Begin Sacred Journey 🍞
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
        <h1 className="text-2xl font-bold mb-2 text-shadow-lg">🍞 Cheesus Crust Experience ✨</h1>
        <p className="text-sm opacity-75">Move through the sacred bread tunnel</p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-white text-sm opacity-75 z-30">
        <p>🎵 Divine audio playing</p>
        <p>📱 Optimized for mobile</p>
      </div>
    </div>
  );
};

export default Index;
