import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { WayuuMochila3D } from './WayuuMochila3D';
import { Studio } from './Studio';
import type { OverlayKey } from './textile';

function Turntable({ speed }: { speed: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * speed;
  });
  const overlay = useMemo(() => ({ current: 'none' as OverlayKey }), []);
  return (
    <group ref={g} rotation={[0, -0.9, 0]}>
      <WayuuMochila3D overlay={overlay} />
    </group>
  );
}

/** Homepage preview of the reconstruction on a slow turntable; renders only while visible. */
export default function MochilaPreview({ hovered }: { hovered: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  return (
    <div ref={box} className="absolute inset-0">
      <Canvas flat shadows dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} camera={{ fov: 30, position: [0, 0.7, 8.6] }} onCreated={({ camera }) => camera.lookAt(0, 0.55, 0)} aria-hidden>
        <Studio />
        <Turntable speed={reduced ? 0 : hovered ? 0.9 : 0.22} />
      </Canvas>
    </div>
  );
}
