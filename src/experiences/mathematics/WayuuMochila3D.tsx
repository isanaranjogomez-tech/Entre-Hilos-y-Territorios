import { forwardRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, PROFILE_POINTS, TEX_H, TEX_W, drawOverlay, getMochilaTextures, type OverlayKey } from './textile';

interface Props {
  /** Overlay to show on the textile; changes fade out, redraw, fade in. */
  overlay: { current: OverlayKey };
}

const SEGMENTS = 160;

/** Striped texture for the strap and cords (woven along their length). */
function stripeTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 8;
  const g = c.getContext('2d')!;
  const cols = [COLORS.pink, COLORS.yellow, COLORS.pink, COLORS.turquoise, COLORS.pink, COLORS.blue];
  cols.forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect((i * 64) / cols.length, 0, 64 / cols.length + 1, 8);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(40, 1);
  return t;
}

/**
 * Procedural Wayuu mochila (visual reconstruction). One instance lives for the
 * whole guided sequence; only the overlay texture and transforms change.
 */
export const WayuuMochila3D = forwardRef<THREE.Group, Props>(function WayuuMochila3D({ overlay }, ref) {
  const { map, bump } = getMochilaTextures();

  const body = useMemo(() => new THREE.LatheGeometry(PROFILE_POINTS, SEGMENTS), []);

  const overlayCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = TEX_W;
    c.height = TEX_H;
    return c;
  }, []);
  const overlayTex = useMemo(() => {
    const t = new THREE.CanvasTexture(overlayCanvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }, [overlayCanvas]);
  const overlayMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: overlayTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        toneMapped: false,
      }),
    [overlayTex],
  );

  const strap = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.97, 1.02, 0.02),
      new THREE.Vector3(-1.02, 1.55, 0.04),
      new THREE.Vector3(-0.78, 2.12, 0.06),
      new THREE.Vector3(0, 2.38, 0.07),
      new THREE.Vector3(0.78, 2.12, 0.06),
      new THREE.Vector3(1.02, 1.55, 0.04),
      new THREE.Vector3(0.97, 1.02, 0.02),
    ]);
    const geo = new THREE.TubeGeometry(curve, 160, 0.055, 10, false);
    geo.scale(1, 1, 0.55); // flatten into a woven band
    return geo;
  }, []);
  const stripes = useMemo(stripeTexture, []);

  const cords = useMemo(() => {
    const mk = (pts: [number, number, number][]) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 40, 0.016, 6, false);
    return [
      mk([[-0.62, 1.12, 0.74], [-0.82, 1.0, 0.86], [-0.98, 0.72, 0.82], [-1.06, 0.42, 0.74]]),
      mk([[-0.7, 1.12, 0.66], [-0.92, 0.98, 0.72], [-1.12, 0.66, 0.62], [-1.2, 0.36, 0.52]]),
    ];
  }, []);

  const tassel = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.008, 0.008, 0.62, 4);
    geo.translate(0, -0.31, 0);
    return geo;
  }, []);
  const tasselStrands = useMemo(() => {
    const cols = [COLORS.pink, COLORS.yellow, COLORS.turquoise, COLORS.blue];
    return Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return { a, r: 0.035 + (i % 3) * 0.012, tilt: 0.05 + (i % 4) * 0.025, color: cols[i % cols.length] };
    });
  }, []);

  // Release GPU resources owned by this instance.
  useEffect(
    () => () => {
      body.dispose();
      overlayTex.dispose();
      overlayMat.dispose();
      strap.dispose();
      stripes.dispose();
      cords.forEach((c) => c.dispose());
      tassel.dispose();
    },
    [body, overlayTex, overlayMat, strap, stripes, cords, tassel],
  );

  // Overlay state machine: fade out → redraw → fade in. Sequences that share a
  // prefix (rep-1 → rep-2 …) redraw in place.
  const state = useMemo(() => ({ shown: 'none' as OverlayKey }), []);
  useFrame((_, dt) => {
    const want = overlay.current;
    const k = 1 - Math.exp(-dt * 7);
    if (want !== state.shown) {
      const sameFamily = want.split('-')[0] === state.shown.split('-')[0] && want !== 'none';
      if (sameFamily || overlayMat.opacity < 0.03) {
        drawOverlay(overlayCanvas.getContext('2d')!, want);
        overlayTex.needsUpdate = true;
        state.shown = want;
      } else {
        overlayMat.opacity += (0 - overlayMat.opacity) * k;
      }
    } else {
      const target = want === 'none' ? 0 : 1;
      overlayMat.opacity += (target - overlayMat.opacity) * k;
    }
  });

  return (
    <group ref={ref}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial map={map} bumpMap={bump} bumpScale={1.6} roughness={0.92} metalness={0} />
      </mesh>
      <mesh geometry={body} material={overlayMat} scale={1.004} renderOrder={2} />

      {/* Gathered opening */}
      <mesh position={[0, 1.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial color="#5c1030" roughness={1} />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.955, 0.026, 10, 120]} />
        <meshStandardMaterial map={stripes} roughness={0.95} />
      </mesh>

      {/* Strap */}
      <mesh geometry={strap} castShadow>
        <meshStandardMaterial map={stripes} bumpMap={bump} bumpScale={0.6} roughness={0.95} />
      </mesh>

      {/* Drawstring cords, pom-poms and tassel */}
      {cords.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color={i ? COLORS.turquoise : COLORS.yellow} roughness={0.9} />
        </mesh>
      ))}
      {[
        [-1.08, 0.38, 0.76],
        [-1.22, 0.31, 0.54],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.1, 32, 24]} />
          <meshStandardMaterial color={COLORS.pink} bumpMap={bump} bumpScale={3} roughness={1} />
        </mesh>
      ))}
      <group position={[-1.16, 0.24, 0.66]}>
        {tasselStrands.map((s, i) => (
          <mesh
            key={i}
            geometry={tassel}
            position={[Math.cos(s.a) * s.r, 0, Math.sin(s.a) * s.r]}
            rotation={[Math.sin(s.a) * s.tilt, 0, -Math.cos(s.a) * s.tilt]}
            castShadow
          >
            <meshStandardMaterial color={s.color} roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
});
