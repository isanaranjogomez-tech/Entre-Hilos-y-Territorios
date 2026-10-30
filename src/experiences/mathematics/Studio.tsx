import { useMemo } from 'react';
import * as THREE from 'three';

/** Soft radial blob under the bag: ambient occlusion where it touches the floor. */
function useBlobTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(40,20,20,0.55)');
    grad.addColorStop(0.55, 'rgba(40,20,20,0.18)');
    grad.addColorStop(1, 'rgba(40,20,20,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
}

/**
 * Product-photography studio: warm key light with a soft shadow, cool fill,
 * rim light from behind, and a shadow-catching floor that stays invisible.
 */
export function Studio({ shadows = true }: { shadows?: boolean }) {
  const blob = useBlobTexture();
  return (
    <>
      <hemisphereLight args={['#fff6ea', '#c9a98a', 0.85]} />
      <directionalLight
        position={[-3.5, 5, 4.5]}
        intensity={2.3}
        color="#fff3e2"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <directionalLight position={[4, 1.5, 3]} intensity={0.7} color="#dfeff2" />
      <directionalLight position={[2.5, 3, -4]} intensity={1.4} color="#ffd9b0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.16, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={0.16} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.155, 0]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={blob} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
