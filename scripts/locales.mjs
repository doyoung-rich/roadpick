export const languages = ['ko', 'en'];

export const locales = {
  ko: {
    home: '홈', temporary: '가칭', skip: '본문으로 바로가기', menu: '주 메뉴',
    language: '언어 선택', searchLabel: '사이트 글 검색', searchPlaceholder: '찾고 싶은 내용을 검색하세요', search: '검색',
    preview: '개설 시안', previewText: '기능 확인용 예시 글입니다. 실제 원고를 준비 중입니다.',
    footerNote: '로드픽 개설 시안입니다. 예시 글은 실제 이용 안내가 아닙니다.',
    siteInfo: '사이트 안내', location: '현재 위치', cta: '관련 안내 바로가기', table: '내용 비교표',
    sample: '구성 확인용 예시', read: '글 읽기', readLabel: title => `${title} 읽기`,
    latest: '새로운 글', all: '전체 글', allLink: '전체 글 보기', allDescription: '모든 분야의 글을 모아봅니다.',
    count: count => `${count}개의 글`, categoryDescription: name => `${name}에 관한 글 목록입니다.`,
    preparingTitle: '글을 준비하고 있습니다', preparingText: '원고가 준비되면 이곳에서 확인하실 수 있습니다.',
    searchEmpty: '검색 결과가 없습니다', searchHint: '검색어를 줄이거나 다른 단어로 찾아보세요.',
    noScript: '이 환경에서는 검색을 사용할 수 없습니다. 아래 전체 글 목록을 확인해주세요.',
    summary: '먼저 확인하세요', toc: '이 글의 목차', discovery: '다른 글도 읽어보세요',
    discoveryText: '관심 있는 내용을 골라 이어서 확인해보세요.', related: '같은 주제의 글', recommended: '추천 글',
    discoverMore: '더 많은 글 찾기', categoryMore: name => `${name} 글 더보기`,
    missingTranslation: '이 글의 영어판은 아직 준비 중입니다.', missingLink: '영어 글 목록 보기',
    fallback: '요청한 글의 한국어판은 아직 준비 중입니다. 다른 한국어 글을 확인해보세요.',
    fallbackTitle: '아직 번역되지 않은 글입니다', preparing: '준비 중',
    notFound: '페이지를 찾을 수 없습니다', notFoundDescription: '글 목록에서 필요한 정보를 다시 찾아보세요.',
    notFoundText: '주소가 바뀌었거나 존재하지 않는 페이지입니다.',
    info: {
      about: { title: '사이트 소개', description: '사이트의 방향과 현재 준비 상태를 안내합니다.', body: '<p>현재는 글 목록과 상세 글의 구성을 확인하는 시안입니다. 사이트 이름과 카테고리는 임시이며, 실제 원고는 운영자가 준비합니다.</p><h2>운영정보</h2><p>운영자 소개와 공개할 연락처는 확인 후 추가할 예정입니다.</p>' },
      standards: { title: '작성·정정 기준', description: '콘텐츠 작성과 정정에 적용할 기준 초안입니다.', body: '<p>운영자가 검토할 콘텐츠 기준 초안입니다.</p><h2>작성 기준</h2><ul><li>독자가 찾는 답을 먼저 제시하고 조건·절차·예외를 설명합니다.</li><li>직접 확인한 내용, 설명용 가정, 공식 자료의 사실을 구분합니다.</li><li>바뀔 수 있는 정보에는 공식 출처와 확인 날짜를 표시합니다.</li><li>확인하지 못한 경험·후기·검수를 만들어 넣지 않습니다.</li><li>한국어와 영어 원고를 각각 검토하며, 원문 출처와 번역·편집 여부를 표시합니다.</li></ul><h2>정정 기준</h2><p>오류를 확인하면 해당 내용을 수정하고 변경 사항과 확인 날짜를 기록합니다. 두 언어판의 공통 내용도 함께 검토합니다. 정정 요청을 받을 연락 방법은 운영정보 확인 후 안내합니다.</p>' },
      contact: { title: '문의', description: '문의 방법은 운영자 확인 후 안내할 예정입니다.' },
      privacy: { title: '개인정보처리방침', description: '개인정보처리방침은 실제 운영 방식 확인 후 작성할 예정입니다.' },
      terms: { title: '이용약관', description: '이용약관은 실제 운영 방식 확인 후 작성할 예정입니다.' }
    },
    placeholder: '현재는 화면 구성 확인용 페이지입니다.'
  },
  en: {
    home: 'Home', temporary: 'Draft name', skip: 'Skip to content', menu: 'Main navigation',
    language: 'Language', searchLabel: 'Search articles', searchPlaceholder: 'Search for a topic', search: 'Search',
    preview: 'Preview', previewText: 'Sample articles demonstrate the site. Actual content is being prepared.',
    footerNote: 'ROAD-PEAK preview. Sample articles are not completed practical guides.',
    siteInfo: 'Site information', location: 'You are here', cta: 'Related guides', table: 'Comparison table',
    sample: 'Layout sample', read: 'Read article', readLabel: title => `Read ${title}`,
    latest: 'Latest articles', all: 'All articles', allLink: 'View all articles', allDescription: 'Browse articles across all topics.',
    count: count => `${count} ${count === 1 ? 'article' : 'articles'}`, categoryDescription: name => `Browse articles about ${name.toLowerCase()}.`,
    preparingTitle: 'Articles are on the way', preparingText: 'New articles will appear here when they are ready.',
    searchEmpty: 'No articles found', searchHint: 'Try fewer words or a different search term.',
    noScript: 'Search is unavailable without JavaScript. You can still browse the full article list below.',
    summary: 'Start here', toc: 'In this article', discovery: 'Keep reading',
    discoveryText: 'Choose another article to explore.', related: 'Related articles', recommended: 'Recommended articles',
    discoverMore: 'Find more articles', categoryMore: name => `More in ${name}`,
    missingTranslation: 'A Korean version of this article is not available yet.', missingLink: 'Browse Korean articles',
    fallback: 'An English version of the requested article is not available yet. Browse other English articles below.',
    fallbackTitle: 'Translation not available yet', preparing: 'In preparation',
    notFound: 'Page not found', notFoundDescription: 'Browse the article list to find what you need.',
    notFoundText: 'This page may have moved, or the address may be incorrect.',
    info: {
      about: { title: 'About', description: 'Learn about the site and its current preview status.', body: '<p>This preview demonstrates the article list and reading layout. The site name and categories are provisional. The operator will supply the articles.</p><h2>Operator details</h2><p>An operator introduction and public contact details will be added after confirmation.</p>' },
      standards: { title: 'Editorial & corrections policy', description: 'Draft standards for writing and correcting articles.', body: '<p>These draft standards are awaiting the operator’s review.</p><h2>Writing standards</h2><ul><li>Answer the reader’s question first, then explain conditions, steps and exceptions.</li><li>Distinguish first-hand checks, illustrative assumptions and facts from official sources.</li><li>Link to official sources and show the date checked for information that may change.</li><li>Do not invent experiences, reviews or expert verification.</li><li>Review Korean and English articles separately, identify original sources and label translation or adaptation.</li></ul><h2>Corrections</h2><p>Confirmed errors will be corrected with a record of the change and date checked. Shared facts in both language versions will be reviewed together. A contact method for correction requests will be added after operator details are confirmed.</p>' },
      contact: { title: 'Contact', description: 'Contact details will be added after the operator confirms them.' },
      privacy: { title: 'Privacy policy', description: 'A privacy policy will be prepared once the site’s actual operation is confirmed.' },
      terms: { title: 'Terms of use', description: 'Terms will be prepared once the site’s actual operation is confirmed.' }
    },
    placeholder: 'This page is a layout placeholder.'
  }
};
