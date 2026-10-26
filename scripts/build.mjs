import { readFile, readdir, mkdir, writeFile, cp, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages, locales } from './locales.mjs';
import { siteInfo } from './site-info.mjs';
import { jsonLd, pageMetadata, sitemapXml } from './metadata.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const rawBase = process.env.BASE_PATH ?? site.basePath;
const base = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
if (base && (!/^\/[a-zA-Z0-9._/-]+$/.test(base) || base.split('/').some(s => s === '.' || s === '..'))) {
  throw new Error('BASE_PATH must be a safe repository path, such as /living-guide.');
}
const siteUrl = (process.env.SITE_URL || site.siteUrl || '').replace(/\/$/, '');
if (siteUrl) {
  const u = new URL(siteUrl);
  if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash) throw new Error('SITE_URL must be a public HTTPS URL.');
}
if (!site.preview && !siteUrl) throw new Error('A verified SITE_URL is required before public indexing.');

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
if (!/^[^\s<>"'@]+@[^\s<>"'@]+\.[^\s<>"'@]+$/.test(site.contactEmail || '') || !site.operatorName) throw new Error('Confirmed operator display name and contact email are required.');
if (!/^assets\/brand\/[a-zA-Z0-9_-]+\.webp$/.test(site.brandImage || '')) throw new Error('A local brand image is required.');
await lstat(path.join(root, site.brandImage));
const href = route => `${base}/${route}`;
const menuLanguages = ['ko', 'zh-Hans', 'ja', 'vi'];
const languageDirectory = lang => ({ ko: '', en: 'en', 'zh-Hans': 'zh', ja: 'ja', vi: 'vi' })[lang];
const languageLabel = lang => ({ ko: '한국어', en: 'English', 'zh-Hans': '简体中文', ja: '日本語', vi: 'Tiếng Việt' })[lang];
const shareLanguage = lang => ({ ko: 'ko_KR', en: 'en_US', 'zh-Hans': 'zh_CN', ja: 'ja_JP', vi: 'vi_VN' })[lang];
const localizedRoute = (route, lang = 'ko') => `${languageDirectory(lang) ? languageDirectory(lang) + '/' : ''}${route}`;
const groupRoute = (group, lang = 'ko') => localizedRoute(`category/${group.slug}/`, lang);
const categoryRoute = groupRoute;
const articleRoute = article => localizedRoute(`articles/${article.slug}/`, article.lang);
const siteName = lang => lang === 'ko' ? site.name : ({ 'zh-Hans': site.zhName, ja: site.jaName, vi: site.viName })[lang] || site.enName;
const siteDescription = lang => ({ ko: site.description, en: site.enDescription, 'zh-Hans': site.zhDescription, ja: site.jaDescription, vi: site.viDescription })[lang];
const categoryName = (category, lang) => ({ ko: category.name, en: category.enName, 'zh-Hans': category.zhName, ja: category.jaName, vi: category.viName })[lang];
const categoryLabel = (category, lang) => ({ ko: category.menuLabel, en: category.enMenuLabel, 'zh-Hans': category.zhMenuLabel, ja: category.jaMenuLabel, vi: category.viMenuLabel })[lang];
if (!site.enName || !site.enDescription || !site.zhDescription) throw new Error('English site name and description are required.');
const categories = site.categories.map(group => {
  if (!/^[a-z0-9-]+$/.test(group.slug) || !/^[a-z0-9-]+\.svg$/.test(group.image) || !group.name || !group.menuLabel || !group.enName || !group.enMenuLabel || !group.zhName || !group.zhMenuLabel) throw new Error('Invalid category.');
  return { ...group, group };
});
if (new Set(categories.map(c => c.name)).size !== categories.length || new Set(categories.map(c => c.slug)).size !== categories.length) throw new Error('Category names and slugs must be unique.');
const breadcrumb = (items, lang, structured = true) => {
  const nav = `<nav class="breadcrumb" aria-label="${locales[lang].location}">${items.map((item, i) => `${i ? '<span aria-hidden="true">›</span>' : ''}${item.route !== undefined ? `<a href="${href(item.route)}">${escape(item.label)}</a>` : `<span aria-current="page">${escape(item.label)}</span>`}`).join('')}</nav>`;
  return nav + (siteUrl && structured && items.length > 1 ? jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.label, ...(item.route !== undefined ? { item: `${siteUrl}/${item.route}` } : {}) })) }) : '');
};
const ctaTargets = [];
function ctaLink(target) {
  if (/\s|\\/.test(target)) throw new Error(`Invalid button link: ${target}`);
  if (target.startsWith('https://')) {
    const url = new URL(target);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) throw new Error('Button links must use a public HTTPS URL without credentials.');
    return url.href;
  }
  if (!target.startsWith('/') || target.startsWith('//')) throw new Error('Button links must start with / or https://.');
  const url = new URL(target, 'https://preview.invalid');
  const rawPath = decodeURIComponent(target.split(/[?#]/)[0]);
  if (rawPath.startsWith('//') || rawPath.includes('\\') || rawPath.split('/').some(s => s === '.' || s === '..')) throw new Error('Button links cannot traverse directories.');
  ctaTargets.push({ route: decodeURIComponent(url.pathname), fragment: decodeURIComponent(url.hash.slice(1)) });
  return `${href(url.pathname.slice(1))}${url.search}${url.hash}`;
}
const inline = value => {
  // Source text is escaped first; arbitrary HTML and javascript: links are never emitted.
  return escape(value).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
};

async function renderMarkdown(markdown, lang) {
  const ui = locales[lang];
  const lines = markdown.replace(/\r/g, '').split('\n');
  const html = [], toc = [];
  let paragraph = [], list = null, section = 0;
  const flushParagraph = () => { if (paragraph.length) html.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; };
  const closeList = () => { if (list) html.push(`</${list}>`); list = null; };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { flushParagraph(); closeList(); continue; }
    const image = /^!\[([^\]]+)\]\((assets\/images\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp))\)$/.exec(line);
    if (image) {
      flushParagraph(); closeList();
      const [, alt, source] = image;
      if (source.split('/').some(part => part === '.' || part === '..')) throw new Error('Invalid article image path.');
      const bytes = await readFile(path.join(root, source));
      let width, height;
      if (bytes.length >= 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
        width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20);
      } else if (bytes.length >= 30 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
        for (let offset = 12; offset + 8 <= bytes.length;) {
          const type = bytes.toString('ascii', offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8;
          if (start + size > bytes.length) break;
          if (type === 'VP8X' && size >= 10) {
            width = 1 + bytes.readUIntLE(start + 4, 3); height = 1 + bytes.readUIntLE(start + 7, 3); break;
          }
          if (type === 'VP8 ' && size >= 10 && bytes.subarray(start + 3, start + 6).toString('hex') === '9d012a') {
            width = bytes.readUInt16LE(start + 6) & 0x3fff; height = bytes.readUInt16LE(start + 8) & 0x3fff; break;
          }
          if (type === 'VP8L' && size >= 5 && bytes[start] === 0x2f) {
            const bits = bytes.readUInt32LE(start + 1);
            width = 1 + (bits & 0x3fff); height = 1 + ((bits >>> 14) & 0x3fff); break;
          }
          offset = start + size + (size % 2);
        }
      } else if (bytes.length >= 4 && bytes.readUInt16BE(0) === 0xffd8) {
        for (let offset = 2; offset + 9 < bytes.length;) {
          if (bytes[offset] !== 0xff) break;
          const marker = bytes[offset + 1], length = bytes.readUInt16BE(offset + 2);
          if (length < 2 || offset + length + 2 > bytes.length) break;
          if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
            height = bytes.readUInt16BE(offset + 5); width = bytes.readUInt16BE(offset + 7); break;
          }
          offset += length + 2;
        }
      }
      if (!width || !height) throw new Error('Article image dimensions are missing.');
      html.push(`<figure class="article-figure"><a href="${href(source)}" aria-label="${escape(alt)}"><img src="${href(source)}" width="${width}" height="${height}" alt="${escape(alt)}" loading="lazy" decoding="async"></a><figcaption>${escape(alt)}</figcaption></figure>`);
      continue;
    }
    if (line === ':::cta' || line === ':::cta hand') {
      flushParagraph(); closeList();
      const hand = line === ':::cta hand';
      const description = [], links = [];
      while (++i < lines.length && lines[i].trim() !== ':::') {
        const row = lines[i].trim();
        if (!row) continue;
        const link = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(row);
        if (link) {
          const label = link[1].trim();
          if (!label) throw new Error('A button label is required.');
          links.push({ label, url: ctaLink(link[2]) });
        } else {
          if (row.startsWith('[')) throw new Error('Use one [button label](URL) per line inside a CTA block.');
          description.push(row);
        }
      }
      if (i >= lines.length) throw new Error('CTA block is missing its closing :::.');
      if (!links.length) throw new Error('A CTA block must contain at least one button link.');
      const icon = hand ? '<span class="cta-icon cta-icon-hand" aria-hidden="true">👉</span>' : '<span class="cta-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      html.push(`<nav class="article-cta" aria-label="${ui.cta}">${description.length ? `<p class="article-cta-description">${inline(description.join(' '))}</p>` : ''}<div class="article-cta-buttons">${links.map(link => `<a class="article-cta-button" href="${escape(link.url)}">${icon}<span>${escape(link.label)}</span></a>`).join('')}</div></nav>`);
      continue;
    }
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length, id = `section-${++section}`;
      toc.push({ title: heading[2], id, level });
      html.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith('|') && /^\|?\s*:?-+/.test(lines[i + 1]?.trim() || '')) {
      flushParagraph(); closeList();
      const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
      const headers = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      i--;
      html.push(`<div class="table-scroll" role="region" aria-label="${ui.table}" tabindex="0"><table><thead><tr>${headers.map(x => `<th scope="col">${inline(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((_, j) => `<td>${inline(row[j] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const item = /^(?:([-*])|\d+\.)\s+(.+)$/.exec(line);
    if (item) {
      flushParagraph();
      const type = item[1] ? 'ul' : 'ol';
      if (list !== type) { closeList(); html.push(`<${type}>`); list = type; }
      html.push(`<li>${inline(item[2])}</li>`);
      continue;
    }
    closeList(); paragraph.push(line);
  }
  flushParagraph(); closeList();
  return { html: html.join('\n'), toc };
}

const files = [];
for (const lang of languages) {
  const directory = path.join(root, 'content/articles', languageDirectory(lang));
  const names = await readdir(directory).catch(error => { if (error.code === 'ENOENT' && lang !== 'ko') return []; throw error; });
  files.push(...names.filter(file => file.endsWith('.md')).sort().map(file => ({ file, lang, directory })));
}
const articles = [];
for (const { file, lang, directory } of files) {
  const source = (await readFile(path.join(directory, file), 'utf8')).replace(/^\uFEFF/, '').replace(/\r/g, '');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: front matter is missing.`);
  const metadata = Object.fromEntries(match[1].split('\n').filter(Boolean).map(line => {
    const colon = line.indexOf(':');
    if (colon < 1) throw new Error(`${file}: invalid metadata.`);
    return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
  }));
  if (metadata.status === 'draft') continue;
  if (!['ready', 'sample'].includes(metadata.status)) throw new Error(`${file}: status must be draft, sample or ready.`);
  if (metadata.lang && metadata.lang !== lang) throw new Error(`${file}: lang must match its directory (${lang}).`);
  if (!metadata.title || !metadata.summary || !metadata.description) throw new Error(`${file}: title, summary and description are required.`);
  if (Boolean(metadata.primaryCtaLabel) !== Boolean(metadata.primaryCtaUrl)) throw new Error(`${file}: primaryCtaLabel and primaryCtaUrl must be provided together.`);
  const category = categories.find(c => [c.name, c.menuLabel, c.enName, c.enMenuLabel, c.slug, ...(c.aliases || [])].includes(metadata.category));
  if (!category) throw new Error(`${file}: unknown category.`);
  const slug = file.replace(/\.md$/, '');
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: use lowercase letters and hyphens in filenames.`);
  const translationKey = metadata.translationKey || slug;
  if (!/^[a-z0-9-]+$/.test(translationKey)) throw new Error(`${file}: translationKey must use lowercase letters, digits and hyphens.`);
  for (const field of ['date', 'modified']) {
    const date = metadata[field];
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) throw new Error(`${file}: ${field} must be a real YYYY-MM-DD date.`);
  }
  if (metadata.modified && !metadata.date) throw new Error(`${file}: modified requires the original date.`);
  if (metadata.modified && metadata.modified < metadata.date) throw new Error(`${file}: modified cannot precede date.`);
  const keywords = [...new Set((metadata.keywords || '').split(',').map(word => word.normalize('NFKC').replace(/\s+/g, '').toLowerCase()).filter(Boolean))];
  const cover = metadata.cover || `assets/${category.image}`;
  if (metadata.cover) {
    if (!/^assets\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/.test(cover) || cover.split('/').some(part => part === '.' || part === '..')) throw new Error(`${file}: cover must be a local image in assets/images/.`);
    if (!(await lstat(path.join(root, cover))).isFile()) throw new Error(`${file}: cover image is missing.`);
  }
  const rendered = await renderMarkdown(match[2], lang);
  const bodyText = rendered.html.replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[entity])).replace(/\s+/g, ' ');
  const searchText = [metadata.title, metadata.description, metadata.summary, categoryName(category, lang), categoryLabel(category, lang), keywords.join(' '), bodyText].join(' ');
  articles.push({ ...metadata, cover, lang, translationKey, keywords, slug, category, searchText, ...rendered });
}
articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const articleByTranslation = new Map();
for (const article of articles) {
  const key = `${article.lang}:${article.translationKey}`;
  if (articleByTranslation.has(key)) throw new Error(`Duplicate translationKey in ${article.lang}: ${article.translationKey}`);
  articleByTranslation.set(key, article);
}
const recommendedSlugs = site.recommendedArticles ?? [];
if (!Array.isArray(recommendedSlugs) || recommendedSlugs.some(slug => typeof slug !== 'string')) throw new Error('recommendedArticles must be an array of translation keys.');
for (const key of recommendedSlugs) if (!articles.some(article => article.translationKey === key)) throw new Error(`Recommended article is missing or is a draft: ${key}`);

function readingSuggestions(article) {
  const { lang } = article, ui = locales[lang];
  const eligible = candidate => candidate && candidate.lang === lang && (article.status !== 'ready' || candidate.status === 'ready');
  const sameLanguage = articles.filter(eligible);
  const picks = [...new Set(recommendedSlugs)].map(key => articleByTranslation.get(`${lang}:${key}`)).filter(candidate => eligible(candidate) && candidate.slug !== article.slug).slice(0, 3);
  const reserved = new Set(picks.map(candidate => candidate.slug));
  const keywords = new Set(article.keywords);
  const related = sameLanguage.filter(candidate => candidate.slug !== article.slug && !reserved.has(candidate.slug)).map(candidate => {
    const sharedKeywords = candidate.keywords.filter(word => keywords.has(word)).length;
    const sameCategory = candidate.category.slug === article.category.slug;
    return { article: candidate, sharedKeywords, sameCategory };
  }).filter(candidate => candidate.sharedKeywords > 0 || candidate.sameCategory)
    .sort((a, b) => b.sharedKeywords - a.sharedKeywords || Number(b.sameCategory) - Number(a.sameCategory) || (b.article.date || '').localeCompare(a.article.date || '') || a.article.slug.localeCompare(b.article.slug))
    .slice(0, 3).map(candidate => candidate.article);
  if (!related.length && !picks.length) return '';
  const readingList = entries => `<ul class="reading-list">${entries.map(candidate => `<li><a class="reading-button" href="${href(articleRoute(candidate))}"><span class="cta-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>${escape(candidate.title)}</strong></a></li>`).join('')}</ul>`;
  const section = (title, entries, key) => entries.length ? `<section class="reading-group" aria-labelledby="reading-${key}"><h3 id="reading-${key}">${title}</h3>${readingList(entries)}</section>` : '';
  return `<section class="article-discovery" id="more-articles" aria-labelledby="discovery-title"><div class="discovery-heading"><h2 id="discovery-title">${ui.discovery}</h2><p>${ui.discoveryText}</p></div>${section(ui.related, related, 'related')}${section(ui.recommended, picks, 'recommended')}<nav class="discovery-footer" aria-label="${ui.discoverMore}"><a href="${href(categoryRoute(article.category, lang))}">${escape(ui.categoryMore(categoryName(article.category, lang)))} <span aria-hidden="true">→</span></a><a href="${href(localizedRoute('articles/', lang))}">${ui.allLink} <span aria-hidden="true">→</span></a></nav></section>`;
}

// This build only replaces its own fixed dist directory; it never touches another checkout.
if (path.relative(root, out) !== 'dist') throw new Error('Unexpected build target.');
try { if ((await lstat(out)).isSymbolicLink()) throw new Error('Refusing to replace a linked output directory.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });

function header(active, lang, variants) {
  const ui = locales[lang];
  const nav = site.categories.map(c => `<a href="${href(groupRoute(c, lang))}"${active === c.slug ? ' class="active-group" aria-current="true"' : ''}>${escape(categoryLabel(c, lang))}</a>`).join('');
  const switches = menuLanguages.map(other => other === lang
    ? `<span lang="${other}" aria-current="true">${languageLabel(other)}</span>`
    : `<a lang="${other}" hreflang="${other}" href="${href(variants[other] ?? `${localizedRoute('articles/', other)}#translation-unavailable`)}">${languageLabel(other)}</a>`).join('<span class="language-divider" aria-hidden="true">/</span>');
  return `<a class="skip-link" href="#main">${ui.skip}</a>
  <header class="site-header simple-header"><div class="header-inner">
    <div class="brand-row"><a class="brand" href="${href(localizedRoute('', lang))}" aria-label="${escape(siteName(lang))} ${ui.home}"><span class="brand-symbol" aria-hidden="true"><img src="${href(site.brandImage)}" width="1024" height="1024" alt=""></span><span>${escape(siteName(lang))}</span>${site.temporaryName ? `<span class="temporary-name">${ui.temporary}</span>` : ''}</a></div>
    <nav class="main-nav" aria-label="${ui.menu}">${nav}</nav>
  </div><div class="header-search"><nav class="language-switch" aria-label="${ui.language}">${switches}</nav><form class="site-search" data-site-search role="search" action="${href(localizedRoute('articles/', lang))}" method="get"><label class="sr-only" for="site-query">${ui.searchLabel}</label><input id="site-query" name="q" type="search" maxlength="120" placeholder="${ui.searchPlaceholder}" autocomplete="off"><button type="submit">${ui.search}</button></form></div></header>`;
}

const footer = lang => {
  const ui = locales[lang];
  return `<footer class="site-footer"><div class="footer-inner"><p class="footer-brand">${escape(siteName(lang))}${site.temporaryName ? ` <small>${ui.temporary}</small>` : ''}</p><nav aria-label="${ui.siteInfo}"><a href="${href(localizedRoute('articles/', lang))}">${ui.allLink}</a>${Object.entries(ui.info).map(([route, info]) => `<a href="${href(localizedRoute(`${route}/`, lang))}">${info.title}</a>`).join('')}</nav><p class="footer-note">${site.preview ? ui.footerNote : escape(siteDescription(lang))}</p><p class="copyright">© ${escape(siteName(lang))}</p></div></footer>`;
};

const builtRoutes = [];
const listedArticles = articles.filter(article => site.preview || article.status === 'ready');
async function save(route, title, description, content, lang, active = '', articleVariants) {
  const ui = locales[lang];
  const actualRoute = localizedRoute(route, lang);
  const variants = articleVariants ?? Object.fromEntries(languages.map(other => [other, localizedRoute(route, other)]));
  const article = articles.find(a => a.lang === lang && route === `articles/${a.slug}/`);
  const emptyCategory = route.startsWith('category/') && !listedArticles.some(a => a.lang === lang && route === `category/${a.category.slug}/`);
  const emptyListing = (route === '' || route === 'articles/') && !listedArticles.some(a => a.lang === lang);
  // Contact is an operational utility page, retained in navigation but excluded from search.
  const noindex = site.preview || route === '404/' || route === 'contact/' || article?.status === 'sample' || emptyCategory || emptyListing;
  const canonical = siteUrl && route !== '404/' ? `${siteUrl}/${actualRoute}` : '';
  const shareImage = article?.cover ? `${siteUrl}/${article.cover}` : `${siteUrl}/${site.brandImage}`;
  const shareAlt = article ? article.coverSample === 'true' ? lang === 'ko' ? 'AI가 만든 화면 구성용 예시 이미지' : 'AI-generated layout illustration' : article.title : 'ROAD-PEAK — DRIVE THE PEAK';
  const shareLocale = shareLanguage(lang);
  const sharing = canonical ? `<meta property="og:type" content="${article?.status === 'ready' ? 'article' : 'website'}"><meta property="og:site_name" content="${escape(siteName(lang))}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:locale" content="${shareLocale}">${Object.keys(variants).filter(other => other !== lang).map(other => `<meta property="og:locale:alternate" content="${shareLanguage(other)}">`).join('')}<meta property="og:image" content="${escape(shareImage)}"><meta property="og:image:alt" content="${escape(shareAlt)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(shareImage)}"><meta name="twitter:image:alt" content="${escape(shareAlt)}">` : '';
  const alternates = canonical && Object.keys(variants).length > 1 ? Object.entries(variants).map(([other, otherRoute]) => `<link rel="alternate" hreflang="${other}" href="${escape(`${siteUrl}/${otherRoute}`)}">`).join('') : '';
  const schema = pageMetadata({ site: { ...site, siteUrl }, lang, route, canonical, title, description, article, emptyCategory });
  const ownershipTag = lang === 'ko' && route === '' && site.naverSiteVerification
    ? `<meta name="naver-site-verification" content="${escape(site.naverSiteVerification)}">` : '';
  const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}${title === siteName(lang) ? '' : ` | ${escape(siteName(lang))}`}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">${canonical ? `<link rel="canonical" href="${escape(canonical)}">` : ''}${alternates}${sharing}${schema}${ownershipTag}<meta name="theme-color" content="#ffffff"><link rel="icon" href="${href('assets/favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${href('assets/style.css')}"></head><body>${header(active, lang, variants)}${site.preview ? `<div class="preview-note"><span class="preview-dot" aria-hidden="true"></span>${ui.preview} <span class="preview-divider">·</span> ${ui.previewText}</div>` : ''}${content}${footer(lang)}<script src="${href('assets/search.js')}" defer></script></body></html>`;
  const target = path.join(out, actualRoute, 'index.html');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
  if (!noindex) builtRoutes.push({ route: actualRoute, ...(article && (article.modified || article.date) ? { modified: article.modified || article.date } : {}) });
}

const meta = a => {
  const ui = locales[a.lang];
  const detail = a.date ? `<time datetime="${escape(a.date)}">${escape(a.lang === 'ko' ? a.date.replaceAll('-', '.') : a.date)}</time>` : a.status === 'sample' ? `<span>${ui.sample}</span>` : '';
  return `<div class="post-meta"><a href="${href(categoryRoute(a.category, a.lang))}">${escape(categoryName(a.category, a.lang))}</a>${detail ? `<span aria-hidden="true">·</span>${detail}` : ''}${a.modified ? `<span aria-hidden="true">·</span><span>${a.lang === 'ko' ? '수정' : a.lang === 'zh-Hans' ? '更新' : a.lang === 'ja' ? '更新' : a.lang === 'vi' ? 'Cập nhật' : 'Updated'} <time datetime="${escape(a.modified)}">${escape(a.modified)}</time></span>` : ''}${a.author ? `<span aria-hidden="true">·</span><span>${escape(a.author)}</span>` : ''}</div>`;
};
const list = (entries, lang) => `<div class="post-list" data-search-list>${entries.map(a => `<article class="post-card" data-search-text="${escape(a.searchText)}"><a class="thumbnail" href="${href(articleRoute(a))}" tabindex="-1" aria-hidden="true"><img src="${href(a.cover)}" width="600" height="400" alt="" loading="lazy" decoding="async">${a.coverSample === 'true' ? `<span class="thumbnail-label">${lang === 'ko' ? 'AI 예시' : lang === 'zh-Hans' ? 'AI 示例' : lang === 'ja' ? 'AIサンプル' : lang === 'vi' ? 'Ảnh AI mẫu' : 'AI sample'}</span>` : ''}</a><div class="post-card-content">${meta(a)}<h2><a href="${href(articleRoute(a))}">${escape(a.title)}</a></h2><p>${escape(a.description)}</p></div></article>`).join('')}</div>`;
const emptyState = lang => {
  const ui = locales[lang];
  return `<div class="empty-state"><span class="empty-mark" aria-hidden="true">＋</span><h2>${ui.preparingTitle}</h2><p>${ui.preparingText}</p><div><a href="${href(localizedRoute('articles/', lang))}">${ui.allLink} <span aria-hidden="true">→</span></a></div></div>`;
};

for (const lang of languages) {
  const ui = locales[lang], entries = listedArticles.filter(article => article.lang === lang);
  const searchStatus = `<p class="search-status" data-search-status role="status" aria-live="polite">${ui.count(entries.length)}</p>`;
  const searchEmpty = `<div class="search-empty" data-search-empty hidden><h2>${ui.searchEmpty}</h2><p>${ui.searchHint}</p><button type="button" data-search-clear>${ui.allLink}</button></div><noscript><p class="search-fallback">${ui.noScript}</p></noscript>`;
  const fallback = `<aside class="translation-notice translation-fallback" id="translation-unavailable"><strong>${ui.fallbackTitle}</strong><p>${ui.fallback}</p></aside>`;
  const intro = `<section class="site-intro" aria-label="${ui.info.about.title}"><div><p class="intro-eyebrow">${lang === 'ko' ? '필요한 정보를, 고르기 쉽게' : lang === 'zh-Hans' ? '实用信息，轻松选择' : lang === 'ja' ? '必要な情報を、選びやすく' : lang === 'vi' ? 'Thông tin hữu ích, lựa chọn dễ dàng' : 'Practical answers, easier choices'}</p><h1>${escape(siteName(lang))}</h1><p>${escape(siteDescription(lang))}</p></div><img src="${href(site.brandImage)}" width="1024" height="1024" alt="ROAD-PEAK — DRIVE THE PEAK" decoding="async"></section>`;
  await save('', siteName(lang), siteDescription(lang), `<main id="main" class="listing-main home-main" data-search-page>${intro}<div class="listing-heading"><h2 data-search-title>${ui.latest}</h2>${searchStatus}</div>${list(entries, lang)}${!entries.length ? emptyState(lang) : ''}${searchEmpty}<a class="browse-all" href="${href(localizedRoute('articles/', lang))}">${ui.allLink} <span aria-hidden="true">→</span></a></main>`, lang, 'home');
  await save('articles/', ui.all, ui.allDescription, `<main id="main" class="listing-main" data-search-page>${breadcrumb([{label:ui.home,route:localizedRoute('', lang)},{label:ui.all}], lang)}${fallback}<div class="listing-heading"><h1 data-search-title>${ui.all}</h1>${searchStatus}</div>${list(entries, lang)}${!entries.length ? emptyState(lang) : ''}${searchEmpty}</main>`, lang, 'all');
  for (const group of site.categories) {
    const matches = entries.filter(a => a.category.slug === group.slug), name = categoryName(group, lang);
    await save(`category/${group.slug}/`, name, ui.categoryDescription(name), `<main id="main" class="listing-main">${breadcrumb([{label:ui.home,route:localizedRoute('', lang)},{label:name}], lang)}<div class="listing-heading"><h1>${escape(name)}</h1><span class="post-count">${ui.count(matches.length)}</span></div>${matches.length ? list(matches, lang) : emptyState(lang)}</main>`, lang, group.slug);
  }
  for (const a of articles.filter(article => article.lang === lang)) {
    const variants = Object.fromEntries(languages.map(other => articleByTranslation.get(`${other}:${a.translationKey}`)).filter(Boolean).map(other => [other.lang, articleRoute(other)]));
    const missing = Object.keys(variants).length === 1 ? `<aside class="translation-notice"><p>${ui.missingTranslation} <a href="${href(`${localizedRoute('articles/', lang)}#translation-unavailable`)}">${ui.missingLink} <span aria-hidden="true">→</span></a></p></aside>` : '';
    const quickCta = a.primaryCtaUrl ? (await renderMarkdown(`:::cta hand\n[${a.primaryCtaLabel}](${a.primaryCtaUrl})\n:::`, lang)).html : '';
    const toc = a.toc.length ? `<details class="toc" open><summary>${ui.toc} <span aria-hidden="true">⌄</span></summary><ol>${a.toc.filter(x => x.level === 2).map(x => `<li><a href="#${x.id}">${escape(x.title)}</a></li>`).join('')}</ol></details>` : '';
    await save(`articles/${a.slug}/`, a.title, a.description, `<main id="main" class="article-main">${breadcrumb([{label:ui.home,route:localizedRoute('', lang)},{label:categoryName(a.category, lang),route:categoryRoute(a.category, lang)},{label:a.title}], lang, a.status === 'ready')}<article><header class="article-header"><h1>${escape(a.title)}</h1>${meta(a)}</header>${missing}<div class="answer-summary"><span class="summary-label">${ui.summary}</span><p>${escape(a.summary)}</p></div>${quickCta}${readingSuggestions(a)}${toc}<div class="article-body">${a.html}</div></article></main>`, lang, a.category.slug, variants);
  }
  const infoPage = (title, body, structured = true) => `<main id="main" class="article-main info-page">${breadcrumb([{label:ui.home,route:localizedRoute('', lang)},{label:title}], lang, structured)}<h1>${escape(title)}</h1><div class="article-body">${body}</div></main>`;
  for (const [route, info] of Object.entries(siteInfo({...site, brandImageHref:escape(href(site.brandImage))}, lang, escape))) {
    if (!info.body && !site.preview) throw new Error(`${info.title}: replace the preview placeholder before public launch.`);
    const body = info.body ? `${route === 'about' ? `<p>${escape(siteDescription(lang))}</p>` : ''}${info.body}` : `<div class="preparing"><span>${ui.preparing}</span><p>${escape(info.description)}</p></div><p>${ui.placeholder}</p>`;
    await save(`${route}/`, info.title, info.description, infoPage(info.title, body), lang);
  }
  await save('404/', ui.notFound, ui.notFoundDescription, infoPage(ui.notFound, `<p>${ui.notFoundText}</p><p><a class="primary-link" href="${href(localizedRoute('articles/', lang))}">${ui.allLink} <span aria-hidden="true">→</span></a></p>`, false), lang);
}
// GitHub Pages uses a single fallback file for every language. Keep its recovery links available in every language.
const fallback404 = await readFile(path.join(out, '404/index.html'), 'utf8');
await writeFile(path.join(out, '404.html'), fallback404.replace(/<main[\s\S]*?<\/main>/, `<main id="main" class="article-main info-page"><h1>페이지를 찾을 수 없습니다<br><span lang="en">Page not found</span><br><span lang="zh-Hans">找不到页面</span><br><span lang="ja">ページが見つかりません</span><br><span lang="vi">Không tìm thấy trang</span></h1><div class="article-body"><p>${locales.ko.notFoundText}</p><p lang="en">${locales.en.notFoundText}</p><p><a class="primary-link" href="${href('articles/')}">한국어 글 목록</a></p><p lang="en"><a class="primary-link" href="${href('en/articles/')}">Browse English articles</a></p><p lang="zh-Hans"><a class="primary-link" href="${href('zh/articles/')}">浏览中文文章</a></p><p lang="ja"><a class="primary-link" href="${href('ja/articles/')}">日本語の記事一覧</a></p><p lang="vi"><a class="primary-link" href="${href('vi/articles/')}">Bài viết tiếng Việt</a></p></div></main>`));
await writeFile(path.join(out, '.nojekyll'), '');
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${!site.preview && siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (!site.preview) {
  await writeFile(path.join(out, 'sitemap.xml'), sitemapXml(builtRoutes, siteUrl));
}

for (const target of ctaTargets) {
  let filename = path.join(out, target.route.replace(/^\//, ''));
  try {
    if ((await lstat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    const content = await readFile(filename, 'utf8');
    if (target.fragment && !content.includes(`id="${escape(target.fragment)}"`)) throw new Error('Missing section');
  } catch {
    throw new Error(`Button destination does not exist: ${target.route}${target.fragment ? '#' + target.fragment : ''}`);
  }
}
console.log(`Built ${articles.length} articles into ${out}. Base path: ${base || '/'}. Search indexing: ${site.preview ? 'noindex' : 'enabled'}.`);
