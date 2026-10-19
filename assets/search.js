(() => {
  const fields = [...document.querySelectorAll('form[data-site-search]')]
    .map(form => ({ form, input: form.querySelector('input[name="q"]') }))
    .filter(field => field.input);
  const page = document.querySelector('[data-search-page]');
  const list = page?.querySelector('[data-search-list]');
  const isEnglish = /^en(?:-|$)/i.test(document.documentElement.lang);
  const readQuery = () => (new URL(location.href).searchParams.get('q') || '').slice(0, 120);
  const normalize = text => String(text).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  const syncFields = (query, source) => {
    for (const { input } of fields) if (input !== source) input.value = query;
  };

  syncFields(readQuery());
  if (!list) return;

  const entries = [...list.querySelectorAll('article.post-card[data-search-text]')]
    .map(card => ({ card, text: normalize(card.dataset.searchText) }));
  const statuses = [...page.querySelectorAll('[data-search-status]')];
  const emptyStates = [...page.querySelectorAll('[data-search-empty]')];
  const titles = [...page.querySelectorAll('[data-search-title]')]
    .map(element => ({ element, original: element.textContent }));
  const composing = new WeakSet();

  function filter(value, updateUrl = true, source) {
    const query = value.slice(0, 120);
    const normalized = normalize(query);
    const terms = normalized ? normalized.split(' ') : [];
    let count = 0;
    for (const { card, text } of entries) {
      const matches = terms.every(term => text.includes(term));
      card.hidden = !matches;
      if (matches) count++;
    }
    syncFields(query, source);
    for (const status of statuses) status.textContent = isEnglish
      ? terms.length
        ? `${count} ${count === 1 ? 'result' : 'results'} for “${query.trim()}”`
        : `${count} ${count === 1 ? 'article' : 'articles'}`
      : terms.length
        ? `“${query.trim()}” 검색 결과 ${count}개`
        : `${count}개의 글`;
    for (const empty of emptyStates) empty.hidden = !terms.length || count > 0;
    for (const { element, original } of titles) element.textContent = terms.length ? (isEnglish ? 'Search results' : '검색 결과') : original;

    if (updateUrl) {
      const url = new URL(location.href);
      const urlQuery = query.replace(/\s+/g, ' ').trim();
      if (urlQuery) url.searchParams.set('q', urlQuery);
      else url.searchParams.delete('q');
      if (url.href !== location.href) history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    }
  }

  for (const { form, input } of fields) {
    const update = event => {
      if (!event.isComposing && !composing.has(input)) filter(input.value, true, input);
    };
    input.addEventListener('compositionstart', () => composing.add(input));
    input.addEventListener('compositionend', event => {
      composing.delete(input);
      update(event);
    });
    input.addEventListener('input', update);
    input.addEventListener('search', update);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!composing.has(input)) filter(input.value, true, input);
    });
  }
  for (const clear of page.querySelectorAll('[data-search-clear]')) {
    clear.addEventListener('click', event => {
      event.preventDefault();
      filter('');
    });
  }
  addEventListener('popstate', () => filter(readQuery(), false));
  filter(readQuery(), false);
})();
