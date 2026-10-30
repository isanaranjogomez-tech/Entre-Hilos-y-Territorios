import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { WayuuMochila3D } from './WayuuMochila3D';
import { GeometryAnnotations } from './GeometryAnnotations';
import { Studio } from './Studio';
import { FOCUS, faceRotation, rhombusCenter, rhombusWorld, type OverlayKey } from './textile';
import type { AnchorKey } from './stages';

/** Hotspots = the five figures named in section 2 of the infographic (verbatim). */
const HOTSPOTS: { id: string; label: string; text: string; overlay: OverlayKey; anchor: AnchorKey }[] = [
  { id: 'rombos', label: 'Rombos', text: 'Figura predominante del diseño.', overlay: 'rhombus', anchor: 'rhombus' },
  { id: 'triangulos', label: 'Triángulos', text: 'Aparecen entre los motivos principales.', overlay: 'triangles', anchor: 'triangle' },
  { id: 'paralelas', label: 'Líneas paralelas', text: 'Los lados opuestos de los rombos mantienen paralelismo.', overlay: 'parallel', anchor: 'parallel' },
  { id: 'angulos', label: 'Ángulos', text: 'Se distinguen ángulos agudos y obtusos.', overlay: 'angles', anchor: 'acute' },
  { id: 'zigzag', label: 'Zigzag', text: 'Completa el patrón entre franjas y contornos.', overlay: 'zigzag', anchor: 'zigzag' },
];

const HOME = { cam: new THREE.Vector3(0, 0.7, 7.4), target: new THREE.Vector3(0, 0.55, 0) };
const focus = rhombusWorld(FOCUS.row, FOCUS.j);
const r = Math.hypot(focus.x, focus.z);
const CLOSE = { cam: new THREE.Vector3(0, focus.y + 0.1, r + 3.0), target: new THREE.Vector3(0, focus.y, 0) };
const FACE = faceRotation(rhombusCenter(FOCUS.row, FOCUS.j).x);

type Fly = { cam: THREE.Vector3; target: THREE.Vector3 } | null;

function Scene({ controls, overlay, fly, rotY, active }: { controls: React.MutableRefObject<OrbitControlsImpl | null>; overlay: { current: OverlayKey }; fly: React.MutableRefObject<Fly>; rotY: number; active: string | null }) {
  const model = useRef<THREE.Group>(null);
  const hot = HOTSPOTS.find((h) => h.id === active);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 4);
    if (model.current) model.current.rotation.y += (rotY - model.current.rotation.y) * k;
    const c = controls.current;
    if (c && fly.current) {
      c.object.position.lerp(fly.current.cam, k);
      c.target.lerp(fly.current.target, k);
      c.update();
      if (c.object.position.distanceTo(fly.current.cam) < 0.01) fly.current = null;
    }
  });
  return (
    <group ref={model}>
      <WayuuMochila3D overlay={overlay} />
      {hot && <GeometryAnnotations labels={[{ anchor: hot.anchor, text: hot.label }]} visible />}
    </group>
  );
}

/**
 * STAGE 07 — free exploration of the same reconstruction: drag to rotate,
 * zoom buttons, reset, and hotspots for the figures named in the infographic.
 * Page scroll is never captured: wheel-zoom is off, and on touch screens
 * rotation must be switched on explicitly.
 */
export default function MochilaExplorer() {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const fly = useRef<Fly>(null);
  const overlay = useMemo(() => ({ current: 'none' as OverlayKey }), []);
  const [active, setActive] = useState<string | null>(null);
  const [rotY, setRotY] = useState(FACE + 0.6);
  const coarse = useMemo(() => window.matchMedia('(pointer: coarse)').matches, []);
  const [touchOn, setTouchOn] = useState(false);
  const interactive = !coarse || touchOn;

  const select = (id: string) => {
    const h = HOTSPOTS.find((x) => x.id === id)!;
    if (active === id) {
      setActive(null);
      overlay.current = 'none';
      return;
    }
    setActive(id);
    overlay.current = h.overlay;
    setRotY(FACE);
    fly.current = { cam: CLOSE.cam.clone(), target: CLOSE.target.clone() };
  };

  const zoom = (factor: number) => {
    const c = controls.current;
    if (!c) return;
    const dir = c.object.position.clone().sub(c.target);
    const len = THREE.MathUtils.clamp(dir.length() * factor, 2.4, 10);
    fly.current = { cam: c.target.clone().add(dir.setLength(len)), target: c.target.clone() };
  };

  const reset = () => {
    setActive(null);
    overlay.current = 'none';
    setRotY(FACE + 0.6);
    fly.current = { cam: HOME.cam.clone(), target: HOME.target.clone() };
  };

  useEffect(() => () => void (fly.current = null), []);

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
      <div
        className="relative aspect-[4/5] w-full md:aspect-auto md:h-[78vh]"
        style={{ touchAction: interactive ? 'none' : 'pan-y', background: 'radial-gradient(ellipse at 50% 45%, #fbf7f0 0%, #efe6d8 55%, #e0d2bd 100%)' }}
      >
        <Canvas flat shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} camera={{ fov: 32, position: HOME.cam.toArray() }} aria-label="Mochila en 3D para explorar">
          <Studio />
          <Scene controls={controls} overlay={overlay} fly={fly} rotY={rotY} active={active} />
          <OrbitControls
            ref={controls}
            makeDefault
            target={HOME.target}
            enabled={interactive}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={0.35}
            maxPolarAngle={1.75}
            onStart={() => (fly.current = null)}
          />
        </Canvas>
        {coarse && (
          <button onClick={() => setTouchOn((t) => !t)} className="btn-pill absolute bottom-4 left-4 border-navy/25 bg-ivory/90 text-navy">
            {touchOn ? 'Desactivar rotación' : 'Activar rotación'}
          </button>
        )}
      </div>

      <div className="text-navy">
        <p className="meta text-magenta">07 · Exploración libre</p>
        <h2 className="display-lg mt-4">Explora el tejido</h2>
        <p className="mt-5 max-w-[42ch] leading-relaxed text-navy/70">
          {coarse ? 'Activa la rotación y desliza para girar la mochila.' : 'Arrastra para girar la mochila.'} Elige una figura para verla señalada sobre el tejido.
        </p>

        <ul className="mt-8 border-t border-navy/15">
          {HOTSPOTS.map((h) => (
            <li key={h.id} className="border-b border-navy/15">
              <button onClick={() => select(h.id)} aria-pressed={active === h.id} className="group flex w-full items-baseline justify-between gap-6 py-4 text-left">
                <span className={`font-display text-2xl transition-colors ${active === h.id ? 'text-magenta' : 'group-hover:text-magenta'}`}>{h.label}</span>
                <span className="meta text-navy/40">{active === h.id ? 'Activo' : 'Ver'}</span>
              </button>
              {active === h.id && <p className="-mt-1 pb-4 leading-relaxed text-navy/75">{h.text}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button className="btn-pill border-navy/25 hover:border-navy" onClick={() => zoom(0.75)} aria-label="Acercar la mochila">
            Acercar +
          </button>
          <button className="btn-pill border-navy/25 hover:border-navy" onClick={() => zoom(1.33)} aria-label="Alejar la mochila">
            Alejar −
          </button>
          <button className="btn-text ml-2 text-navy/70 hover:text-navy" onClick={reset}>
            Restablecer vista
          </button>
        </div>
      </div>
    </div>
  );
}
