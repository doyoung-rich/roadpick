export const japanese = {
  home:'ホーム', temporary:'仮称', skip:'本文へ移動', menu:'メインメニュー', language:'言語',
  searchLabel:'記事を検索',searchPlaceholder:'知りたい情報を検索',search:'検索',
  preview:'プレビュー',previewText:'検索対象外のプレビューです。サンプル記事はレイアウト確認用です。',
  footerNote:'ROAD-PEAKのプレビューです。サンプルは実際の手続き案内ではありません。',
  siteInfo:'サイト情報',location:'現在の位置',cta:'関連ガイド',table:'比較表',sample:'レイアウトサンプル',
  read:'記事を読む',readLabel:title=>`${title}を読む`,latest:'新着記事',all:'すべての記事',allLink:'記事一覧を見る',allDescription:'テーマ別の日本語記事を探せます。',
  count:n=>`${n}件の記事`,categoryDescription:n=>`${n}に関する記事です。`,
  preparingTitle:'記事を準備しています',preparingText:'準備ができ次第、公開します。',searchEmpty:'該当する記事がありません',searchHint:'キーワードを短くするか、別の言葉で検索してください。',
  noScript:'JavaScriptが無効なため検索を利用できません。下の記事一覧はご覧いただけます。',
  summary:'最初に確認',toc:'この記事の目次',discovery:'あわせて読みたい',discoveryText:'気になる情報を選んでください。',related:'関連する記事',recommended:'おすすめ記事',
  discoverMore:'ほかの記事を探す',categoryMore:n=>`${n}の記事をもっと見る`,missingTranslation:'ほかの言語版は原稿の準備後に公開します。',missingLink:'記事一覧を見る',
  fallback:'この記事の日本語版はまだありません。ほかの日本語記事をご覧ください。',fallbackTitle:'この言語版は未公開です',preparing:'準備中',
  notFound:'ページが見つかりません',notFoundDescription:'記事一覧から必要な情報をお探しください。',notFoundText:'ページが移動したか、アドレスが正しくない可能性があります。',
  info:{about:{title:'サイトについて'},standards:{title:'編集・訂正方針'},contact:{title:'お問い合わせ'},privacy:{title:'プライバシーポリシー'},terms:{title:'利用条件'}},placeholder:'レイアウト確認用のページです。'
};
export const vietnamese = {
  home:'Trang chủ',temporary:'Tên tạm',skip:'Đến nội dung chính',menu:'Điều hướng chính',language:'Ngôn ngữ',
  searchLabel:'Tìm bài viết',searchPlaceholder:'Tìm thông tin bạn cần',search:'Tìm',
  preview:'Bản xem trước',previewText:'Bản xem trước không được lập chỉ mục. Bài mẫu chỉ minh họa bố cục.',footerNote:'Bản xem trước ROAD-PEAK. Bài mẫu không phải hướng dẫn hoàn chỉnh.',
  siteInfo:'Thông tin website',location:'Bạn đang ở',cta:'Hướng dẫn liên quan',table:'Bảng so sánh',sample:'Bài mẫu',read:'Đọc bài',readLabel:t=>`Đọc: ${t}`,
  latest:'Bài mới',all:'Tất cả bài viết',allLink:'Xem tất cả bài',allDescription:'Khám phá các bài viết bằng tiếng Việt.',count:n=>`${n} bài viết`,categoryDescription:n=>`Các bài viết về ${n.toLowerCase()}.`,
  preparingTitle:'Đang chuẩn bị bài viết',preparingText:'Bài viết sẽ xuất hiện khi sẵn sàng.',searchEmpty:'Không tìm thấy bài viết',searchHint:'Thử từ khóa ngắn hơn hoặc một từ khác.',
  noScript:'Tính năng tìm kiếm cần JavaScript. Bạn vẫn có thể xem danh sách bên dưới.',
  summary:'Điểm cần biết',toc:'Mục lục',discovery:'Đọc tiếp',discoveryText:'Chọn thông tin bạn muốn tìm hiểu.',related:'Bài liên quan',recommended:'Gợi ý đọc',discoverMore:'Tìm thêm bài',categoryMore:n=>`Thêm bài về ${n}`,
  missingTranslation:'Các bản ngôn ngữ khác sẽ được đăng khi nội dung sẵn sàng.',missingLink:'Xem danh sách bài',fallback:'Bài này chưa có bản tiếng Việt. Bạn có thể đọc các bài tiếng Việt khác bên dưới.',fallbackTitle:'Chưa có bản dịch',preparing:'Đang chuẩn bị',
  notFound:'Không tìm thấy trang',notFoundDescription:'Tìm thông tin trong danh sách bài viết.',notFoundText:'Trang có thể đã chuyển hoặc địa chỉ chưa đúng.',
  info:{about:{title:'Giới thiệu'},standards:{title:'Biên tập và đính chính'},contact:{title:'Liên hệ'},privacy:{title:'Quyền riêng tư'},terms:{title:'Điều khoản sử dụng'}},placeholder:'Trang minh họa bố cục.'
};

export function asianSiteInfo(site, lang, escape) {
  const contact=`<a href="mailto:${escape(site.contactEmail)}">${escape(site.contactEmail)}</a>`;
  const operator=escape(site.operatorName);
  if(lang==='ja') return {
    about:{title:'サイトについて',description:'ROAD-PEAKの内容、運営者、言語版について。',body:`<p>ROAD-PEAK（로드픽）は、実用情報を韓国語・中国語簡体字・日本語・ベトナム語で整理する独立サイトです。既存の英語記事は従来のURLで閲覧できます。質問への答えを先に示し、条件・手順・例外と出典を説明します。</p><h2>公開状況と言語</h2><p>正式記事は検索対象です。サンプルは公開一覧とサイトマップから除外します。言語版は別々に保存し、公開済みの版同士を結びます。外部記事の自動収集・自動翻訳機能ではありません。AIサンプル画像は実地訪問の記録ではありません。</p><h2>運営者</h2><p>表示名：${operator}<br>連絡先：${contact}</p>`},
    standards:{title:'編集・訂正方針',description:'出典、翻訳、情報確認と訂正の方針。',body:`<p>公式の一次資料を優先し、確認した事実・説明用の仮定・体験を区別します。変わり得る情報には確認日と出典を付け、チェックリストや比較基準を添えます。体験、資格、レビュー、専門家の確認を捏造しません。出典の記載だけで転載許可が得られるとは扱いません。</p><h2>AI補助と訂正</h2><p>AI補助による執筆・翻訳にも運営者の実質的な確認が必要です。自動検査を人や専門家の確認と呼びません。重要事項が未確認なら公開を保留します。訂正依頼は記事URL、該当箇所、根拠を ${contact} にお送りください。重要な訂正には日付を付け、各言語の共通事項も確認します。記事数はAdSense承認を保証しません。</p>`},
    contact:{title:'お問い合わせ',description:'記事、訂正、画像に関する連絡先。',body:`<p>記事や画像のご質問、訂正のご依頼は ${contact} へお送りください。運営者表示名：${operator}。</p><p>ページURL、該当する文章や画像、簡単な説明と根拠があればお知らせください。メールリンクはメールアプリを開きます。送信フォームや自動受付確認はありません。パスワードや身分証など不要な機密情報は送らないでください。</p>`},
  };
  return {
    about:{title:'Giới thiệu',description:'Về ROAD-PEAK, đơn vị vận hành và các bản ngôn ngữ.',body:`<p>ROAD-PEAK (로드픽) là website thông tin độc lập, cung cấp nội dung bằng tiếng Hàn, tiếng Trung giản thể, tiếng Nhật và tiếng Việt. Các bài tiếng Anh đã đăng vẫn có thể đọc tại địa chỉ cũ. Chúng tôi trả lời câu hỏi trước, sau đó giải thích điều kiện, các bước, ngoại lệ và nguồn.</p><h2>Xuất bản và ngôn ngữ</h2><p>Bài chính thức được phép lập chỉ mục; bài mẫu không xuất hiện trong danh sách công khai hay sơ đồ website. Mỗi bản ngôn ngữ được lưu riêng và chỉ liên kết khi đã có nội dung. Đây không phải công cụ tự động thu thập hoặc dịch bài bên ngoài. Hình AI mẫu không phải bằng chứng về trải nghiệm thực tế.</p><h2>Liên hệ</h2><p>Tên hiển thị của đơn vị vận hành: ${operator}<br>Email: ${contact}</p>`},
    standards:{title:'Biên tập và đính chính',description:'Nguyên tắc kiểm tra nguồn, dịch và sửa nội dung.',body:`<p>Ưu tiên nguồn chính thức; phân biệt dữ kiện đã xác minh, giả định minh họa và trải nghiệm trực tiếp. Thông tin có thể thay đổi cần ngày kiểm tra và nguồn. Bổ sung bảng so sánh, danh sách kiểm tra hoặc ví dụ có thể kiểm chứng. Không bịa trải nghiệm, chuyên môn, đánh giá hay việc thẩm định của chuyên gia. Ghi nguồn không đồng nghĩa với được phép tái sử dụng.</p><h2>AI và đính chính</h2><p>Nội dung viết hoặc dịch có AI hỗ trợ vẫn cần người vận hành kiểm tra thực chất. Không gọi kiểm tra tự động là thẩm định của con người hay chuyên gia. Giữ bản nháp nếu thông tin quan trọng chưa được xác minh. Gửi URL, đoạn cần sửa và căn cứ đến ${contact}. Lỗi quan trọng được sửa kèm ngày; dữ kiện chung giữa các ngôn ngữ được kiểm tra cùng nhau. Số bài không bảo đảm được AdSense chấp thuận.</p>`},
    contact:{title:'Liên hệ',description:'Liên hệ về nội dung, đính chính hoặc hình ảnh.',body:`<p>Bạn có thể gửi câu hỏi, yêu cầu đính chính hoặc yêu cầu về ảnh đến ${contact}. Tên đơn vị vận hành: ${operator}.</p><p>Vui lòng kèm URL, câu hoặc ảnh liên quan, mô tả ngắn và nguồn nếu có. Liên kết email mở ứng dụng thư; website không có biểu mẫu gửi hay xác nhận tự động. Không gửi mật khẩu, giấy tờ tùy thân hoặc thông tin nhạy cảm không cần thiết.</p>`},
  };
}
