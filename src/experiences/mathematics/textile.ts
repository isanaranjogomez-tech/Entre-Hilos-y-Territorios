import * as THREE from 'three';

/**
 * PROCEDURAL WAYUU MOCHILA — geometry and textile.
 *
 * A visual reconstruction based on the mochila photographed in the team's
 * infographic (hot-pink body, yellow-outlined rhombuses with turquoise and blue
 * detail, triangles between motifs, zigzag bands). It is NOT a photogrammetric
 * replica.
 *
 * Mapping: the body is a lathe whose profile is resampled by arc length, so
 * texture v is proportional to distance along the surface and u to angle. The
 * texture's aspect ratio equals (surface length) : (circumference at the band),
 * so a rhombus drawn in the texture keeps its proportions on the bag. Every
 * overlay is drawn in the same texture space, so highlights sit exactly on the
 * textile features they describe.
 */

// ---------- Body profile ----------
const PROFILE = new THREE.SplineCurve(
  [
    [0.001, -1.15],
    [0.42, -1.155],
    [0.8, -1.13],
    [0.97, -1.02],
    [1.045, -0.78],
    [1.07, -0.3],
    [1.065, 0.25],
    [1.035, 0.75],
    [0.99, 1.06],
    [0.95, 1.16],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
);

export const PROFILE_POINTS = PROFILE.getSpacedPoints(110);
export const SURFACE_LENGTH = PROFILE.getLength();
export const BAND_RADIUS = 1.06;
export const CIRCUMFERENCE = 2 * Math.PI * BAND_RADIUS;

// ---------- Texture space ----------
export const TEX_W = 2048;
export const TEX_H = Math.round((TEX_W * SURFACE_LENGTH) / CIRCUMFERENCE);
/** Pixels per world unit along the surface. */
export const K = TEX_W / CIRCUMFERENCE;
/** Size of one crochet stitch, in texture pixels. */
const STITCH = 8;

// ---------- Pattern layout (distances measured down from the rim, world units) ----------
export const N_RHOMBI = 10;
export const RHOMBUS_W = CIRCUMFERENCE / N_RHOMBI; // horizontal diagonal
export const RHOMBUS_H = RHOMBUS_W * 1.32; // vertical diagonal
const RIM_BAND = 0.11;
const ZIGZAG = 0.13;
export const ROW_TOP = [RIM_BAND, RIM_BAND + RHOMBUS_H + ZIGZAG];
export const ZIGZAG_TOP = [RIM_BAND + RHOMBUS_H, RIM_BAND + 2 * RHOMBUS_H + ZIGZAG];
const BASE_START = RIM_BAND + 2 * RHOMBUS_H + 2 * ZIGZAG;

export const COLORS = {
  pink: '#d81b6a',
  pinkDeep: '#a8124f',
  yellow: '#f3d21f',
  turquoise: '#1aa99c',
  blue: '#1f5fae',
  ivory: '#f4ede2',
  gold: '#e3c34b',
  ink: '#071822',
};

/** Texture pixel x/y for column-space x (world units around) and depth from rim. */
const px = (x: number) => x * K;
const py = (depth: number) => depth * K;

/** Centre of rhombus `j` in row `row`, in texture pixels. */
export const rhombusCenter = (row: number, j: number) => ({
  x: px((j + 0.5) * RHOMBUS_W),
  y: py(ROW_TOP[row] + RHOMBUS_H / 2),
});
const HW = px(RHOMBUS_W / 2);
const HH = py(RHOMBUS_H / 2);

/** The four vertices (top, right, bottom, left) of a rhombus, in pixels. */
export const rhombusVertices = (row: number, j: number, scale = 1) => {
  const c = rhombusCenter(row, j);
  return {
    top: { x: c.x, y: c.y - HH * scale },
    right: { x: c.x + HW * scale, y: c.y },
    bottom: { x: c.x, y: c.y + HH * scale },
    left: { x: c.x - HW * scale, y: c.y },
  };
};

// ---------- Surface coordinates ----------
/** World position (model space) of texture pixel (x, y), slightly lifted off the surface. */
export function surfacePoint(x: number, y: number, lift = 0.02) {
  const v = 1 - y / TEX_H; // canvas row 0 is the rim (v = 1)
  const p = PROFILE.getPointAt(THREE.MathUtils.clamp(v, 0, 1));
  const phi = (x / TEX_W) * Math.PI * 2;
  const r = p.x + lift;
  return new THREE.Vector3(r * Math.sin(phi), p.y, r * Math.cos(phi));
}

/** Model rotation (about Y) that turns texture column x toward the camera (+Z). */
export const faceRotation = (x: number) => -(x / TEX_W) * Math.PI * 2;

// ---------- Drawing helpers ----------
const poly = (ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) => {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
};
const rhombusPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) =>
  poly(ctx, [
    { x: cx, y: cy - HH * s },
    { x: cx + HW * s, y: cy },
    { x: cx, y: cy + HH * s },
    { x: cx - HW * s, y: cy },
  ]);

/** Draws `fn` at x offsets −W, 0, +W so shapes across the seam wrap seamlessly. */
const wrap = (ctx: CanvasRenderingContext2D, fn: () => void) => {
  for (const dx of [-TEX_W, 0, TEX_W]) {
    ctx.save();
    ctx.translate(dx, 0);
    fn();
    ctx.restore();
  }
};

/**
 * The textile, drawn at stitch resolution (one canvas pixel = one stitch) and
 * then enlarged without smoothing, which gives the stepped edges of crochet.
 */
function drawPatternLowRes(): HTMLCanvasElement {
  const w = TEX_W / STITCH;
  const h = Math.ceil(TEX_H / STITCH);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.scale(1 / STITCH, 1 / STITCH);

  // Ground
  ctx.fillStyle = COLORS.pink;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Rim band: turquoise with a yellow zigzag
  ctx.fillStyle = COLORS.turquoise;
  ctx.fillRect(0, 0, TEX_W, py(RIM_BAND));
  zigzag(ctx, 0, py(RIM_BAND), COLORS.yellow, 20);

  for (let row = 0; row < 2; row++) {
    const top = py(ROW_TOP[row]);
    const bottom = top + 2 * HH;
    wrap(ctx, () => {
      for (let j = 0; j < N_RHOMBI; j++) {
        const { x: cx, y: cy } = rhombusCenter(row, j);
        const nx = cx + 2 * HW;
        // Triangles between neighbouring rhombuses (above and below the shared vertex)
        ctx.fillStyle = COLORS.pinkDeep;
        poly(ctx, [{ x: cx, y: top }, { x: nx, y: top }, { x: cx + HW, y: cy }]);
        ctx.fill();
        poly(ctx, [{ x: cx, y: bottom }, { x: nx, y: bottom }, { x: cx + HW, y: cy }]);
        ctx.fill();
        ctx.fillStyle = COLORS.yellow;
        const ty = top + HH * 0.32;
        poly(ctx, [{ x: cx + HW - 22, y: top + 10 }, { x: cx + HW + 22, y: top + 10 }, { x: cx + HW, y: ty }]);
        ctx.fill();
        poly(ctx, [{ x: cx + HW - 22, y: bottom - 10 }, { x: cx + HW + 22, y: bottom - 10 }, { x: cx + HW, y: bottom - HH * 0.32 }]);
        ctx.fill();

        // Rhombus: yellow band, turquoise line, pink field, nested yellow + blue centre
        rhombusPath(ctx, cx, cy, 1);
        ctx.fillStyle = COLORS.yellow;
        ctx.fill();
        rhombusPath(ctx, cx, cy, 0.84);
        ctx.fillStyle = COLORS.turquoise;
        ctx.fill();
        rhombusPath(ctx, cx, cy, 0.74);
        ctx.fillStyle = COLORS.pink;
        ctx.fill();
        rhombusPath(ctx, cx, cy, 0.36);
        ctx.fillStyle = COLORS.yellow;
        ctx.fill();
        rhombusPath(ctx, cx, cy, 0.18);
        ctx.fillStyle = COLORS.blue;
        ctx.fill();
        // Blue knots where rhombuses meet
        ctx.fillStyle = COLORS.blue;
        ctx.fillRect(cx + HW - 14, cy - 14, 28, 28);
      }
    });
    // Zigzag band under each row
    const zt = py(ZIGZAG_TOP[row]);
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(0, zt, TEX_W, py(ZIGZAG));
    zigzag(ctx, zt, zt + py(ZIGZAG), COLORS.yellow, 18);
  }

  // Base: concentric rings
  const base = py(BASE_START);
  const ring = 34;
  for (let y = base, k = 0; y < TEX_H; y += ring, k++) {
    ctx.fillStyle = [COLORS.pink, COLORS.yellow, COLORS.pink, COLORS.turquoise][k % 4];
    ctx.fillRect(0, y, TEX_W, k % 2 ? ring * 0.45 : ring);
  }
  return c;
}

function zigzag(ctx: CanvasRenderingContext2D, top: number, bottom: number, color: string, width: number) {
  const period = px(RHOMBUS_W / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  const pad = width * 0.7;
  for (let x = -period, i = 0; x <= TEX_W + period; x += period / 2, i++) {
    const y = i % 2 ? bottom - pad : top + pad;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.stroke();
}

/** One stitch: a soft loop, lighter in the middle. Used for colour shading and bump. */
function stitchTile(light: string, dark: string) {
  const t = document.createElement('canvas');
  t.width = STITCH;
  t.height = STITCH;
  const g = t.getContext('2d')!;
  const grad = g.createRadialGradient(STITCH / 2, STITCH * 0.42, 0.5, STITCH / 2, STITCH / 2, STITCH * 0.62);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fillRect(0, 0, STITCH, STITCH);
  return t;
}

/** Fine yarn fibres: short, slightly slanted strokes, tiled (adds softness at close range). */
function fiberTile(alpha: number) {
  const n = 192;
  const t = document.createElement('canvas');
  t.width = n;
  t.height = n;
  const g = t.getContext('2d')!;
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.lineCap = 'round';
  for (let i = 0; i < 900; i++) {
    const x = r() * n;
    const y = r() * n;
    const len = 2 + r() * 6;
    const a = -0.5 + r() * 1.0;
    g.strokeStyle = r() > 0.5 ? `rgba(255,255,255,${alpha * r()})` : `rgba(0,0,0,${alpha * r()})`;
    g.lineWidth = 0.6 + r() * 0.8;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.stroke();
  }
  return t;
}

export interface MochilaTextures {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

let cached: MochilaTextures | null = null;

/** Colour + bump textures, built once and shared by every scene. */
export function getMochilaTextures(): MochilaTextures {
  if (cached) return cached;
  const low = drawPatternLowRes();

  const color = document.createElement('canvas');
  color.width = TEX_W;
  color.height = TEX_H;
  const cc = color.getContext('2d')!;
  cc.imageSmoothingEnabled = false;
  cc.drawImage(low, 0, 0, low.width * STITCH, low.height * STITCH);
  cc.globalCompositeOperation = 'multiply';
  cc.fillStyle = cc.createPattern(stitchTile('#ffffff', '#d2c6c0'), 'repeat')!;
  cc.fillRect(0, 0, TEX_W, TEX_H);
  cc.globalCompositeOperation = 'soft-light';
  cc.fillStyle = cc.createPattern(fiberTile(0.5), 'repeat')!;
  cc.fillRect(0, 0, TEX_W, TEX_H);

  const bump = document.createElement('canvas');
  bump.width = TEX_W;
  bump.height = TEX_H;
  const bc = bump.getContext('2d')!;
  bc.fillStyle = bc.createPattern(stitchTile('#ffffff', '#202020'), 'repeat')!;
  bc.fillRect(0, 0, TEX_W, TEX_H);
  bc.globalCompositeOperation = 'overlay';
  bc.fillStyle = bc.createPattern(fiberTile(0.35), 'repeat')!;
  bc.fillRect(0, 0, TEX_W, TEX_H);

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const bumpTex = new THREE.CanvasTexture(bump);
  bumpTex.wrapS = THREE.RepeatWrapping;
  cached = { map, bump: bumpTex };
  return cached;
}

// ---------- Geometric overlays (drawn on the textile) ----------
export type OverlayKey = 'none' | 'rhombus' | 'figures' | `rep-${number}` | 'symmetry' | 'zigzag' | 'triangles' | 'parallel' | 'angles';

/** Focus motif used by the guided sequence. */
export const FOCUS = { row: 0, j: 2 };
export const SYMMETRY_FOCUS = { row: 1, j: 2 };
export const REPEAT_FROM = 1;

const LINE = 7;

function outline(ctx: CanvasRenderingContext2D, row: number, j: number, color: string, width = LINE, scale = 1.02) {
  const c = rhombusCenter(row, j);
  rhombusPath(ctx, c.x, c.y, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r = 9, color = COLORS.ivory) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Angle arc at vertex `v` between the directions to points `a` and `b`. */
function angleArc(ctx: CanvasRenderingContext2D, v: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }, r: number, color: string) {
  const a0 = Math.atan2(a.y - v.y, a.x - v.x);
  const a1 = Math.atan2(b.y - v.y, b.x - v.x);
  ctx.beginPath();
  ctx.moveTo(v.x, v.y);
  ctx.arc(v.x, v.y, r, a0, a1, false);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.45;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(v.x, v.y, r, a0, a1, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.stroke();
}

function triangles(ctx: CanvasRenderingContext2D, row: number, j: number) {
  const { x: cx, y: cy } = rhombusCenter(row, j);
  const top = py(ROW_TOP[row]);
  const bottom = top + 2 * HH;
  ctx.fillStyle = 'rgba(244,237,226,0.35)';
  ctx.strokeStyle = COLORS.ivory;
  ctx.lineWidth = 5;
  for (const [x0, x1, xv] of [
    [cx, cx + 2 * HW, cx + HW],
    [cx - 2 * HW, cx, cx - HW],
  ]) {
    poly(ctx, [{ x: x0, y: top }, { x: x1, y: top }, { x: xv, y: cy }]);
    ctx.fill();
    ctx.stroke();
    poly(ctx, [{ x: x0, y: bottom }, { x: x1, y: bottom }, { x: xv, y: cy }]);
    ctx.fill();
    ctx.stroke();
  }
}

function parallel(ctx: CanvasRenderingContext2D, row: number, j: number) {
  const v = rhombusVertices(row, j, 1.02);
  ctx.strokeStyle = COLORS.turquoise;
  ctx.lineWidth = 7;
  ctx.setLineDash([22, 14]);
  // Opposite sides top→right and left→bottom are parallel; extend both.
  for (const [p, q] of [
    [v.top, v.right],
    [v.left, v.bottom],
  ]) {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    ctx.beginPath();
    ctx.moveTo(p.x - dx * 0.45, p.y - dy * 0.45);
    ctx.lineTo(q.x + dx * 0.45, q.y + dy * 0.45);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function angles(ctx: CanvasRenderingContext2D, row: number, j: number) {
  const v = rhombusVertices(row, j);
  angleArc(ctx, v.top, v.right, v.left, 46, COLORS.turquoise); // acute (opens downward)
  angleArc(ctx, v.right, v.bottom, v.top, 40, COLORS.gold); // obtuse (opens left)
}

/** Draws the overlay for `key` into `ctx` (transparent background). */
export function drawOverlay(ctx: CanvasRenderingContext2D, key: OverlayKey) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  const f = FOCUS;
  wrap(ctx, () => {
    if (key === 'rhombus') {
      outline(ctx, f.row, f.j, COLORS.ivory, 9);
      const v = rhombusVertices(f.row, f.j, 1.02);
      Object.values(v).forEach((p) => dot(ctx, p.x, p.y, 11));
    } else if (key === 'figures') {
      outline(ctx, f.row, f.j, COLORS.ivory, 5);
      triangles(ctx, f.row, f.j);
      parallel(ctx, f.row, f.j);
      angles(ctx, f.row, f.j);
    } else if (key === 'triangles') {
      triangles(ctx, f.row, f.j);
    } else if (key === 'parallel') {
      outline(ctx, f.row, f.j, COLORS.ivory, 4);
      parallel(ctx, f.row, f.j);
    } else if (key === 'angles') {
      outline(ctx, f.row, f.j, COLORS.ivory, 4);
      angles(ctx, f.row, f.j);
    } else if (key === 'zigzag') {
      const zt = py(ZIGZAG_TOP[0]);
      ctx.strokeStyle = COLORS.ivory;
      ctx.lineWidth = 6;
      ctx.strokeRect(-20, zt, TEX_W + 40, py(ZIGZAG));
    } else if (key.startsWith('rep-')) {
      const n = Number(key.slice(4));
      for (let k = 0; k < n; k++) outline(ctx, f.row, REPEAT_FROM + k, COLORS.ivory, 8);
      // Equal spacing: a baseline with a tick under each repeated centre
      if (n >= 2) {
        const y = py(ROW_TOP[f.row]) + 2 * HH + py(ZIGZAG) * 0.5;
        const x0 = rhombusCenter(f.row, REPEAT_FROM).x;
        const x1 = rhombusCenter(f.row, REPEAT_FROM + n - 1).x;
        ctx.strokeStyle = COLORS.ivory;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();
        for (let k = 0; k < n; k++) dot(ctx, rhombusCenter(f.row, REPEAT_FROM + k).x, y, 10);
        // Translation vector between the first two motifs
        const a = rhombusCenter(f.row, REPEAT_FROM);
        const b = rhombusCenter(f.row, REPEAT_FROM + 1);
        arrow(ctx, a.x + 18, a.y, b.x - 18, b.y, COLORS.gold);
      }
    } else if (key === 'symmetry') {
      const s = SYMMETRY_FOCUS;
      const c = rhombusCenter(s.row, s.j);
      const v = rhombusVertices(s.row, s.j, 1.02);
      // Corresponding halves
      ctx.fillStyle = 'rgba(26,169,156,0.42)';
      poly(ctx, [v.top, v.bottom, v.left]);
      ctx.fill();
      ctx.fillStyle = 'rgba(227,195,75,0.42)';
      poly(ctx, [v.top, v.right, v.bottom]);
      ctx.fill();
      outline(ctx, s.row, s.j, COLORS.ivory, 6);
      // Axis through the vertical diagonal
      ctx.strokeStyle = COLORS.ivory;
      ctx.lineWidth = 6;
      ctx.setLineDash([20, 12]);
      ctx.beginPath();
      ctx.moveTo(c.x, v.top.y - 50);
      ctx.lineTo(c.x, v.bottom.y + 50);
      ctx.stroke();
      ctx.setLineDash([]);
      // A pair of corresponding points, equidistant from the axis
      const d = HW * 0.55;
      ctx.strokeStyle = 'rgba(244,237,226,0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(c.x - d, c.y + HH * 0.2);
      ctx.lineTo(c.x + d, c.y + HH * 0.2);
      ctx.stroke();
      dot(ctx, c.x - d, c.y + HH * 0.2, 10, COLORS.turquoise);
      dot(ctx, c.x + d, c.y + HH * 0.2, 10, COLORS.gold);
    }
  });
}

function arrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: string) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1 - 22, y1);
  ctx.stroke();
  poly(ctx, [{ x: x1, y: y1 }, { x: x1 - 30, y: y1 - 16 }, { x: x1 - 30, y: y1 + 16 }]);
  ctx.fill();
}

/** Texture-pixel anchors for the annotation labels. */
export const anchors = {
  rhombus: () => rhombusVertices(FOCUS.row, FOCUS.j).right,
  triangle: () => {
    const c = rhombusCenter(FOCUS.row, FOCUS.j);
    return { x: c.x + HW, y: py(ROW_TOP[FOCUS.row]) + HH * 0.35 };
  },
  parallel: () => {
    const v = rhombusVertices(FOCUS.row, FOCUS.j);
    return { x: v.left.x - HW * 0.25, y: v.bottom.y + HH * 0.05 };
  },
  acute: () => rhombusVertices(FOCUS.row, FOCUS.j).top,
  obtuse: () => rhombusVertices(FOCUS.row, FOCUS.j).right,
  translation: () => {
    const a = rhombusCenter(FOCUS.row, REPEAT_FROM);
    const b = rhombusCenter(FOCUS.row, REPEAT_FROM + 1);
    return { x: (a.x + b.x) / 2, y: a.y - HH * 0.15 };
  },
  spacing: () => ({ x: rhombusCenter(FOCUS.row, REPEAT_FROM + 2).x, y: py(ROW_TOP[FOCUS.row]) + 2 * HH + py(ZIGZAG) * 0.5 }),
  axis: () => ({ x: rhombusCenter(SYMMETRY_FOCUS.row, SYMMETRY_FOCUS.j).x, y: rhombusVertices(SYMMETRY_FOCUS.row, SYMMETRY_FOCUS.j).top.y - 40 }),
  halves: () => rhombusVertices(SYMMETRY_FOCUS.row, SYMMETRY_FOCUS.j).left,
  zigzag: () => ({ x: rhombusCenter(FOCUS.row, FOCUS.j).x, y: py(ZIGZAG_TOP[0] + ZIGZAG / 2) }),
};

/** World-space centre of a rhombus (for camera targets). */
export const rhombusWorld = (row: number, j: number) => {
  const c = rhombusCenter(row, j);
  return surfacePoint(c.x, c.y, 0);
};
