import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let route = decodeURIComponent(url.pathname);
    if (base) {
      if (route === base) { res.writeHead(302, { Location: `${base}/` }); res.end(); return; }
      if (!route.startsWith(`${base}/`)) { res.writeHead(404); res.end('Not found'); return; }
      route = route.slice(base.length);
    }
    let filename = path.resolve(root, `.${route}`);
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); res.end('Forbidden'); return; }
    if ((await stat(filename)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { res.writeHead(302, { Location: `${url.pathname}/${url.search}` }); res.end(); return; }
      filename = path.join(filename, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' });
    res.end(await readFile(filename));
  } catch {
    const body = await readFile(path.join(root, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' });
    res.end(body);
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}${base}/`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
