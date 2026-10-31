// Discovery files are derived only from published articles, never draft/sample text.
const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text = value => String(value).replace(/[\r\n]+/g, ' ').replace(/[\[\]]/g, '');

export function rssFeed({ siteUrl, name, description, lang, homeRoute, feedRoute, articles, articleRoute }) {
  const url = route => `${siteUrl}/${route}`;
  const published = articles.filter(a => a.status === 'ready' && a.date);
  const latest = published.map(a => a.modified || a.date).sort().at(-1);
  const date = value => new Date(`${value}T00:00:00+09:00`).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(name)}</title><link>${xml(url(homeRoute))}</link><description>${xml(description)}</description><language>${xml(lang)}</language><atom:link href="${xml(url(feedRoute))}" rel="self" type="application/rss+xml"/>${latest ? `<lastBuildDate>${date(latest)}</lastBuildDate>` : ''}${published.map(a => `<item><title>${xml(a.title)}</title><link>${xml(url(articleRoute(a)))}</link><guid isPermaLink="true">${xml(url(articleRoute(a)))}</guid><description>${xml(a.description)}</description><pubDate>${date(a.date)}</pubDate></item>`).join('')}</channel></rss>`;
}

export function llmsIndex({ site, articles, articleRoute, languages, languageLabel }) {
  const root = site.siteUrl.replace(/\/$/, '');
  return `# ${text(site.name)} / ${text(site.enName)}

> ${text(site.description)}

Roadpick is an independent information publisher, not a government application service. Articles are general guidance, not individual eligibility decisions. Check each article's cited sources and review date for time-sensitive information. Translations are available only where published; do not infer equivalent nationality or visa rules across languages.

## Site information
- [About](${root}/about/): publisher and language policy
- [Editorial standards](${root}/standards/): sourcing and corrections
- [Contact](${root}/contact/): inquiries and corrections
- [Sitemap](${root}/sitemap.xml): indexable pages

${languages.map(lang => `## ${languageLabel(lang)}\n${articles.filter(a => a.lang === lang && a.status === 'ready').map(a => `- [${text(a.title)}](${root}/${articleRoute(a)}): ${text(a.description)}`).join('\n')}`).join('\n\n')}
`;
}
