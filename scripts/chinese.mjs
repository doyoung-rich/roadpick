export const chinese = {
  home: '首页', temporary: '暂定名称', skip: '跳转到正文', menu: '主导航',
  language: '语言', searchLabel: '搜索文章', searchPlaceholder: '搜索你想了解的内容', search: '搜索',
  preview: '预览', previewText: '此预览不参与搜索收录。标注为示例的文章仅用于展示版式。',
  footerNote: 'ROAD-PEAK 预览。示例文章不作为实际办事指南。',
  siteInfo: '网站信息', location: '当前位置', cta: '相关指南', table: '对照表',
  sample: '版式示例', read: '阅读文章', readLabel: title => `阅读：${title}`,
  latest: '最新文章', all: '全部文章', allLink: '查看全部文章', allDescription: '浏览各主题的中文文章。',
  count: count => `${count} 篇文章`, categoryDescription: name => `浏览${name}相关文章。`,
  preparingTitle: '文章准备中', preparingText: '内容准备好后将在这里发布。',
  searchEmpty: '未找到相关文章', searchHint: '请缩短关键词或换个词试试。',
  noScript: '未启用 JavaScript，无法使用搜索。你仍可浏览下面的文章列表。',
  summary: '先看重点', toc: '本文目录', discovery: '继续阅读',
  discoveryText: '选择你感兴趣的内容。', related: '相关主题', recommended: '推荐阅读',
  discoverMore: '寻找更多文章', categoryMore: name => `更多${name}文章`,
  missingTranslation: '其他语言版本会在内容准备好后发布。', missingLink: '浏览文章',
  fallback: '这篇文章的简体中文版尚未发布。你可以先浏览其他中文文章。',
  fallbackTitle: '该语言版本暂未发布', preparing: '准备中',
  notFound: '找不到页面', notFoundDescription: '请在文章列表中查找需要的信息。',
  notFoundText: '页面可能已移动，或你输入的地址有误。',
  info: {
    about: {title:'关于我们'}, standards:{title:'内容与更正原则'}, contact:{title:'联系我们'},
    privacy:{title:'隐私政策'}, terms:{title:'使用条款'}
  },
  placeholder: '这是版式预览页面。'
};

export function chineseSiteInfo(site, escape) {
  const email = escape(site.contactEmail), operator = escape(site.operatorName);
  const contact = `<a href="mailto:${email}">${email}</a>`;
  return {
    about: {title:'关于我们',description:'了解 ROAD-PEAK 的内容方向、语言版本和运营信息。',body:`<img class="about-brand-image" src="${site.brandImageHref}" width="1024" height="1024" alt="ROAD-PEAK — Drive the Peak"><p>ROAD-PEAK（로드픽）整理实用信息，先回答读者的问题，再说明条件、步骤、例外和资料来源。本站提供韩语、简体中文、日语和越南语内容，已有英语文章保留原地址。</p><h2>发布状态</h2><p>正式文章允许搜索收录；版式示例不列入公开文章列表或站点地图。图片若标为 AI 示例，仅用于说明，不代表实测或实地到访。</p><h2>语言版本</h2><p>各语言稿件分别保存，已有版本通过语言切换链接连接。此功能不会自动翻译或抓取外部文章。尚未发布的版本会引导至对应语言的文章列表。</p><h2>运营与联系</h2><p>运营者显示名称：${operator}<br>联系邮箱：${contact}</p>`},
    standards: {title:'内容与更正原则',description:'ROAD-PEAK 的资料核对、翻译和错误更正原则。',body:`<p>先给出答案，再解释适用条件、步骤与例外。</p><h2>资料与实用价值</h2><ul><li>优先使用官方原始资料，区分已核实事实、说明性假设和亲身观察。</li><li>可能变化的信息标注核对日期，并在相关内容附近提供来源。</li><li>通过清单、比较标准和可复核的示例帮助读者，不仅改写其他文章。</li><li>不虚构体验、资质、评价或专家审核。</li><li>注明来源与翻译、编辑情况；署名来源不等于获得转载授权。</li></ul><h2>AI 辅助与审核</h2><p>AI 辅助写作和翻译仍需运营者实质核查。自动检查不等于人工或专家审核。无法核实的重要内容应暂缓发布。</p><h2>更正</h2><p>请将文章地址、问题段落和可核实的依据发送至 ${contact}。重要错误确认后会修改并注明日期；各语言的共同事实一并检查。文章数量不能保证 AdSense 审批。</p>`},
    contact: {title:'联系我们',description:'联系 ROAD-PEAK，提出内容、图片或更正请求。',body:`<p>内容咨询、更正或图片相关请求，请发邮件至 ${contact}。</p><div class="contact-panel"><p>运营者：${operator}</p><a class="primary-link" href="mailto:${email}">发送邮件</a></div><h2>请提供</h2><ul><li>页面地址及相关句子或图片。</li><li>简要说明与参考来源（如有）。</li></ul><p>邮件链接会打开你的邮件应用。本站没有在线提交表单，也不提供自动送达确认。请勿发送密码、身份证件或不必要的敏感资料。</p>`},
  };
}
