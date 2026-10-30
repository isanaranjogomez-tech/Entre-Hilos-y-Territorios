import type { ChapterMeta } from './types';

/**
 * PROJECT SETTINGS
 * ----------------
 * `physicsMode` keeps the Physics chapter configurable, because the official
 * "Formato de construcción" groups Physics with Mathematics and Geometry
 * (one infographic), while the team also plans a separate presentation.
 *
 *  - 'separate' → /fisica is its own page and appears in the index.
 *  - 'merged'   → /fisica stays reachable, but the index lists it as part of
 *                 Mathematics and the Mathematics page links to it as an annex.
 *  - 'hidden'   → /fisica and its index entry are removed.
 */
export const settings = {
  physicsMode: 'separate' as 'separate' | 'merged' | 'hidden',
};

export const project = {
  title: ['Entre hilos', 'y territorios'],
  subtitle: 'La Guajira contada a través de la ciencia, la cultura y el conocimiento.',
  institution: 'Colegio Colombo Americano CAS',
  institutionMotto: 'Educating Transformative Leaders',
  level: 'Grado noveno',
  program: 'Proyecto de Síntesis — La Guajira 2026',
  /** Official project name, from "Formato de construcción de la Página web interactiva". */
  officialName:
    'Territorio, ambiente y cultura: interacciones sociedad-naturaleza en las comunidades de La Guajira',
  destination: 'La Guajira media y alta',
  researchQuestion:
    '¿De qué manera la oferta ambiental determina las interacciones sociedad-naturaleza, así como distintas representaciones culturales en las comunidades de la región de La Guajira?',
  /**
   * Phrases of the research question that the prologue highlights, in order.
   * They must appear verbatim inside `researchQuestion`.
   */
  questionHighlights: [
    { phrase: 'oferta ambiental', color: 'turquoise' },
    { phrase: 'interacciones sociedad-naturaleza', color: 'magenta' },
    { phrase: 'representaciones culturales', color: 'gold' },
  ] as const,
  objective:
    'Capturar y procesar información, en campo, que permita construir una perspectiva crítica sobre las diferentes maneras en que interactúan la sociedad y la naturaleza, en la generación de distintas manifestaciones culturales en sus comunidades.',
  ibConcepts: ['Perspectiva', 'Sistemas', 'Cambio', 'Cultura'] as const,
  /** Team, as credited on the science poster and the physics presentation. */
  team: ['Daniel Sierra', 'Julieta Borda', 'Luciana Mulett', 'Santiago Cortes', 'Isabella Naranjo'] as string[] | null,
  /** Deliverable calendar, from the official roadmap ("Hoja de Ruta 2026"). */
  calendar: [
    { when: 'Ciclo 6 · Día 6', what: 'Infografía de Matemáticas, Geometría y Física' },
    { when: 'Ciclo 7 · Día 3', what: 'Entrevista en inglés (Language Arts)' },
    { when: 'Ciclo 8 · Día 3', what: 'Texto argumentativo (Sociales y Lenguaje)' },
    { when: 'Ciclo 8 · Día 4', what: 'Póster científico (Biología y Química)' },
    { when: 'Ciclo 8 · Día 6', what: 'Página web interactiva (Computer Science)' },
  ],
};

export const chapters: ChapterMeta[] = [
  {
    id: 'matematicas',
    path: '/matematicas',
    numeral: 'I',
    title: 'Geometría en el tejido Wayuu',
    subject: 'Matemáticas y Geometría',
    product: 'Infografía',
    description: 'Una mochila wayuu reconstruida en 3D: rombos, ángulos, traslación y simetría leídos directamente sobre el tejido.',
    status: 'complete',
    lang: 'es',
  },
  {
    id: 'ciencias',
    path: '/ciencias',
    numeral: 'II',
    title: 'Coastal Lagoons, Fishing & Water Quality',
    subject: 'Biology + Chemistry',
    product: 'Scientific poster',
    description: 'Beneath the lagoon of Los Flamencos: habitat, fishing and the invisible chemistry of water and fuel.',
    status: 'complete',
    lang: 'en',
  },
  {
    id: 'fisica',
    path: '/fisica',
    numeral: 'III',
    title: 'Vectores en La Guajira',
    subject: 'Física',
    product: 'Presentación',
    description: 'Cinco días de viaje sobre el mapa: rutas, tiempos, rapidez y vectores de desplazamiento.',
    status: 'complete',
    lang: 'es',
  },
  {
    id: 'ingles',
    path: '/ingles',
    numeral: 'IV',
    title: 'Voices of La Guajira',
    subject: 'English · Language Arts',
    product: 'Animated interview',
    description: 'An animated role-play interview about Wayuu family life, communication, traditions, language and preservation.',
    status: 'complete',
    lang: 'en',
  },
  {
    id: 'lenguaje-sociales',
    path: '/lenguaje-sociales',
    numeral: 'V',
    title: 'El atlas de los argumentos',
    subject: 'Lenguaje y Sociales',
    product: 'Texto argumentativo',
    description: 'Un libro de investigación: la oferta ambiental de La Guajira y las representaciones culturales que origina.',
    status: 'complete',
    lang: 'es',
  },
];

/** Chapters listed in navigation and the homepage index, honouring `settings.physicsMode`. */
export const visibleChapters = chapters.filter((c) => c.id !== 'fisica' || settings.physicsMode === 'separate');

export const chapterById = (id: ChapterMeta['id']) => chapters.find((c) => c.id === id)!;

/** The chapter after `id` in the visible order (wraps to the first). */
export const nextChapter = (id: ChapterMeta['id']) => {
  const i = visibleChapters.findIndex((c) => c.id === id);
  return visibleChapters[(i + 1) % visibleChapters.length];
};
