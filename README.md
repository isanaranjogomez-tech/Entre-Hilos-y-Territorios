# Entre Hilos y Territorios

*La Guajira contada a través de la ciencia, la cultura y el conocimiento.*
Proyecto de Síntesis — La Guajira 2026 · Grado noveno · Colegio Colombo Americano CAS.

React + TypeScript + Vite + React Router + Tailwind + GSAP ScrollTrigger + React Three Fiber.

## Rutas

| Ruta | Página | Idioma |
| --- | --- | --- |
| `/` | Entrada con paisaje ilustrado, pregunta, conceptos IB e índice de capítulos | Español |
| `/matematicas` | Geometría en el tejido Wayuu: mochila 3D guiada por scroll, exploración libre, Recursos | Español |
| `/ciencias` | Coastal Lagoons, Fishing & Water Quality: laguna, hábitat, modelo interactivo agua/combustible, Resources | Inglés |
| `/fisica` | Vectores en La Guajira: mapa de cinco días con vehículo y vectores, datos verificados, combustible, Recursos | Español |
| `/ingles` | Voices of La Guajira: sala de proyección de la entrevista animada, créditos, Resources | Inglés |
| `/lenguaje-sociales` | El atlas de los argumentos: libro interactivo + modo de lectura (ensayo final integrado) | Español |

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

Si agregas un archivo nuevo en `src/` y sus estilos no aparecen, reinicia `npm run dev`.

## Publicar

**GitHub Pages (versión de revisión):** https://isanaranjogomez-tech.github.io/Entre-Hilos-y-Territorios/

Cada `push` a la rama `main` ejecuta `.github/workflows/deploy.yml`: instala dependencias, comprueba tipos, compila con la ruta base del repositorio, copia `index.html` a cada ruta (para que entrar directo o recargar no dé 404) y publica en Pages. La URL no cambia entre despliegues. Para volver a desplegar sin cambios: pestaña **Actions → Deploy to GitHub Pages → Run workflow**.

Para recuperar una versión anterior, revierte el commit correspondiente en `main` (cada commit es un punto de restauración) y el sitio se vuelve a publicar solo.

**Material retenido de la versión pública:** el `.docx` original del ensayo (conserva comentarios de revisión) está en `.gitignore` y listado en `src/content/publication.ts`. Las figuras del ensayo se publican (permiso confirmado por la responsable del proyecto). Siguen en el proyecto local; en la web pública aparece un aviso. Para publicarlos, confirma el permiso y quítalos de ambos lugares.

Otros servidores: `vercel.json` (Vercel) y `public/_redirects` (Netlify) ya están incluidos; ahí la ruta base es `/`.

## Estructura

```
src/
  app/            router.tsx · Layout.tsx
  pages/          HomePage · MathematicsPage · SciencePage · PhysicsPage · EnglishPage · EssayPage
  experiences/mathematics/
    textile.ts                     geometría del cuerpo, textura tejida y capas geométricas
    WayuuMochila3D.tsx             la mochila 3D (una sola instancia por escena)
    stages.ts                      guion: cámara, rotación, capa y etiquetas según el progreso
    MochilaScene.tsx               canvas persistente del recorrido guiado
    MathematicsScrollController    sección sticky, subtítulos y navegación por etapas
    GeometryAnnotations.tsx        etiquetas ancladas a puntos del modelo
    MochilaExplorer.tsx            exploración libre (rotar, acercar, restablecer, figuras)
  components/     navigation · editorial · media · resources · interactive
  content/        textos académicos y configuración (ver abajo)
public/           documents · video · images
```

## Contenido

Todo el contenido académico está en `src/content/`. Un valor `null` significa “pendiente”: la página muestra una nota discreta con la ruta exacta del campo (por ejemplo `content/essay.ts → thesis`) en lugar de inventar contenido.

| Producto | Archivo | Qué completar |
| --- | --- | --- |
| Equipo, capítulo de Física | `project.ts` | `team`, `settings.physicsMode` (`separate` · `merged` · `hidden`) |
| Infografía de Matemáticas | `mathematics.ts` | ya integrada (texto literal y archivo) |
| Póster de Biología y Química | `science.ts` | ya integrado (texto literal, fotos, póster) |
| Física | `physics.ts` | ya integrada (datos de las diapositivas, rutas trazadas, PDF) |
| Entrevista en inglés | `english.ts` | `video.poster` (opcional) |
| Texto argumentativo | `essay.ts` | ya integrado (texto literal, figuras y .docx); el libro y el modo de lectura se llenan solos |

**Copia los textos académicos tal como fueron entregados. No los reescribas.**

## Autenticidad

- La mochila 3D es una **reconstrucción procedimental** basada en la mochila de la infografía. No es una réplica fotogramétrica y la página lo indica.
- Las capas geométricas (contorno del rombo, triángulos, lados paralelos, ángulos, traslación y eje de simetría) se dibujan sobre la figura ideal del tejido. El eje de simetría no afirma que la mochila hecha a mano sea perfectamente simétrica.
- El fondo de la portada es un detalle de esa misma textura reconstruida, y está rotulado.
- La simulación de Física permanece inactiva hasta que `physics.simulation` se defina con la presentación real.
- Los textos del recorrido de Matemáticas citan la infografía sin cambios.

## Revisiones

La versión anterior, de una sola página, está guardada en `../revisiones/entre-hilos-v1-una-pagina-2026-10-27.tgz`.

## Física: datos y rutas

`src/content/physics.ts` copia los valores de las diapositivas sin corregirlos. `verifyDay()` recalcula cada operación y la página muestra ambos valores; las diferencias aparecen como notas de revisión. Las rutas están trazadas a mano sobre cada captura de Google Maps (píxeles de la imagen): son una reconstrucción visual, no datos GPS.
