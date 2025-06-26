
import * as THREE from 'three';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2D1810);
  return scene;
};

export const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 15);
  return camera;
};

export const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x2D1810, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
};

export const createLights = (scene: THREE.Scene, tunnelDepth: number) => {
  const ambientLight = new THREE.AmbientLight(0xFFAA55, 0.3);
  scene.add(ambientLight);

  const jesusLight = new THREE.PointLight(0xFFFFFF, 3, 50);
  jesusLight.position.set(0, 0, -tunnelDepth + 10);
  jesusLight.castShadow = true;
  jesusLight.shadow.mapSize.width = 1024;
  jesusLight.shadow.mapSize.height = 1024;
  scene.add(jesusLight);

  const directionalLight = new THREE.DirectionalLight(0xFFAA55, 0.6);
  directionalLight.position.set(0, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  return { ambientLight, jesusLight, directionalLight };
};
