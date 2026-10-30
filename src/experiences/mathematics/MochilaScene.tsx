import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { WayuuMochila3D } from './WayuuMochila3D';
import { GeometryAnnotations } from './GeometryAnnotations';
import { Studio } from './Studio';
import { STAGES, newFrame, sample } from './stages';
import type { OverlayKey } from './textile';

export interface StoryState {
  stage: number;
  settled: boolean;
}

interface Props {
  /** Scroll progress 0–1, written by the page's ScrollTrigger. */
  progress: MutableRefObject<number>;
  /** Called when the stage or its settled state changes (drives captions/labels). */
  onStage: (s: StoryState) => void;
  stage: StoryState;
  /** Layout: 'side' shifts the object right (captions on the left); 'top' lifts it (captions below). */
  layout: 'side' | 'top';
  /** Reduced motion: jump to each stage's framing instead of easing. */
  instant: boolean;
  lowPower: boolean;
}

/** Camera rig: reads progress, samples the storyboard, eases toward it. */
function Rig({ progress, onStage, model, overlay, layout, instant }: Omit<Props, 'stage' | 'lowPower'> & { model: MutableRefObject<THREE.Group | null>; overlay: { current: OverlayKey } }) {
  const { camera, size } = useThree();
  const frame = useMemo(newFrame, []);
  const cur = useMemo(() => ({ cam: new THREE.Vector3(0, 0.6, 7.7), target: new THREE.Vector3(0, 0.55, 0), rotY: 0, init: false }), []);
  const last = useRef({ stage: -1, settled: false });
  const offset = useRef('');

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;

    // Composition: move the optical centre, not the object, so annotations stay exact.
    const key = `${layout}-${size.width}-${size.height}`;
    if (offset.current !== key) {
      offset.current = key;
      if (layout === 'side') cam.setViewOffset(size.width, size.height, -size.width * 0.16, 0, size.width, size.height);
      else cam.setViewOffset(size.width, size.height, 0, size.height * 0.15, size.width, size.height);
      cam.updateProjectionMatrix();
    }

    sample(progress.current, frame);
    // Narrow viewports: pull the camera back along its own axis so the whole
    // framing (and the strap) still fits; wide side layouts keep the keyframes.
    const aspect = size.width / size.height;
    const reach = layout === 'side' ? THREE.MathUtils.clamp(1.55 / aspect, 1, 1.35) : THREE.MathUtils.clamp(1.25 / aspect, 1.05, 2.1);
    frame.cam.sub(frame.target).multiplyScalar(reach).add(frame.target);
    const k = instant || !cur.init ? 1 : 1 - Math.exp(-dt * 2.6);
    cur.init = true;
    cur.cam.lerp(frame.cam, k);
    cur.target.lerp(frame.target, k);
    cur.rotY += (frame.rotY - cur.rotY) * k;
    cam.position.copy(cur.cam);
    cam.lookAt(cur.target);
    if (model.current) model.current.rotation.y = cur.rotY;
    overlay.current = frame.overlay;

    if (frame.stage !== last.current.stage || frame.settled !== last.current.settled) {
      last.current = { stage: frame.stage, settled: frame.settled };
      onStage({ ...last.current });
    }
  });
  return null;
}

/**
 * The persistent WebGL stage for the guided sequence. One canvas, one model;
 * only transforms, the overlay texture and labels change with scroll.
 */
export default function MochilaScene({ progress, onStage, stage, layout, instant, lowPower }: Props) {
  const model = useRef<THREE.Group>(null);
  const overlay = useMemo(() => ({ current: 'none' as OverlayKey }), []);

  return (
    <Canvas
      flat
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 32, near: 0.1, far: 50, position: [0, 0.6, 7.7] }}
      aria-hidden
    >
      <Studio shadows={!lowPower} />
      <Rig progress={progress} onStage={onStage} model={model} overlay={overlay} layout={layout} instant={instant} />
      <group ref={model}>
        <WayuuMochila3D overlay={overlay} />
        {STAGES.map((s, i) => (
          <GeometryAnnotations key={s.id} labels={s.labels} visible={stage.stage === i && stage.settled} />
        ))}
      </group>
    </Canvas>
  );
}
