import assert from 'node:assert/strict';
import { readFile, readdir, cp, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(path.join(root, name), 'utf8');
const site = JSON.parse(await read('content/site.json'));
const origin = (process.env.SITE_URL || site.siteUrl).replace(/\/$/, '');
const base = (process.env.BASE_PATH ?? site.basePath).replace(/\/$/, '');
const unescape = value => value.replace(/&(amp|quot|lt|gt|#39);/g, x => ({'&amp;':'&', '&quot;':'"', '&lt;':'<', '&gt;':'>', '&#39;':"'"}[x]));
const pages = new Map();
async function scan(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name);
    if (item.isDirectory()) await scan(file);
    else if (item.name.endsWith('.html')) {
      const relative = path.relative(path.join(root, 'dist'), file).replaceAll('\\', '/');
      const route = relative.endsWith('index.html') ? relative.slice(0, -10) : relative;
      pages.set(`/${route}`, await readFile(file, 'utf8'));
    }
  }
}
await scan(path.join(root, 'dist'));
assert(pages.size > 0, 'Build before running verification.');
const titles = new Set(), descriptions = new Set();
for (const [route, html] of pages) {
  const error = route === '/404.html' || /\/404\/$/.test(route);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: one main heading`);
  assert.equal((html.match(/<main(?:\s|>)/g) || []).length, 1, `${route}: one main landmark`);
  assert(html.includes('name="description" content="'), `${route}: description`);
  if (error) {
    assert(html.includes('name="robots" content="noindex,follow"'), `${route}: error noindex`);
    assert(!canonical && !html.includes('hreflang=' + '"ko" href="' + origin + '/404/'), `${route}: no error canonical/alternates`);
    assert(!html.includes('application/ld+json'), `${route}: no schema on error pages`);
  } else {
    assert.equal(canonical, `${origin}${route}`, `${route}: self canonical`);
    assert(html.includes(`property="og:url" content="${canonical}"`), `${route}: sharing URL`);
    for (const name of ['twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) assert(html.includes(`name="${name}" content="`), `${route}: ${name}`);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/name="description" content="([^"]+)"/)?.[1];
    assert(title && !titles.has(title), `${route}: distinct title`); titles.add(title);
    assert(description && !descriptions.has(description), `${route}: distinct description`); descriptions.add(description);
  }
  if (site.preview) assert(html.includes('name="robots" content="noindex,follow"'), `${route}: preserve preview`);
  if (/\/contact\/$/.test(route)) {
    assert(html.includes('name="robots" content="noindex,follow"'), `${route}: contact utility stays noindex`);
    assert(html.includes(`mailto:${site.contactEmail}`), `${route}: keep the real contact channel available`);
  }
  for (const [, other, target] of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
    const targetPage = pages.get(new URL(unescape(target)).pathname.slice(base.length));
    assert(targetPage, `${route}: existing alternate ${target}`);
    assert(targetPage.includes(`<html lang="${other}">`), `${route}: alternate language`);
    assert(targetPage.includes(`href="${canonical}"`), `${route}: reciprocal alternate`);
  }
  const types = new Set();
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const data = JSON.parse(json); assert.equal(data['@context'], 'https://schema.org');
    for (const node of data['@graph'] || [data]) {
      assert(!types.has(node['@type']), `${route}: no duplicate schema type`); types.add(node['@type']);
      assert(!('aggregateRating' in node || 'review' in node), `${route}: no invented ratings`);
      if (node['@type'] === 'BreadcrumbList') assert(node.itemListElement.length >= 2);
    }
  }
  if (html.includes('class="article-header"') && html.includes('구성 확인용 예시') || html.includes('class="article-header"') && html.includes('Layout sample')) assert(!types.has('BlogPosting'), `${route}: samples are not real articles`);
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(unescape(raw), `https://local.invalid${base}${route}`);
    if (!['local.invalid', new URL(origin).hostname].includes(url.hostname)) continue;
    const pathname = url.hostname === 'local.invalid' ? url.pathname.slice(base.length) : url.pathname;
    const target = pages.get(pathname);
    if (target) {
      if (url.hash) assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: anchor ${raw}`);
    } else assert((await readFile(path.join(root, 'dist', decodeURIComponent(pathname)))).length, `${route}: asset ${raw}`);
  }
}
const robots = await read('dist/robots.txt');
assert(robots.includes('Allow: /'), 'Crawling must remain available to read noindex.');
if (site.preview) {
  assert(!robots.includes('Sitemap:'), 'No preview sitemap advertisement.');
  assert(!(await readdir(path.join(root, 'dist'))).includes('sitemap.xml'), 'No noindex URLs in sitemap.');
} else {
  const sitemap = await read('dist/sitemap.xml');
  assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Advertise the live HTTPS sitemap.');
  const locations = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => unescape(url)));
  for (const [route, html] of pages) {
    const indexable = html.includes('name="robots" content="index,follow"');
    assert.equal(locations.has(`${origin}${route}`), indexable, `${route}: sitemap matches indexing policy`);
  }
  for (const location of locations) assert(pages.has(new URL(location).pathname), `Existing sitemap page: ${location}`);
}

// --static-only checks generated output without spawning fixture builds.
if (!process.argv.includes('--static-only')) {
// Isolated fixtures exercise publication gates without changing source articles.
const tempRoot = path.resolve(os.tmpdir());
const fixture = await mkdtemp(path.join(tempRoot, 'roadpick-verify-'));
assert.equal(path.dirname(path.resolve(fixture)), tempRoot);
assert(path.basename(fixture).startsWith('roadpick-verify-'));
try {
  for (const directory of ['scripts', 'content', 'assets']) await cp(path.join(root, directory), path.join(fixture, directory), { recursive: true });
  const fixtureSite = { ...site, preview: false };
  const config = path.join(fixture, 'content/site.json');
  const env = { ...process.env, SITE_URL: 'https://roadpick.store', BASE_PATH: '' };
  const build = () => {
    const result = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: fixture, env, encoding: 'utf8' });
    if (result.error) throw result.error;
    return result;
  };
  await writeFile(config, JSON.stringify(fixtureSite));
  let result = build(); assert.equal(result.status, 0, result.stderr);
  const samplePage = await readFile(path.join(fixture, 'dist/articles/application-guide/index.html'), 'utf8');
  assert(samplePage.includes('content="noindex,follow"'), 'Sample stays noindex after public launch.');
  const publicHome = await readFile(path.join(fixture, 'dist/index.html'), 'utf8');
  assert(!publicHome.includes('href="/articles/application-guide/"'), 'Public listings hide samples.');
  const initialSitemap = await readFile(path.join(fixture, 'dist/sitemap.xml'), 'utf8');
  assert(!initialSitemap.includes('/articles/application-guide/'), 'Sample excluded from public sitemap.');
  const samples = [];
  for (const language of ['', 'en']) {
    const directory = path.join(fixture, 'content/articles', language);
    for (const name of await readdir(directory)) if (name.endsWith('.md')) samples.push(path.join(directory, name));
  }
  for (const file of samples) await writeFile(file, (await readFile(file, 'utf8')).replace('status: sample', 'status: ready'));
  const subject = samples.find(file => path.basename(file) === 'application-guide.md' && path.dirname(file).endsWith('articles'));
  const clean = await readFile(subject, 'utf8');
  await writeFile(subject, clean.replace('status: ready', 'status: unknown'));
  result = build(); assert.notEqual(result.status, 0); assert(result.stderr.includes('status must'));
  await writeFile(subject, clean.replace('status: ready', 'status: ready\ndate: 2026-02-30'));
  result = build(); assert.notEqual(result.status, 0); assert(result.stderr.includes('real YYYY-MM-DD'));
  await writeFile(subject, clean.replace('status: ready', 'status: ready\ndate: 2026-10-18\nmodified: 2026-10-19\nauthor: Verification fixture'));
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: fixture, env, stdio: 'pipe' });
  const page = await readFile(path.join(fixture, 'dist/articles/application-guide/index.html'), 'utf8');
  const graphs = [...page.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(([, json]) => { const data = JSON.parse(json); return data['@graph'] || [data]; });
  const article = graphs.find(node => node['@type'] === 'BlogPosting');
  assert.equal(article.datePublished, '2026-10-18'); assert.equal(article.dateModified, '2026-10-19');
  assert(page.includes('<time datetime="2026-10-19">2026-10-19</time>'));
  const sitemap = await readFile(path.join(fixture, 'dist/sitemap.xml'), 'utf8');
  assert(sitemap.includes('<lastmod>2026-10-19</lastmod>'));
  assert(!sitemap.includes('/404/') && !sitemap.includes('/category/finance/'), 'Exclude errors and empty categories.');
  assert((await readFile(path.join(fixture, 'dist/category/finance/index.html'), 'utf8')).includes('content="noindex,follow"'));
} finally {
  // The resolved, uniquely created directory is checked before recursive removal.
  assert.equal(path.dirname(path.resolve(fixture)), tempRoot);
  assert(path.basename(fixture).startsWith('roadpick-verify-'));
  await rm(fixture, { recursive: true, force: true });
}
}
console.log(`PASS: ${pages.size} generated pages; metadata, schema, links, languages, preview and publication gates${process.argv.includes('--static-only') ? ' (generated output only; isolated fixtures skipped)' : ''}.`);
