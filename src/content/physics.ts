import type { DocumentAsset } from './types';

/**
 * CHAPTER III — FÍSICA · "Vectores en La Guajira" (Spanish)
 *
 * Source of truth: "VECTORES EN LA GUAJIRA - GRUPO 2.pdf" (12 slides).
 * Every number below is copied from the slides. Nothing is rounded or
 * corrected here: `verifyDay()` recomputes the arithmetic and the page shows
 * both, flagging any difference for academic review.
 *
 * Maps: each day's base map is the Google Maps screenshot embedded in the
 * slide (©2026 Google), including the students' hand-drawn vectors. `route`
 * is an approximate trace of the blue road line in that screenshot, in the
 * image's own pixels — a visual reconstruction, not GPS data. The vehicle
 * follows `route`; displacement vectors are drawn separately, as straight
 * arrows between the points the students marked.
 */

export type Pt = [number, number];

export interface Segment {
  code: string; // "A → B"
  from: string;
  to: string;
  depart: string;
  arrive: string;
  /** Tiempo en movimiento (h), as written. */
  hours: number;
  /** Distancia Google Maps (km). */
  km: number;
  /** Parada al llegar (min); null when the slide shows "—". */
  stopMin: number | null;
  /** v = d / t (km/h), as written on the "Velocidades" slide. */
  speed: number;
}

export interface SourceSpeed {
  /** Value as written, e.g. 30.5 */
  value: number;
  /** Label exactly as on the slide. */
  label: string;
  /** Procedure as written on the slide. */
  formula: string;
  kind: 'rapidez-media' | 'rapidez-movimiento' | 'velocidad-media';
  /** Numerator and denominator, for verification. */
  check: { num: number; den: number };
}

export interface Vector {
  label: string;
  from: Pt;
  to: Pt;
  kind: 'parcial' | 'resultante';
}

export interface Day {
  n: number;
  title: string;
  lead: string;
  map: { src: string; w: number; h: number };
  chart: string;
  route: Pt[];
  vectors: Vector[];
  segments: Segment[];
  total: { depart: string; arrive: string; hours: number; km: number; stopMin: number };
  speeds: SourceSpeed[];
  /** Notes for academic review (never silently "fixed"). */
  review: string[];
}

export const physics = {
  title: 'Vectores en La Guajira',
  authors: ['Isabella Naranjo', 'Santiago Cortes', 'Julieta Borda', 'Daniel Sierra', 'Luciana Mulett'],
  intro:
    'Cinco días de recorrido por La Guajira: trayectos, tiempos, distancias, rapidez y desplazamiento, calculados a partir de las rutas de Google Maps.',
  mapCredit: 'Capturas de Google Maps incluidas en la presentación · ©2026 Google',
  days: [
    {
      n: 1,
      title: 'El inicio del recorrido',
      lead: 'Aeropuerto Riohacha → Ranchería El Dividivi',
      map: { src: 'images/fisica/mapa-dia-1.jpg', w: 1061, h: 1148 },
      chart: 'images/fisica/grafica-dia-1.jpg',
      route: [[470, 192], [530, 189], [580, 186], [586, 212], [578, 290], [566, 360], [552, 420], [540, 480], [526, 560], [512, 640], [500, 720], [486, 800], [473, 880], [465, 950], [463, 1020], [462, 1085]],
      vectors: [{ label: 'a', from: [378, 185], to: [462, 1085], kind: 'resultante' }],
      segments: [{ code: 'A → B', from: 'Aeropuerto Riohacha', to: 'Ranchería El Dividivi', depart: '14:00', arrive: '14:25', hours: 0.4, km: 14, stopMin: null, speed: 35 }],
      total: { depart: '14:00', arrive: '14:25', hours: 0.4, km: 14, stopMin: 0 },
      speeds: [
        { value: 35.0, label: 'rapidez media del día', formula: '(14 km ÷ 0,40 h)', kind: 'rapidez-media', check: { num: 14, den: 0.4 } },
        { value: 35.0, label: 'rapidez solo en movimiento', formula: '(14 ÷ 0,40)', kind: 'rapidez-movimiento', check: { num: 14, den: 0.4 } },
      ],
      review: ['La salida (14:00) y la llegada (14:25) suman 25 min ≈ 0,42 h; la tabla usa 0,4 h. Con 25 min, la rapidez sería ≈ 33,6 km/h en lugar de 35 km/h.'],
    },
    {
      n: 2,
      title: 'Un recorrido de varios trayectos',
      lead: 'Ranchería El Dividivi → Manaure → Uribia → Ranchería Utta',
      map: { src: 'images/fisica/mapa-dia-2.jpg', w: 1055, h: 1148 },
      chart: 'images/fisica/grafica-dia-2.jpg',
      route: [[50, 1022], [56, 960], [62, 905], [82, 918], [100, 936], [125, 928], [200, 944], [260, 955], [300, 968], [340, 985], [400, 1000], [465, 1015], [520, 1025], [575, 1028], [608, 1030], [650, 935], [690, 850], [750, 720], [800, 605], [860, 470], [905, 375], [950, 300], [920, 296], [898, 272], [886, 230], [884, 195], [878, 176]],
      vectors: [
        { label: 'a', from: [50, 1022], to: [425, 860], kind: 'parcial' },
        { label: 'b', from: [425, 860], to: [878, 175], kind: 'parcial' },
        { label: 'R', from: [50, 1022], to: [878, 175], kind: 'resultante' },
      ],
      segments: [
        { code: 'A → B', from: 'Ranchería El Dividivi', to: 'Manaure', depart: '7:00', arrive: '8:15', hours: 1.25, km: 60, stopMin: 30, speed: 48 },
        { code: 'B → C', from: 'Manaure', to: 'Uribia', depart: '8:45', arrive: '9:30', hours: 0.75, km: 35, stopMin: 60, speed: 46.7 },
        { code: 'C → D', from: 'Uribia', to: 'Ranchería Utta', depart: '10:30', arrive: '12:15', hours: 1.75, km: 65, stopMin: null, speed: 37.1 },
      ],
      total: { depart: '7:00', arrive: '12:15', hours: 3.75, km: 160, stopMin: 90 },
      speeds: [
        { value: 30.5, label: 'rapidez media del día', formula: '(160 km ÷ 5,25 h)', kind: 'rapidez-media', check: { num: 160, den: 5.25 } },
        { value: 21.0, label: 'velocidad media, al noreste', formula: '(110 km ÷ 5,25 h)', kind: 'velocidad-media', check: { num: 110, den: 5.25 } },
        { value: 42.7, label: 'rapidez solo en movimiento', formula: '(160 ÷ 3,75)', kind: 'rapidez-movimiento', check: { num: 160, den: 3.75 } },
      ],
      review: [
        'El desplazamiento de 110 km al noreste es el valor reportado en la presentación; no se puede medir desde la captura porque el mapa no tiene escala.',
        'La ruta dibujada es la de la captura de Google Maps del día; las paradas intermedias se leen en la tabla.',
      ],
    },
    {
      n: 3,
      title: 'La trayectoria',
      lead: 'Ranchería Utta → Hotel Gimaura',
      map: { src: 'images/fisica/mapa-dia-3.jpg', w: 1056, h: 1148 },
      chart: 'images/fisica/grafica-dia-3.jpg',
      route: [[870, 142], [862, 165], [870, 192], [872, 240], [884, 280], [905, 300], [935, 302], [905, 352], [870, 420], [835, 492], [800, 562], [770, 625], [740, 690], [710, 760], [680, 830], [650, 900], [625, 960], [600, 1020], [585, 1050], [520, 1048], [480, 1047], [420, 1035], [370, 1022], [300, 1005], [260, 985], [200, 968], [150, 962], [90, 948], [65, 962], [40, 940], [22, 910]],
      vectors: [{ label: 'R', from: [870, 140], to: [20, 905], kind: 'resultante' }],
      segments: [{ code: 'A → B', from: 'Ranchería Utta', to: 'Hotel Gimaura', depart: '8:00', arrive: '11:00', hours: 3, km: 155, stopMin: null, speed: 51.7 }],
      total: { depart: '8:00', arrive: '11:00', hours: 3, km: 155, stopMin: 0 },
      speeds: [
        { value: 51.7, label: 'rapidez media del día', formula: '(155 km ÷ 3,00 h)', kind: 'rapidez-media', check: { num: 155, den: 3 } },
        { value: 51.7, label: 'rapidez solo en movimiento', formula: '(155 ÷ 3,00)', kind: 'rapidez-movimiento', check: { num: 155, den: 3 } },
      ],
      review: ['La gráfica del día 3 dice “Ranchería → Cabo”, mientras la tabla dice “Ranchería Utta → Hotel Gimaura”. Conviene unificar el sentido del trayecto.'],
    },
    {
      n: 4,
      title: 'El entorno de Los Flamencos',
      lead: 'Hotel Gimaura → Santuario de los Flamencos → Hotel',
      map: { src: 'images/fisica/mapa-dia-4.jpg', w: 1054, h: 1148 },
      chart: 'images/fisica/grafica-dia-4.jpg',
      route: [[862, 280], [848, 300], [800, 330], [760, 352], [700, 385], [655, 412], [620, 445], [590, 490], [560, 535], [545, 565], [525, 615], [500, 640], [440, 645], [500, 640], [482, 680], [462, 735], [440, 790], [415, 855], [370, 870], [330, 882], [280, 905], [250, 922], [238, 935], [232, 905], [190, 896], [150, 888], [110, 880], [50, 862]],
      vectors: [
        { label: 'a', from: [862, 278], to: [435, 645], kind: 'parcial' },
        { label: 'b', from: [435, 645], to: [45, 860], kind: 'parcial' },
        { label: 'R', from: [862, 278], to: [45, 860], kind: 'resultante' },
      ],
      segments: [
        { code: 'A → B', from: 'Hotel Gimaura', to: 'Santuario de los Flamencos', depart: '8:00', arrive: '8:30', hours: 0.5, km: 22, stopMin: 45, speed: 44 },
        { code: 'B → C', from: 'Santuario de los Flamencos', to: 'Hotel', depart: '9:15', arrive: '10:00', hours: 0.75, km: 43, stopMin: null, speed: 57.3 },
      ],
      total: { depart: '8:00', arrive: '10:00', hours: 1.25, km: 65, stopMin: 45 },
      speeds: [
        { value: 32.5, label: 'rapidez media del día', formula: '(65 km ÷ 2,00 h)', kind: 'rapidez-media', check: { num: 65, den: 2 } },
        { value: 52.0, label: 'rapidez solo en movimiento', formula: '(65 ÷ 1,25)', kind: 'rapidez-movimiento', check: { num: 65, den: 1.25 } },
      ],
      review: ['El destino del tramo B → C aparece como “Hotel” (texto incompleto en la diapositiva) y la gráfica lo llama “siguiente punto”.'],
    },
    {
      n: 5,
      title: 'El recorrido final',
      lead: 'Hotel Ma-Ziruma → Río Don Diego → Santa Marta',
      map: { src: 'images/fisica/mapa-dia-5.jpg', w: 1055, h: 1148 },
      chart: 'images/fisica/grafica-dia-5.jpg',
      route: [[945, 562], [948, 590], [935, 600], [890, 605], [850, 607], [810, 592], [778, 576], [740, 562], [700, 551], [660, 560], [620, 574], [596, 570], [540, 566], [480, 568], [462, 552], [440, 532], [420, 526], [395, 540], [330, 538], [280, 541], [240, 551], [205, 575], [165, 598], [135, 620], [122, 645], [118, 686]],
      vectors: [
        { label: 'a', from: [945, 558], to: [596, 566], kind: 'parcial' },
        { label: 'b', from: [596, 566], to: [118, 688], kind: 'parcial' },
        { label: 'R', from: [945, 558], to: [118, 688], kind: 'resultante' },
      ],
      segments: [
        { code: 'A → B', from: 'Hotel Ma-Ziruma', to: 'Río Don Diego', depart: '7:30', arrive: '8:15', hours: 0.75, km: 38, stopMin: 90, speed: 50.7 },
        { code: 'B → C', from: 'Río Don Diego', to: 'Santa Marta', depart: '9:45', arrive: '11:00', hours: 1.25, km: 58, stopMin: null, speed: 46.4 },
      ],
      total: { depart: '7:30', arrive: '11:00', hours: 2, km: 96, stopMin: 90 },
      speeds: [
        { value: 27.4, label: 'rapidez media del día', formula: '(96 km ÷ 3,50 h)', kind: 'rapidez-media', check: { num: 96, den: 3.5 } },
        { value: 48.0, label: 'rapidez solo en movimiento', formula: '(96 ÷ 2,00)', kind: 'rapidez-movimiento', check: { num: 96, den: 2 } },
      ],
      review: [],
    },
  ] as Day[],

  /** Slide 12 · Combustible (verbatim). */
  fuel: {
    rows: [
      { vehicle: 'Camionetas 4x4', days: 'Día 2 y Día 3', km: 315, efficiency: '18 L/100 km ≈ 8,4 km/gal', gallons: 37.5, price: '$11.320', cost: '$424.500' },
      { vehicle: 'Bus turístico', days: 'Día 1, 4 y 5', km: 175, efficiency: '30 L/100 km ≈ 12,6 km/gal', gallons: 13.9, price: '$11.320', cost: '$157.300' },
    ],
    total: { km: 490, gallons: 51.4, cost: '≈ $581.800' },
    priceLabel: 'Precio ACPM',
    review: [
      'Camionetas 4x4: 18 L/100 km equivalen a ≈ 21 km/gal (galón estadounidense, 3,785 L), no a 8,4 km/gal. Los galones (37,5) y el costo se calcularon con 8,4 km/gal; con 18 L/100 km serían ≈ 15 gal.',
      'La presentación no indica la fecha ni la fuente del precio del ACPM ($11.320 por galón).',
    ],
  },

  presentation: {
    title: 'Vectores en La Guajira',
    src: 'documents/vectores-en-la-guajira.pdf',
    downloadSrc: 'documents/vectores-en-la-guajira.pdf',
    kind: 'pdf',
    alt: 'Presentación de Física “Vectores en La Guajira”, 12 diapositivas.',
  } as DocumentAsset,
};

/** Recomputes a day's arithmetic from its own numbers. */
export function verifyDay(d: Day) {
  const toH = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  };
  const elapsed = toH(d.total.arrive) - toH(d.total.depart);
  const km = d.segments.reduce((s, x) => s + x.km, 0);
  const moving = d.segments.reduce((s, x) => s + x.hours, 0);
  const stops = d.segments.reduce((s, x) => s + (x.stopMin ?? 0), 0);
  const segmentChecks = d.segments.map((s) => {
    const clock = toH(s.arrive) - toH(s.depart);
    return { code: s.code, computed: s.km / s.hours, clockHours: clock, clockMatches: Math.abs(clock - s.hours) < 0.01 };
  });
  const speedChecks = d.speeds.map((s) => {
    const computed = s.check.num / s.check.den;
    return { ...s, computed, matches: Math.abs(computed - s.value) < 0.06 };
  });
  return {
    elapsed,
    kmMatches: km === d.total.km,
    movingMatches: Math.abs(moving - d.total.hours) < 0.01,
    stopsMatch: stops === d.total.stopMin,
    segmentChecks,
    speedChecks,
  };
}
