/**
 * SOURCE INVENTORY — what this build was made from, and what is missing.
 * Kept in code so the team can see integration status at a glance; the
 * epilogue renders it as "Estado del archivo".
 */

export const sourceInventory = {
  reviewed: [
    { file: '8.1 Formato de construcción de la Página Web. Proyecto de grado. Versión 2', use: 'Nombre oficial, pregunta, objetivo, conceptos IB, requisitos por asignatura y recursos de la Red Textual.' },
    { file: 'Hoja de Ruta Proyecto 2026', use: 'Calendario de entregas.' },
    { file: 'Tejiendo La Guajira (presentación)', use: 'Contextualización. Sus imágenes son generadas por IA (Gemini Notebook): no se usan como fotografía documental.' },
    { file: 'grupo -2.png — Geometría en el tejido Wayuu', use: 'Texto literal en /matematicas; archivo original en Recursos.' },
    { file: 'Los Flamencos — Póster e infografía conectados — Grupo 1.png', use: 'Texto literal en /ciencias; sus dos fotografías se muestran a tamaño original; póster en Resources.' },
    { file: 'VECTORES EN LA GUAJIRA - GRUPO 2.pdf', use: 'Datos de los cinco días, mapas y combustible en /fisica; PDF original en Recursos.' },
    { file: 'Discovering the Wayuu Culture (MP4 1080p + subtítulos .srt)', use: 'Entrevista integrada sin edición en /ingles.' },
    { file: 'Ensayo Guajira - Entrega final.docx', use: 'Texto literal, cuatro figuras y una pintura en /lenguaje-sociales; archivo original en Recursos.' },
  ],
  missing: [
    'El archivo MOV de la entrevista (copy_86A317DB…mov): macOS no permitió leerlo desde la carpeta temporal de Fotos. Guárdalo en Descargas para compararlo con el MP4 integrado.',
    'Fotografía panorámica original del viaje para la portada (hoy hay una ilustración rotulada).',
    'Fotografías de la mochila y del viaje en alta resolución (las del póster miden 253 × 112 px).',
  ],
  flags: [
    'El Formato de construcción indica que la página se elabora en Lovable; este sitio se desarrolló en React. Conviene confirmarlo con el docente de Computer Science.',
    'Inglés: la entrevista dura cerca de 3:50; el requisito es de 2 a 3 minutos. Es una animación 2D; el requisito pide que aparezcan los rostros y las voces de los participantes.',
    'Matemáticas: la infografía no nombra explícitamente ninguno de los cuatro conceptos IB.',
    'Física, día 1: 14:00–14:25 son 25 min (0,42 h); la tabla usa 0,4 h y obtiene 35 km/h (≈ 33,6 km/h con 25 min).',
    'Física, día 3: la gráfica dice “Ranchería → Cabo” y la tabla “Ranchería Utta → Hotel Gimaura”.',
    'Física, combustible: 18 L/100 km equivalen a ≈ 21 km/gal, no a 8,4 km/gal; los galones y el costo de las camionetas se calcularon con 8,4.',
    'Ensayo: el documento conserva cuatro comentarios sin resolver de la coordinación (título, organización de las representaciones culturales, organización social y la falta de fotografía para la cosmovisión y de los conceptos transversales).',
    'Ensayo: no nombra explícitamente los conceptos IB (cambio, sistema, perspectiva, cultura).',
    'Ensayo: no cita los recursos de Lenguaje de la Red Textual (Calle Alzate; Bilingüismo) y casi no incluye citas textuales entre comillas, que el requisito pide.',
    'Ensayo: la bibliografía repite la entrada del IGAC (2024 y 2025).',
    'Ensayo: las figuras 1 a 4 y la pintura son imágenes de terceros; confirmar permiso o atribución antes de publicar el sitio.',
    'Ensayo: la numeración I–III de los argumentos es una lectura estructural del sitio sobre las tres secciones tituladas del documento.',
    'Física aparece agrupada con Matemáticas y Geometría en el requisito oficial; el capítulo es configurable (separado, integrado u oculto).',
  ],
};
