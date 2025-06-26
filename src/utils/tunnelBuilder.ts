
import * as THREE from 'three';

interface TunnelConfig {
  width: number;
  height: number;
  depth: number;
  toastSize: number;
}

export const createTunnelWalls = (
  scene: THREE.Scene, 
  breadTexture: THREE.Texture, 
  config: TunnelConfig
) => {
  const { width: tunnelWidth, height: tunnelHeight, depth: tunnelDepth, toastSize } = config;
  const toastGeometry = new THREE.PlaneGeometry(toastSize - 0.1, toastSize - 0.1);
  const rows = Math.floor(tunnelHeight / toastSize);
  const cols = Math.floor(tunnelWidth / toastSize);

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

  // Back wall
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
};

export const createJesusElements = (scene: THREE.Scene, jesusTexture: THREE.Texture, tunnelDepth: number) => {
  // Create the rotating Jesus toast
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

  return { jesusToast, divineLight, glow };
};
