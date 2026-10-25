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
    privacy: {title:'隐私政策',description:'ROAD-PEAK 当前功能与信息处理方式。',body:`<p>中文说明更新：2026-10-26。本文翻译当前网站信息处理说明。邮件咨询的详细保存与删除规则仍待运营者最终确认。</p><h2>当前功能</h2><p>本站目前不提供注册、评论存储或文件上传，不启用广告、访问分析脚本或第三方字体。网站代码不设置 Cookie，也不使用浏览器本地存储。搜索在浏览器内针对当前语言文章进行，搜索词会显示在网址中，并可能出现在页面请求地址中。</p><h2>托管</h2><p>本站由 GitHub Pages 托管。GitHub 说明其会为安全目的记录与保存访问者 IP 地址。详见 <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">GitHub Pages 数据收集说明</a>与<a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub 隐私声明</a>。本站不声称控制 GitHub 的保存规则。</p><h2>邮件</h2><p>发送邮件后，发件地址与正文会通过所列 Gmail 邮箱接收，用于处理咨询；不会作为公开评论发布。详细保存与删除规则将在正式运营安排确定后完善。相关请求请发至 ${contact}。</p><h2>功能变化</h2><p>本文不表示已启用广告、分析或评论。新增功能前会先核查数据流、必要告知与同意安排，并更新政策。</p><p>${operator}：${contact}</p>`},
    terms: {title:'使用条款',description:'ROAD-PEAK 当前内容与外部链接的使用说明。',body:`<p>中文说明更新：2026-10-26。本文说明当前网站使用方式，最终服务安排确定后会再次审查。</p><h2>内容与示例</h2><p>标注为示例的页面仅演示版式和导航，不是完整的申请、预订或商品指南。本站目前不提供付费服务、商品销售、注册或评论服务。</p><h2>图片与转载</h2><p>转载前请核对来源与权利条件。运营者提供的品牌图片和 AI 示例按已知制作方式区分。外部原文链接不代表授予其内容的转载权。</p><h2>更正与外部网站</h2><p>网站准备与维护期间内容和版式可能调整。更正或权利请求请附页面地址发至 ${contact}。外部网站适用各自的条款与隐私政策，并非由 ROAD-PEAK 运营。</p>`}
  };
}
