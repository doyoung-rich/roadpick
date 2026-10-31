// Only facts supplied by the operator or already visible on the page are emitted.
export const jsonLd = value => `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')}</script>`;

export function pageMetadata({ site, lang, route, canonical, title, description, article, emptyCategory }) {
  if (!canonical || route === '404/' || article?.status === 'sample' || emptyCategory) return '';
  const root = `${site.siteUrl.replace(/\/$/, '')}/`;
  const publisher = {
    '@type': 'Organization', '@id': `${root}#publisher`,
    name: site.operatorName, alternateName: [site.enName, 'Roadpick'], url: root,
    logo: { '@type': 'ImageObject', url: `${root}${site.brandImage}`, width: 1024, height: 1024 },
    email: site.contactEmail
  };
  const nodes = [publisher];
  if (!route && lang === 'ko') nodes.push({
    '@type': 'WebSite', '@id': `${root}#website`, url: root,
    name: site.name, alternateName: [site.enName, 'Roadpick'], inLanguage: ['ko', 'en', 'zh-Hans', 'ja', 'vi'],
    publisher: { '@id': publisher['@id'] }
  });
  const page = {
    '@type': article ? 'BlogPosting' : route === 'about/' ? 'AboutPage' : route === 'contact/' ? 'ContactPage' : route === 'articles/' || route.startsWith('category/') ? 'CollectionPage' : 'WebPage',
    '@id': `${canonical}#${article ? 'article' : 'webpage'}`, url: canonical,
    name: title, description, inLanguage: lang, isPartOf: { '@id': `${root}#website` }
  };
  if (article) {
    page.headline = article.title;
    page.publisher = { '@id': publisher['@id'] };
    page.mainEntityOfPage = canonical;
    page.articleSection = ({ ko: article.category.name, en: article.category.enName, 'zh-Hans': article.category.zhName, ja: article.category.jaName, vi: article.category.viName })[lang];
    if (article.date) page.datePublished = article.date;
    if (article.modified) page.dateModified = article.modified;
    if (article.author) page.author = [site.operatorName, site.name, site.enName].includes(article.author)
      ? { '@id': publisher['@id'] } : { '@type': 'Person', name: article.author };
    if (article.coverSample !== 'true') page.image = `${root}${article.cover}`;
  }
  nodes.push(page);
  return jsonLd({ '@context': 'https://schema.org', '@graph': nodes });
}

export function sitemapXml(entries, siteUrl) {
  const xml = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(({ route, modified }) => `<url><loc>${xml(`${siteUrl}/${route}`)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`).join('')}</urlset>`;
}
