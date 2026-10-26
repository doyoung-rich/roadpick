// Retention is an operator-approved manual process, not an automated mailbox action.
export function publishedPolicies(site, lang, escape) {
  if (site.inquiryRetentionMonths !== 6 || !/^\d{4}-\d{2}-\d{2}$/.test(site.policyUpdated || '')) throw new Error('Confirmed inquiry retention and policy date are required.');
  const email = `<a href="mailto:${escape(site.contactEmail)}">${escape(site.contactEmail)}</a>`;
  const operator = escape(site.operatorName), date = escape(site.policyUpdated);
  const hosting = 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection';
  const github = 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';
  const google = 'https://policies.google.com/privacy';
  const texts = {
    ko: {
      privacy: ['개인정보처리방침', '로드픽의 이메일 문의, 보관·삭제 기준과 현재 사이트 정보 처리 방식을 안내합니다.', [
        ['운영자와 적용 범위', `시행·갱신일: ${date}. 운영자 표시명은 ${operator}이며 개인정보 문의처는 ${email}입니다. 이 방침은 현재 공개된 로드픽의 기능과 이메일 문의에 적용됩니다.`],
        ['이메일 문의로 처리하는 정보와 목적', `문의하면 발신 이메일 주소, 발신자 표시명, 문의 본문과 자발적으로 첨부한 자료를 Gmail 메일함으로 받습니다. 질문 답변, 오류 정정, 이미지·권리 관련 요청 처리와 후속 확인을 위해 사용합니다. 문의 내용은 공개 댓글로 게시하지 않습니다. 비밀번호·신분증·여권 등 처리에 불필요한 민감정보는 보내지 마세요.`],
        ['보관기간과 파기', `문의 처리 완료일부터 6개월 보관한 뒤 지체 없이 삭제합니다. 법령상 보관 의무가 있는 경우에는 해당 자료를 일반 문의와 구분해 필요한 기간 동안만 보관합니다. 운영자가 관리하는 메일 본문과 첨부파일을 삭제하고 휴지통에서도 제거하는 방식으로 처리합니다. 웹사이트에 자동 삭제 기능이 있는 것은 아니며, 운영자가 이 기준에 따라 메일함을 관리합니다. 메일 제공사의 백업·로그 보관은 제공사 정책이 별도로 적용됩니다.`],
        ['열람·정정·삭제 등 요청', `본인의 문의 정보에 대한 열람·정정·삭제 또는 처리 정지 요청은 ${email}으로 보내주세요. 필요한 최소 범위에서 본인과 대상 정보를 확인해 처리하며, 법령상 제한 등으로 처리할 수 없는 경우에는 그 사유를 안내합니다.`],
        ['검색·쿠키·현재 기능', `현재 회원가입, 댓글 저장, 파일 업로드, 광고, 방문 분석 스크립트와 외부 글꼴을 사용하지 않습니다. 사이트 코드는 쿠키나 브라우저 로컬 저장소를 설정하지 않습니다. 검색은 현재 언어의 글 목록을 브라우저에서 조회하며, 검색어는 URL에 표시돼 브라우저 기록이나 페이지 요청 주소에 포함될 수 있습니다. 검색창에 개인정보를 입력하지 마세요.`],
        ['호스팅과 메일 서비스', `사이트는 GitHub Pages에서 제공됩니다. GitHub는 보안 목적으로 방문자 IP 주소를 기록·보관한다고 설명합니다. 자세한 내용은 <a href="${hosting}">GitHub Pages 정보 수집 안내</a>와 <a href="${github}">GitHub 개인정보처리방침</a>을 확인하세요. 문의 이메일은 Google의 Gmail을 사용하며 <a href="${google}">Google 개인정보처리방침</a>이 적용됩니다. 로드픽이 이들 제공사의 서버 위치, 로그·백업 보관기간을 직접 관리한다고 표시하지 않습니다.`],
        ['외부 링크와 변경 안내', `공식기관 등 외부 링크를 방문하거나 해당 기관에 신청하면 그 사이트의 개인정보처리방침이 적용됩니다. 광고·분석·댓글처럼 정보 처리 방식이 달라지는 기능은 도입 전에 실제 데이터 흐름과 필요한 고지·동의 사항을 확인하고 이 방침을 갱신합니다. 현재 광고나 분석은 활성화하지 않았습니다.`]
      ]],
      terms: ['이용약관', '로드픽 정보 콘텐츠, 이미지와 외부 링크 이용에 관한 현재 운영 기준입니다.', [
        ['사이트와 이용 범위', `시행·갱신일: ${date}. ${operator}은 생활과 한국 여행 관련 정보를 제공하는 독립 정보 사이트입니다. 한국어·중국어 간체자·일본어·베트남어 원고를 각각 제공하며 기존 영어 글은 원래 주소로 유지합니다. 현재 유료 서비스, 판매, 회원가입, 댓글 저장 또는 신청 대행은 제공하지 않습니다.`],
        ['정보의 기준과 확인', `글의 출처·확인 날짜·적용 조건을 함께 읽어주세요. 제도, 일정, 날씨, 가격과 운영 상황은 이후 달라질 수 있습니다. 예측값은 실제 관측값이나 결과 보장이 아니며, 개별 신청·입국·수급 자격은 담당 기관이 판단합니다. 방문·신청 전 연결된 공식 출처에서 최신 조건을 확인하세요.`],
        ['예시와 언어판', `샘플로 표시된 화면은 구성 예시이며 완성된 신청·예약 안내가 아닙니다. 공개 글 목록에서는 샘플을 제외합니다. 언어 선택은 준비된 원고를 여는 기능이며 외부 기사를 자동 번역·수집하지 않습니다. 번역이나 내용의 차이를 발견하면 문의해 주세요.`],
        ['콘텐츠와 이미지', `글·이미지를 재사용하려면 각각의 권리와 허용 조건을 확인해야 합니다. 외부 출처 표기나 링크만으로 재사용 권리가 부여되지는 않습니다. 사진의 촬영일·장소나 실제 경험이 확인되지 않은 경우 본문 설명을 따르며, 이를 현장 기록으로 해석하지 마세요.`],
        ['외부 서비스와 문의', `외부 기관의 신청·예약·결제·교통 서비스는 해당 기관이 운영하며 자체 조건과 개인정보처리방침이 적용됩니다. 로드픽은 그 기관의 대행 창구가 아닙니다. 오류·권리 관련 요청은 해당 URL과 내용을 ${email}으로 보내주세요. 확인한 오류는 작성·정정 기준에 따라 수정하고 필요한 날짜를 표시합니다.`]
      ]]
    },
    en: {
      privacy: ['Privacy policy', 'How ROAD-PEAK handles inquiries, six-month retention and current website data.', [
        ['Operator and scope', `Effective and updated: ${date}. Operator display name: ${operator}. Privacy contact: ${email}. This policy covers the current public website and email inquiries.`],
        ['Inquiry information and purposes', `Email inquiries reach the stated Gmail mailbox with the sender address, display name, message and any voluntarily supplied attachments. They are used to answer questions, correct errors, address image or rights requests and follow up. Messages are not published as comments. Do not send unnecessary sensitive information, passwords or identity documents.`],
        ['Retention and deletion', `Inquiries are retained for six months after resolution and then deleted without undue delay. Where a legal retention obligation applies, the required records are separated from ordinary inquiries and retained only for the required period. The operator removes the managed messages and attachments, including from Trash. This is a manual operating process, not an automatic website deletion feature. The mail provider's own backup and log policies apply separately.`],
        ['Access and correction requests', `Send requests to access, correct, delete or restrict the use of your inquiry information to ${email}. We check the requester and relevant information only to the extent necessary. If a legal restriction prevents the requested action, we explain the reason.`],
        ['Search and current features', `The website does not currently use accounts, comment storage, file uploads, ads, analytics scripts or third-party fonts. Site code does not set cookies or use browser local storage. Searches run in your browser against the current language's articles. Search terms appear in the URL and may enter browser history or a page request; do not type personal information into search.`],
        ['Hosting and email providers', `GitHub Pages hosts the site. GitHub states that it logs and stores visitor IP addresses for security: see <a href="${hosting}">GitHub Pages data collection</a> and the <a href="${github}">GitHub Privacy Statement</a>. Inquiries use Google's Gmail, subject to <a href="${google}">Google's Privacy Policy</a>. ROAD-PEAK does not claim to control provider server locations or log and backup retention.`],
        ['External sites and changes', `An external site's own policy applies when you follow its links or submit an application there. Before adding ads, analytics, comments or other data-handling features, we will review the actual data flows and necessary notices and consent arrangements and update this policy. Ads and analytics are not currently enabled.`]
      ]],
      terms: ['Terms of use', 'Current terms for ROAD-PEAK articles, images, language versions and external links.', [
        ['Website and services', `Effective and updated: ${date}. ${operator} operates an independent information website about everyday questions and travel in Korea. The main language editions are Korean, Simplified Chinese, Japanese and Vietnamese; existing English articles remain at their original URLs. No paid service, sales, membership, comment storage or application agency is currently provided.`],
        ['Information and reference dates', `Read each article's sources, review date and conditions. Rules, schedules, weather, prices and access may change. Forecasts are not observations or guaranteed outcomes. Relevant authorities decide individual entry, application and benefit eligibility. Check current official information before travelling or applying.`],
        ['Samples and languages', `Pages marked as samples demonstrate layout and are excluded from public article lists. They are not completed practical guides. Language links open prepared manuscripts, rather than automatically translating or collecting external articles. Please report translation or factual differences.`],
        ['Content and images', `Check the applicable rights and permitted uses before reusing text or images. A source credit or link does not grant reuse rights. Follow image captions where the location, date or first-hand experience is unverified; do not treat illustrative images as field records.`],
        ['External services and corrections', `External authorities and providers run their own applications, reservations, payments and transport services under their own terms and policies. ROAD-PEAK is not their application agent. Send corrections or rights requests with the page URL to ${email}. Confirmed errors are corrected under the editorial policy with a date where appropriate.`]
      ]]
    },
    'zh-Hans': {
      privacy: ['隐私政策', '说明ROAD-PEAK的邮件咨询、六个月保存与删除规则及当前网站数据处理。', [
        ['运营者与范围', `生效及更新日期：${date}。运营者显示名称：${operator}。隐私联系邮箱：${email}。本政策适用于当前公开网站及邮件咨询。`],
        ['咨询信息与用途', `邮件通过所列Gmail邮箱接收，包括发件地址、显示名称、正文及自愿附上的资料。用于答复、纠错、处理图片或权利请求及后续确认，不作为公开评论发布。请勿发送不必要的敏感资料、密码、身份证或护照。`],
        ['保存与删除', `咨询处理完成后保存6个月，之后及时删除。如法律规定必须保存，则将所需记录与一般咨询区分，仅保存必要期限。运营者删除所管理的邮件、附件，并从垃圾箱移除。这是人工邮箱管理流程，不是网站自动删除功能；邮件服务商自身的备份与日志规则另行适用。`],
        ['查询、更正与删除请求', `如需查询、更正、删除本人咨询信息或停止相关处理，请发至${email}。仅在必要范围内核实请求者与目标信息。因法律限制等无法办理时，会说明理由。`],
        ['搜索与当前功能', `目前没有注册、评论存储、上传、广告、分析脚本或第三方字体。网站代码不设置Cookie或使用浏览器本地存储。搜索在浏览器内针对当前语言文章进行，关键词会出现在网址中，也可能进入浏览记录或页面请求。请勿在搜索框输入个人信息。`],
        ['托管与邮件服务', `网站使用GitHub Pages。GitHub说明会为安全目的记录与保存访问者IP，详见<a href="${hosting}">数据收集说明</a>及<a href="${github}">GitHub隐私声明</a>。咨询使用Google的Gmail，适用<a href="${google}">Google隐私政策</a>。ROAD-PEAK不声称控制服务商服务器位置或日志、备份的保存期限。`],
        ['外部网站与更新', `访问外部链接或向相关机构申请时，适用该网站自己的政策。新增广告、分析、评论等功能前，会核实实际数据流、必要告知与同意安排，并更新本政策。目前未启用广告和分析。`]
      ]],
      terms: ['使用条款', 'ROAD-PEAK文章、图片、语言版本及外部链接的当前使用说明。', [
        ['网站服务', `生效及更新日期：${date}。${operator}是提供生活信息和韩国旅行指南的独立网站。主要提供韩语、简体中文、日语与越南语；原英语文章保留原地址。目前不提供收费服务、销售、注册、评论存储或申请代办。`],
        ['资料与日期', `请结合来源、核对日期和适用条件阅读。制度、时间、天气、价格与开放状态可能变化。预测不是实况，也不保证结果；入境、申请或待遇资格由主管机构判断。出发或申请前应查最新官方说明。`],
        ['示例与语言', `标为示例的页面仅展示版式，不列入公开文章列表，不是完整办事指南。语言切换只打开已准备的稿件，不自动翻译或抓取外部文章。发现翻译或事实差异时请告知。`],
        ['文字与图片', `转载前需核对各项权利与允许范围。标注来源或提供链接不等于授予转载权。拍摄时间、地点或实际体验未核实时，请按图注理解，不将示意图片视为现场记录。`],
        ['外部服务与更正', `外部机构自行运营申请、预约、支付与交通服务，适用其自身条款和政策。ROAD-PEAK不是其代办窗口。错误或权利请求请附页面地址发送至${email}。确认的问题按编辑原则更正，并视需要标注日期。`]
      ]]
    },
    ja: {
      privacy: ['プライバシーポリシー', 'メール問い合わせの6か月保管・削除基準と現在の情報の取り扱い。', [
        ['運営者と適用範囲', `施行・更新日：${date}。運営者表示名：${operator}。個人情報に関する連絡先：${email}。現在の公開サイトとメール問い合わせに適用します。`],
        ['問い合わせ情報と目的', `記載のGmailで送信元アドレス、表示名、本文と任意の添付資料を受信します。回答、誤りの訂正、画像・権利のご依頼とその後の確認に利用し、公開コメントにはしません。不要な機密情報、パスワード、身分証や旅券を送らないでください。`],
        ['保管と削除', `問い合わせ対応完了から6か月間保管し、その後遅滞なく削除します。法令上の保管義務がある場合は、必要な記録を通常の問い合わせと区別して必要な期間のみ保管します。運営者が管理するメール本文・添付を削除し、ごみ箱からも取り除きます。これは運営者の手作業であり、サイトの自動削除機能ではありません。提供者独自のバックアップ・ログには別の方針が適用されます。`],
        ['開示・訂正・削除の依頼', `ご本人の問い合わせ情報の開示、訂正、削除、利用停止は${email}へご連絡ください。必要最小限の範囲で本人と対象情報を確認します。法令上の制限などで対応できない場合は理由をご案内します。`],
        ['検索と現在の機能', `会員登録、コメント保存、アップロード、広告、アクセス解析、外部フォントは使用していません。サイトコードはCookieやブラウザーのローカル保存を使いません。検索は現在の言語の記事をブラウザー内で検索します。検索語はURL、閲覧履歴やページ要求に含まれる場合があるため、個人情報は入力しないでください。`],
        ['ホスティングとメール', `GitHub Pagesで公開しています。GitHubはセキュリティ目的で訪問者IPを記録・保管すると説明しています。<a href="${hosting}">データ収集の説明</a>と<a href="${github}">GitHubのプライバシー声明</a>をご確認ください。メールにはGoogleのGmailを使い、<a href="${google}">Googleの方針</a>が適用されます。提供者のサーバー所在地やログ・バックアップの保管を当サイトが管理するとは説明しません。`],
        ['外部サイトと変更', `外部リンクへの訪問や申請には、そのサイトの方針が適用されます。広告、解析、コメントなどを追加する前に、実際の情報の流れと必要な告知・同意を確認して更新します。現在、広告・解析は有効にしていません。`]
      ]],
      terms: ['利用条件', 'ROAD-PEAKの記事、画像、言語版と外部リンクの利用に関する現在の案内。', [
        ['サイトのサービス', `施行・更新日：${date}。${operator}は生活と韓国旅行の情報を提供する独立サイトです。主な言語は韓国語、中国語簡体字、日本語、ベトナム語で、既存の英語記事は従来のURLに残します。現在、有料サービス、販売、会員登録、コメント保存、申請代行は提供しません。`],
        ['情報と確認日', `出典、確認日、条件を併せてお読みください。制度、日程、天気、価格、利用状況は変わる場合があります。予測は実測や結果の保証ではなく、入国や給付等の資格は担当機関が判断します。訪問・申請前に公式の最新条件を確認してください。`],
        ['サンプルと言語', `サンプル表示のページは構成例で、公開記事一覧から除外し、完成した手続き案内として扱いません。言語選択は準備済み原稿を開く機能であり、外部記事の自動翻訳・収集ではありません。訳や内容の違いはご連絡ください。`],
        ['文章と画像', `再利用前に権利と許容範囲を確認してください。出典やリンクだけで利用権を与えるものではありません。撮影日・場所や体験が未確認の場合は説明に従い、参考画像を現地記録と解釈しないでください。`],
        ['外部サービスと訂正', `外部の申請、予約、決済、交通サービスは各提供者が独自の条件と方針で運営します。当サイトはその代行窓口ではありません。訂正・権利のご依頼はURLと説明を${email}へお送りください。確認した誤りは編集方針に沿って訂正し、必要に応じ日付を表示します。`]
      ]]
    },
    vi: {
      privacy: ['Quyền riêng tư', 'Cách xử lý email, thời hạn lưu sáu tháng và dữ liệu của website hiện tại.', [
        ['Đơn vị vận hành và phạm vi', `Có hiệu lực và cập nhật: ${date}. Tên hiển thị: ${operator}. Liên hệ về dữ liệu: ${email}. Chính sách áp dụng cho website công khai và email hỏi đáp hiện tại.`],
        ['Thông tin và mục đích xử lý', `Email được nhận qua Gmail đã nêu, gồm địa chỉ người gửi, tên hiển thị, nội dung và tài liệu bạn tự nguyện đính kèm. Chúng tôi dùng để trả lời, sửa lỗi, xử lý yêu cầu về ảnh hoặc quyền sử dụng và theo dõi việc giải quyết; không đăng thành bình luận. Không gửi mật khẩu, giấy tờ tùy thân, hộ chiếu hay dữ liệu nhạy cảm không cần thiết.`],
        ['Thời hạn lưu và xóa', `Email được lưu sáu tháng sau khi xử lý xong, rồi xóa không chậm trễ. Nếu pháp luật yêu cầu lưu, hồ sơ cần thiết được tách khỏi thư thông thường và chỉ giữ trong thời gian bắt buộc. Người vận hành xóa thư và tệp đính kèm mình quản lý, kể cả khỏi Thùng rác. Đây là quy trình thủ công, không phải tính năng website tự xóa. Bản sao lưu và nhật ký riêng của nhà cung cấp tuân theo chính sách của họ.`],
        ['Yêu cầu của bạn', `Bạn có thể yêu cầu xem, sửa, xóa hoặc ngừng xử lý thông tin hỏi đáp của mình qua ${email}. Chúng tôi chỉ kiểm tra người yêu cầu và dữ liệu liên quan trong phạm vi cần thiết. Nếu hạn chế pháp lý không cho phép thực hiện, chúng tôi sẽ nêu lý do.`],
        ['Tìm kiếm và chức năng hiện tại', `Website không dùng tài khoản, lưu bình luận, tải tệp lên, quảng cáo, mã phân tích hay phông chữ bên ngoài. Mã website không đặt cookie hoặc dùng bộ nhớ cục bộ. Tìm kiếm diễn ra trong trình duyệt theo ngôn ngữ hiện tại. Từ khóa xuất hiện trong URL, có thể vào lịch sử hoặc yêu cầu tải trang; không nhập dữ liệu cá nhân vào ô tìm kiếm.`],
        ['Dịch vụ lưu trữ và email', `Website dùng GitHub Pages. GitHub cho biết họ ghi và lưu IP vì bảo mật; xem <a href="${hosting}">thông tin thu thập dữ liệu</a> và <a href="${github}">chính sách GitHub</a>. Email dùng Gmail của Google theo <a href="${google}">chính sách Google</a>. ROAD-PEAK không tuyên bố kiểm soát vị trí máy chủ hay thời gian lưu nhật ký và bản sao lưu của nhà cung cấp.`],
        ['Liên kết ngoài và thay đổi', `Khi sang website ngoài hoặc nộp đơn ở đó, chính sách của website đó áp dụng. Trước khi thêm quảng cáo, phân tích, bình luận hoặc chức năng xử lý dữ liệu khác, chúng tôi sẽ kiểm tra luồng dữ liệu, thông báo và sự đồng ý cần thiết rồi cập nhật chính sách. Hiện chưa bật quảng cáo hoặc phân tích.`]
      ]],
      terms: ['Điều khoản sử dụng', 'Hướng dẫn hiện tại về bài viết, ảnh, các bản ngôn ngữ và liên kết ROAD-PEAK.', [
        ['Website và dịch vụ', `Có hiệu lực và cập nhật: ${date}. ${operator} là website thông tin độc lập về đời sống và du lịch Hàn Quốc. Ngôn ngữ chính gồm tiếng Hàn, Trung giản thể, Nhật và Việt; các bài tiếng Anh cũ giữ nguyên địa chỉ. Chưa cung cấp dịch vụ thu phí, bán hàng, tài khoản, lưu bình luận hay nhận làm hồ sơ.`],
        ['Thông tin và ngày tham chiếu', `Đọc cùng nguồn, ngày kiểm tra và điều kiện áp dụng. Quy định, lịch, thời tiết, giá và khả năng tiếp cận có thể đổi. Dự báo không phải quan sát hay bảo đảm kết quả; cơ quan có thẩm quyền quyết định điều kiện nhập cảnh, hồ sơ và quyền lợi cá nhân. Kiểm tra nguồn chính thức trước khi đi hoặc nộp đơn.`],
        ['Bài mẫu và ngôn ngữ', `Trang ghi là bài mẫu chỉ minh họa bố cục và không nằm trong danh sách bài công khai; không phải hướng dẫn thủ tục hoàn chỉnh. Chuyển ngôn ngữ mở bản đã chuẩn bị, không tự dịch hoặc thu thập bài ngoài. Hãy báo khi thấy khác biệt về bản dịch hoặc nội dung.`],
        ['Nội dung và hình ảnh', `Kiểm tra quyền và phạm vi được phép trước khi tái sử dụng. Ghi nguồn hay dẫn liên kết không cấp quyền sao chép. Theo chú thích khi ngày, nơi chụp hoặc trải nghiệm chưa xác minh; không xem ảnh minh họa là ghi nhận tại hiện trường.`],
        ['Dịch vụ ngoài và đính chính', `Các cơ quan và nhà cung cấp bên ngoài tự vận hành hồ sơ, đặt chỗ, thanh toán, giao thông theo điều khoản và chính sách riêng. ROAD-PEAK không nhận làm hồ sơ thay họ. Gửi URL và mô tả lỗi hoặc yêu cầu quyền sử dụng đến ${email}. Lỗi được xác nhận sẽ sửa theo nguyên tắc biên tập, kèm ngày khi cần.`]
      ]]
    }
  };
  const selected = texts[lang];
  if (!selected) throw new Error(`Policy language missing: ${lang}`);
  return Object.fromEntries(Object.entries(selected).map(([route, [title, description, sections]]) => [route, {
    title, description,
    body: sections.map(([heading, paragraph]) => `<h2>${escape(heading)}</h2><p>${paragraph}</p>`).join('')
  }]));
}
