import * as THREE from 'three';
import { FOCUS, SYMMETRY_FOCUS, anchors, faceRotation, rhombusCenter, rhombusWorld, type OverlayKey } from './textile';

/**
 * Central progress controller for the guided sequence. Everything the 3D scene
 * does — camera position, camera target, model rotation, overlay, labels — is
 * derived from one number p ∈ [0, 1], so nothing competes for the camera.
 */

export interface Keyframe {
  cam: THREE.Vector3;
  target: THREE.Vector3;
  rotY: number;
}

export type AnchorKey = keyof typeof anchors;
export interface StageLabel {
  anchor: AnchorKey;
  text: string;
}

const focus = rhombusWorld(FOCUS.row, FOCUS.j);
const sym = rhombusWorld(SYMMETRY_FOCUS.row, SYMMETRY_FOCUS.j);
const faceFocus = faceRotation(rhombusCenter(FOCUS.row, FOCUS.j).x);
const faceRepeat = faceRotation(rhombusCenter(FOCUS.row, 2.5).x);
const faceSym = faceRotation(rhombusCenter(SYMMETRY_FOCUS.row, SYMMETRY_FOCUS.j).x);
const rFocus = Math.hypot(focus.x, focus.z);
const rSym = Math.hypot(sym.x, sym.z);

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const STAGES: {
  id: string;
  kf: Keyframe;
  /** Keyframe at the start of the stage, when it differs (opening rotation). */
  from?: Partial<Keyframe>;
  /** Overlay for the stage, given progress through its reading window (0–1). */
  overlay: (h: number) => OverlayKey;
  labels: StageLabel[];
}[] = [
  {
    id: 'mochila',
    from: { rotY: faceFocus + 2.4 },
    kf: { cam: v(0, 0.6, 7.7), target: v(0, 0.55, 0), rotY: faceFocus + 0.55 },
    overlay: () => 'none',
    labels: [],
  },
  {
    id: 'rombo',
    kf: { cam: v(0, focus.y + 0.06, rFocus + 2.6), target: v(0, focus.y, rFocus * 0.4), rotY: faceFocus },
    overlay: () => 'rhombus',
    labels: [{ anchor: 'rhombus', text: 'Rombo' }],
  },
  {
    id: 'figuras',
    kf: { cam: v(0, focus.y + 0.02, rFocus + 3.2), target: v(0, focus.y, rFocus * 0.4), rotY: faceFocus },
    overlay: () => 'figures',
    labels: [
      { anchor: 'acute', text: 'Ángulo agudo' },
      { anchor: 'obtuse', text: 'Ángulo obtuso' },
      { anchor: 'triangle', text: 'Triángulo' },
      { anchor: 'parallel', text: 'Lados paralelos' },
    ],
  },
  {
    id: 'repeticion',
    kf: { cam: v(0, focus.y - 0.12, 5.0), target: v(0, focus.y - 0.2, 0), rotY: faceRepeat },
    overlay: (h) => `rep-${Math.min(4, 1 + Math.floor(h * 4))}` as OverlayKey,
    labels: [
      { anchor: 'translation', text: 'Traslación' },
      { anchor: 'spacing', text: 'Separación regular' },
    ],
  },
  {
    id: 'simetria',
    kf: { cam: v(0, sym.y + 0.04, rSym + 2.9), target: v(0, sym.y, rSym * 0.4), rotY: faceSym },
    overlay: () => 'symmetry',
    labels: [
      { anchor: 'axis', text: 'Eje de simetría' },
      { anchor: 'halves', text: 'Mitades correspondientes' },
    ],
  },
  {
    id: 'cultura',
    from: { rotY: faceSym - 0.4 },
    kf: { cam: v(0, 0.6, 8.3), target: v(0, 0.55, 0), rotY: faceSym - 1.3 },
    overlay: () => 'none',
    labels: [],
  },
];

export const S = STAGES.length;

/**
 * Hold-and-reveal pacing. Each stage occupies one unit of scroll (f ∈ [i, i+1)):
 *   ARRIVE  — camera finishes arriving, the explanation enters  (≈ 22 %)
 *   HOLD    — camera still, explanation fully visible            (≈ 58 %)
 *   LEAVE   — explanation leaves, camera starts toward the next  (≈ 20 %)
 * The camera blend between two stages spans LEAVE of one and ARRIVE of the
 * next, so motion is continuous and every reading window is stable.
 */
export const ARRIVE = 0.22;
export const LEAVE = 0.8;
/** Caption visibility inside a stage (slightly inside the hold window on both ends). */
const CAPTION_IN = 0.1;
const CAPTION_OUT = 0.86;
/** Kept for the repetition overlay: fraction of a stage spent before leaving. */
export const HOLD = LEAVE;

const smooth = (x: number) => x * x * (3 - 2 * x);

export interface Frame extends Keyframe {
  /** Stage whose explanation is visible, or -1 between explanations. */
  stage: number;
  /** Progress within the current stage unit, 0–1. */
  t: number;
  overlay: OverlayKey;
  /** True while the camera holds still (annotation labels may show). */
  settled: boolean;
}

/** Keyframe of stage i at hold progress h ∈ [0, 1] (only the opening rotates while holding). */
const keyAt = (i: number, h: number): Keyframe => {
  const st = STAGES[i];
  if (!st.from) return st.kf;
  return {
    cam: st.kf.cam,
    target: st.kf.target,
    rotY: THREE.MathUtils.lerp(st.from.rotY ?? st.kf.rotY, st.kf.rotY, smooth(h)),
  };
};

/** Start and end (in stage units) of stage i's hold window. */
const holdStart = (i: number) => (i === 0 ? 0 : i + ARRIVE);
const holdEnd = (i: number) => (i === S - 1 ? S : i + LEAVE);

/** Samples the whole sequence at progress p. Pure: same p, same frame. */
export function sample(p: number, out: Frame): Frame {
  const f = THREE.MathUtils.clamp(p, 0, 0.99999) * S;
  const i = Math.floor(f);
  const t = f - i;

  // Which two stages bound f, and how far between them?
  let a = i;
  let blend = 0;
  if (f > holdEnd(i) && i < S - 1) {
    blend = (f - holdEnd(i)) / (holdStart(i + 1) - holdEnd(i));
  } else if (f < holdStart(i) && i > 0) {
    a = i - 1;
    blend = (f - holdEnd(i - 1)) / (holdStart(i) - holdEnd(i - 1));
  }
  blend = smooth(THREE.MathUtils.clamp(blend, 0, 1));

  const hold = (k: number) => THREE.MathUtils.clamp((f - holdStart(k)) / (holdEnd(k) - holdStart(k)), 0, 1);
  const ka = keyAt(a, blend > 0 ? 1 : hold(a));
  if (blend > 0) {
    const kb = keyAt(a + 1, 0);
    out.cam.copy(ka.cam).lerp(kb.cam, blend);
    out.target.copy(ka.target).lerp(kb.target, blend);
    out.rotY = THREE.MathUtils.lerp(ka.rotY, kb.rotY, blend);
  } else {
    out.cam.copy(ka.cam);
    out.target.copy(ka.target);
    out.rotY = ka.rotY;
  }

  const captionIn = i === 0 ? -1 : CAPTION_IN;
  const captionOut = i === S - 1 ? 2 : CAPTION_OUT;
  out.stage = t >= captionIn && t < captionOut ? i : -1;
  out.t = t;
  const current = blend > 0.5 ? a + 1 : a;
  // Overlays clear while the camera travels, and redraw once it nears the next motif.
  out.overlay = blend > 0.2 && blend < 0.8 ? 'none' : STAGES[current].overlay(hold(current));
  out.settled = blend === 0 && out.stage === i;
  return out;
}

/** Scroll progress (0–1) at the middle of stage i's reading window — for step navigation. */
export const stageCenter = (i: number) => ((holdStart(i) + holdEnd(i)) / 2) / S;

export const newFrame = (): Frame => ({ cam: new THREE.Vector3(), target: new THREE.Vector3(), rotY: 0, stage: 0, t: 0, overlay: 'none', settled: true });
