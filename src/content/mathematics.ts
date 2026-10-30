import type { DocumentAsset, SourceRef } from './types';

/**
 * CHAPTER I — MATEMÁTICAS Y GEOMETRÍA
 *
 * Source of truth: the students' completed infographic "Geometría en el
 * tejido Wayuu". Its text is transcribed below verbatim from the revised
 * version shared on 2026-10-27, which is also the file in
 * /public/documents/geometria-en-el-tejido-wayuu.png.
 *
 * The 3D mochila on /matematicas is a procedural visual reconstruction based
 * on the mochila photographed in the infographic (see
 * experiences/mathematics/textile.ts). It is labelled as such on the page.
 */

export interface MathScene {
  id: string;
  step: string;
  title: string;
  /** Optional site remark about the 3D idealisation (not from the infographic). */
  note?: string;
  /** Verbatim text from the students' infographic for this scene. */
  infographicText: InfographicItem[] | null;
}

/** One fragment of the infographic, as written. `label` is the box/tag title. */
export interface InfographicItem {
  label?: string;
  text: string;
}

export const mathematics = {
  /** Section 3, second sentence of the infographic (verbatim). */
  bands: 'Las figuras forman franjas horizontales continuas alrededor de la mochila.',
  /** Heading and subheading of the infographic, verbatim. */
  infographicHeading: 'Geometría en el tejido Wayuu',
  infographicSubheading: 'Matemáticas • Salida pedagógica a La Guajira • Grado 9°',
  infographic: {
    title: 'Infografía de análisis de figuras y estructuras geométricas',
    src: 'documents/geometria-en-el-tejido-wayuu.png',
    downloadSrc: 'documents/geometria-en-el-tejido-wayuu.png',
    kind: 'image',
    alt: 'Infografía “Geometría en el tejido Wayuu”: imagen observada de una mochila con patrón de rombos, figuras geométricas presentes, organización del patrón, transformaciones geométricas, relación entre geometría y cultura, y por qué importa la geometría.',
  } as DocumentAsset,
  /**
   * Guided 3D sequence. `id` matches experiences/mathematics/stages.ts.
   * `infographicText` is verbatim; `note` (optional) is the site's own remark
   * about how the 3D overlay idealises the handmade textile.
   */
  scenes: [
    {
      id: 'mochila',
      step: '01',
      title: 'La mochila',
      infographicText: [{ label: 'Imagen observada', text: 'Mochila Wayuu con patrón geométrico de rombos' }],
    },
    {
      id: 'rombo',
      step: '02',
      title: 'El rombo',
      infographicText: [{ label: 'Rombos', text: 'Figura predominante del diseño.' }],
    },
    {
      id: 'figuras',
      step: '03',
      title: 'Triángulos, paralelas y ángulos',
      infographicText: [
        { label: 'Triángulos', text: 'Aparecen entre los motivos principales.' },
        { label: 'Líneas paralelas', text: 'Los lados opuestos de los rombos mantienen paralelismo.' },
        { label: 'Ángulos', text: 'Se distinguen ángulos agudos y obtusos.' },
      ],
    },
    {
      id: 'repeticion',
      step: '04',
      title: 'Repetición y traslación',
      infographicText: [
        { label: 'Cómo se organiza el patrón', text: 'Los rombos se repiten de izquierda a derecha, con tamaño y orientación semejantes y separación regular.' },
        { label: 'Traslación', text: 'El mismo rombo se desplaza horizontalmente sin cambiar forma, tamaño u orientación.' },
      ],
    },
    {
      id: 'simetria',
      step: '05',
      title: 'Simetría axial',
      infographicText: [{ label: 'Simetría axial', text: 'Un eje vertical divide el motivo en dos lados con una distribución semejante.' }],
      note: 'El eje se traza sobre la figura ideal del rombo. Un tejido hecho a mano no es perfectamente simétrico.',
    },
    {
      id: 'cultura',
      step: '06',
      title: 'Regularidad y cultura',
      infographicText: [
        { label: 'Regularidad', text: 'Triángulos y zigzags mantienen orden, proporciones y separación constante.' },
        { label: 'Zigzag', text: 'Completa el patrón entre franjas y contornos.' },
      ],
    },
  ] as MathScene[],
  /** Reflections from the infographic on geometry, weaving and cultural knowledge (verbatim). */
  reflections: [
    'Los patrones pueden relacionarse con el entorno, la vida cotidiana, la memoria y la identidad de la comunidad.',
    'El tejido también transmite conocimientos entre generaciones y mantiene viva una expresión cultural propia.',
  ] as string[] | null,
  /** "¿Por qué importa la geometría?" (verbatim). */
  whyItMatters: [
    'Organiza las figuras y mantiene las proporciones.',
    'Ayuda a repetir los motivos con precisión.',
    'Permite conservar equilibrio visual en todo el tejido.',
    'Conecta creatividad, precisión y tradición.',
  ] as string[] | null,
  /** Closing line of the infographic (verbatim). */
  closingReflection: 'Las matemáticas también viven en el arte y en los conocimientos ancestrales.' as string | null,
  references: [
    {
      label:
        'Morales-Peña, J. (2023). Saberes matemáticos ancestrales: una mirada Etnomatemática al tejido en lana de ovejo.',
      url: 'https://www.revista.etnomatematica.org/index.php/RevLatEm/article/view/733',
      provenance: 'Recurso de Matemáticas propuesto en el Formato de construcción',
    },
    {
      label:
        'Rodríguez, E. (2022). Matemáticas escolares emergentes en la elaboración de la Mochila wayúu: un estudio de observación participante en Estudiantes de grado séptimo. Universidad Distrital Francisco José de Caldas.',
      provenance: 'Recurso de Matemáticas propuesto en el Formato de construcción',
    },
  ] as SourceRef[],
};
