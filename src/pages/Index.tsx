
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
    scene.fog = new THREE.Fog(0xffa500, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup with mobile optimization
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for mobile performance
      powerPreference: "high-performance",
      precision: "mediump"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x8B4513, 1);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffa500, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Point light for dramatic effect
    const pointLight = new THREE.PointLight(0xffd700, 2, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create bread texture
    const textureLoader = new THREE.TextureLoader();
    const breadTexture = new THREE.CanvasTexture(createBreadTexture());
    breadTexture.wrapS = THREE.RepeatWrapping;
    breadTexture.wrapT = THREE.RepeatWrapping;
    breadTexture.repeat.set(2, 2);

    // Create tunnel walls with bread texture
    const tunnelGeometry = new THREE.CylinderGeometry(8, 8, 100, 32, 1, true);
    const tunnelMaterial = new THREE.MeshPhongMaterial({
      map: breadTexture,
      side: THREE.BackSide,
      shininess: 30
    });
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.x = Math.PI / 2;
    scene.add(tunnel);

    // Create Jesus toast at the end
    const jesusToastGeometry = new THREE.PlaneGeometry(4, 4);
    const jesusToastTexture = new THREE.TextureLoader().load('/lovable-uploads/5262d44d-60b0-4c39-a3d1-861421c6f1b1.png');
    const jesusToastMaterial = new THREE.MeshPhongMaterial({
      map: jesusToastTexture,
      transparent: true,
      alphaTest: 0.1
    });
    const jesusToast = new THREE.Mesh(jesusToastGeometry, jesusToastMaterial);
    jesusToast.position.set(0, 0, -45);
    scene.add(jesusToast);

    // Add glowing effect around Jesus
    const glowGeometry = new THREE.PlaneGeometry(6, 6);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, 0, -44.9);
    scene.add(glow);

    // Create floating bread pieces
    const breadPieces: THREE.Mesh[] = [];
    for (let i = 0; i < 50; i++) {
      const breadGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.2);
      const breadMaterial = new THREE.MeshPhongMaterial({
        color: 0xDAA520,
        map: breadTexture
      });
      const bread = new THREE.Mesh(breadGeometry, breadMaterial);
      
      bread.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        Math.random() * -40 - 5
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
    let cameraMovement = 0;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth camera movement
      cameraMovement += 0.02;
      camera.position.z = 5 + Math.sin(cameraMovement * 0.5) * 2;
      camera.position.x = Math.sin(cameraMovement * 0.3) * 0.5;
      camera.position.y = Math.cos(cameraMovement * 0.2) * 0.3;

      // Rotate tunnel slowly
      tunnel.rotation.z += 0.005;

      // Animate Jesus toast
      jesusToast.rotation.z = Math.sin(time) * 0.1;
      jesusToast.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      // Animate glow
      glow.rotation.z += 0.01;
      glow.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;

      // Animate floating bread
      breadPieces.forEach((bread, index) => {
        bread.rotation.x += 0.01;
        bread.rotation.y += 0.02;
        bread.position.y += Math.sin(time + index) * 0.01;
      });

      // Animate lights
      pointLight.intensity = 2 + Math.sin(time * 2) * 0.5;
      pointLight.color.setHSL(0.15, 1, 0.5 + Math.sin(time) * 0.2);

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

  // Create bread texture programmatically
  const createBreadTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base bread color
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(0, 0, 256, 256);

    // Add bread texture details
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = Math.random() * 10 + 2;
      
      ctx.fillStyle = `rgba(${160 + Math.random() * 50}, ${100 + Math.random() * 50}, ${50 + Math.random() * 30}, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add crust edges
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 256, 20);
    ctx.fillRect(0, 236, 256, 20);
    ctx.fillRect(0, 0, 20, 256);
    ctx.fillRect(236, 0, 20, 256);

    return canvas;
  };

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
