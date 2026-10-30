// GitHub Pages serves static files only. Copy index.html to every route folder
// so direct visits and reloads of /matematicas, /ciencias… return the app
// (status 200), and to 404.html for any other unknown path.
import { copyFileSync, mkdirSync } from 'node:fs';

const routes = ['matematicas', 'ciencias', 'fisica', 'ingles', 'lenguaje-sociales'];
const index = 'dist/index.html';

for (const route of routes) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync(index, `dist/${route}/index.html`);
}
copyFileSync(index, 'dist/404.html');
console.log(`SPA fallback: ${routes.length} routes + 404.html`);
