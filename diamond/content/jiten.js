/* =========================================================
   Diamond⭐︎ — 逆引き辞典（引く・F2）
   ---------------------------------------------------------
   「これどう書くんだっけ」を3秒で引くためのデータ。
   内容の一次情報は教材16『スコアシートの書き方』。ここに教材に
   無い記録ルールを書き起こさない（仕様書 §3.1・§6-6）。

   1項目の形:
     id        : 一意（j- で始める）
     title     : 場面の名前（引く人の言葉で）
     symbol    : Diamondの推奨記号（一覧の左に大きく出す）
     category  : 下の CATEGORIES のどれか
     yomi      : 検索用のよみがな・言い換え（ひらがな）
     glyph     : 描いて見せられる場面は DIAMOND_GLYPHS のキー
     howto     : 書き方の手順（1手順=1文）
     others    : 他でよく見る表記（他人のスコアを読むための対照。必須）
     caution   : 注意・落とし穴（任意）
     umpire    : true = 記録の判断が入る場面（連盟・審判の注意書きを出す）
     kyozaiRef : 教材16のどこが根拠か（必須）
     related   : 関連する項目の id（任意）
   ========================================================= */
(function (root) {
  'use strict';

  var CATEGORIES = [
    '打撃の結果',
    '出塁いろいろ',
    '走者と進塁',
    '結末と検算',
    '投球経過',
    '困ったとき'
  ];

  var ENTRIES = [

    /* ================= 打撃の結果 ================= */
    {
      id: 'j-goro-out', title: 'ゴロでアウト', symbol: '6-3',
      category: '打撃の結果', yomi: ['ごろ', 'ごろあうと', 'しょうきゅう', 'ないやごろ'],
      glyph: 'ground63-out2',
      howto: [
        '捕った野手と、アウトにした野手の番号を「-」でつなぐ（例: 6-3）',
        '数字の下に線＝ゴロの印',
        'アウトの瞬間に、中央へ何アウト目か（Ⅰ・Ⅱ・Ⅲ）'
      ],
      others: '大きな流儀差なし（ゴロ印の形はブックの凡例に従う）',
      caution: '触っただけの野手は書かない。アウトに直接関わった人だけ',
      kyozaiRef: 'ドリル4・ドリル5',
      related: ['j-fly-out', 'j-count']
    },
    {
      id: 'j-fly-out', title: 'フライでアウト', symbol: '8+弧',
      category: '打撃の結果', yomi: ['ふらい', 'ひきゅう', 'がいやふらい'],
      glyph: 'fly8-out1',
      howto: [
        '処理した野手の番号を書く',
        '数字の上に弧＝フライの印',
        '中央に何アウト目か'
      ],
      others: 'F8',
      caution: '書くのは打った方向でなく、捕った野手の番号',
      kyozaiRef: 'ドリル5',
      related: ['j-liner', 'j-sf', 'j-foulfly']
    },
    {
      id: 'j-liner', title: 'ライナーでアウト', symbol: '4+横線',
      category: '打撃の結果', yomi: ['らいなー', 'ちょくせん'],
      glyph: 'liner-4',
      howto: [
        '処理した野手の番号を書く',
        '数字の横に線＝ライナーの印',
        '中央に何アウト目か'
      ],
      others: 'L4',
      kyozaiRef: 'ドリル5'
    },
    {
      id: 'j-foulfly', title: 'ファウルフライ', symbol: 'f2',
      category: '打撃の結果', yomi: ['ふぁうるふらい', 'ふぁーる'],
      glyph: 'foulfly-f2',
      howto: [
        '数字の前に小さく f（例: f2＝捕手のファウルフライ）',
        'フライの弧と、中央のアウトカウントは通常どおり'
      ],
      others: 'FF2',
      kyozaiRef: 'ドリル5'
    },
    {
      id: 'j-dp', title: '併殺（ダブルプレー）', symbol: '6-4-3',
      category: '打撃の結果', yomi: ['へいさつ', 'だぶるぷれー', 'げっつー'],
      glyph: 'dp-643',
      howto: [
        '触った順に番号を全部つなぐ（例: 6-4-3）',
        '先にアウトになった走者のマスにも、アウトの経路と何アウト目かを書く',
        'DP と添える流儀もある（三重殺は TP）'
      ],
      others: 'DP併記',
      caution: '併殺の間に走者が還っても、打点はつかない',
      umpire: true,
      kyozaiRef: 'ドリル4・詳説A-3',
      related: ['j-rbi']
    },
    {
      id: 'j-single', title: '単打（シングルヒット）', symbol: '斜線1本',
      category: '打撃の結果', yomi: ['たんだ', 'ひっと', 'あんだ', 'しんぐる'],
      glyph: 'single-9',
      howto: [
        '右下に打球方向＋種類（例: 9にゴロ印＝右前安打）',
        '一塁への斜線を1本'
      ],
      others: 'H・1B',
      caution: '方向のない安打は分析に使えない。必ず方向を書く',
      kyozaiRef: 'ドリル6',
      related: ['j-double', 'j-infield']
    },
    {
      id: 'j-double', title: '二塁打', symbol: '斜線2本',
      category: '打撃の結果', yomi: ['にるいだ', 'つーべーす'],
      glyph: 'double-7',
      howto: [
        '右下に打球方向＋種類',
        '斜線を2本（一塁→二塁）'
      ],
      others: '2B',
      caution: '打撃で得た塁と、その後の進塁は区別して書く',
      kyozaiRef: 'ドリル6'
    },
    {
      id: 'j-triple', title: '三塁打', symbol: '斜線3本',
      category: '打撃の結果', yomi: ['さんるいだ', 'すりーべーす'],
      glyph: 'triple-8',
      howto: ['右下に打球方向＋種類', '斜線を3本'],
      others: '3B',
      kyozaiRef: 'ドリル6'
    },
    {
      id: 'j-hr', title: '本塁打', symbol: '◇完成',
      category: '打撃の結果', yomi: ['ほんるいだ', 'ほーむらん'],
      glyph: 'hr-7',
      howto: [
        '右下に打球方向',
        '斜線4本で◇が完成',
        '中央に得点の印（●）。自分の打点（丸囲みの自分の打順）も忘れずに'
      ],
      others: 'HR',
      kyozaiRef: 'ドリル6',
      related: ['j-run', 'j-rbi']
    },
    {
      id: 'j-infield', title: '内野安打', symbol: '数字を楕円',
      category: '打撃の結果', yomi: ['ないやあんだ'],
      glyph: 'infield-hit',
      howto: [
        '処理しようとした野手の番号＋打球の種類を書く',
        '数字を楕円で囲む＝足で勝ち取った出塁、という情報を残す',
        '一塁への斜線を1本'
      ],
      others: 'IH と添える流儀もある',
      caution: '守備が他の走者を先にアウトにしにいった結果なら、野手選択（FC）で安打ではない',
      umpire: true,
      kyozaiRef: 'ドリル6・詳説A-2',
      related: ['j-fc']
    },
    {
      id: 'j-k-swing', title: '空振り三振', symbol: 'K',
      category: '打撃の結果', yomi: ['さんしん', 'からぶり'],
      glyph: 'k-swing',
      howto: ['右下に K', '中央に何アウト目か'],
      others: '大きな流儀差なし',
      caution: '見逃しと分けて書くと、配球の分析ができる',
      kyozaiRef: 'ドリル7',
      related: ['j-k-look', 'j-furinige']
    },
    {
      id: 'j-k-look', title: '見逃し三振', symbol: '逆K',
      category: '打撃の結果', yomi: ['みのがしさんしん', 'みのがし'],
      glyph: 'strikeout-looking',
      howto: ['右下に、左右を反転したK（逆K）', '中央に何アウト目か'],
      others: 'K見・Kc',
      kyozaiRef: 'ドリル7・記号早見表',
      related: ['j-k-swing']
    },

    /* ================= 出塁いろいろ ================= */
    {
      id: 'j-bb', title: '四球', symbol: 'BB',
      category: '出塁いろいろ', yomi: ['しきゅう', 'ふぉあぼーる'],
      glyph: 'bb-1',
      howto: ['右下に BB', '一塁への斜線を1本'],
      others: 'B・四',
      caution: '打数に入らない（打率は変わらない。打席数には入る）',
      kyozaiRef: 'ドリル7',
      related: ['j-db', 'j-ibb']
    },
    {
      id: 'j-ibb', title: '故意四球（申告敬遠）', symbol: 'IBB',
      category: '出塁いろいろ', yomi: ['こいしきゅう', 'けいえん', 'しんこくけいえん'],
      howto: ['右下に IBB', '一塁への斜線を1本'],
      others: '敬',
      caution: '申告敬遠の分は投球数に加算されない',
      kyozaiRef: '記号早見表'
    },
    {
      id: 'j-db', title: '死球（デッドボール）', symbol: 'DB',
      category: '出塁いろいろ', yomi: ['しきゅう', 'でっどぼーる', 'よんしきゅう'],
      glyph: 'db-1',
      howto: ['右下に DB', '一塁への斜線を1本'],
      others: 'HBP・死',
      caution: '打数に入らない',
      kyozaiRef: 'ドリル7'
    },
    {
      id: 'j-error', title: '失策（エラー）で出塁', symbol: 'E6',
      category: '出塁いろいろ', yomi: ['しっさく', 'えらー'],
      glyph: 'error-6',
      howto: ['右下に E＋その野手の番号（例: E6）', '一塁への斜線を1本'],
      others: 'エラーの種類（捕球/送球）を添える流儀もある',
      caution: '打数に入るが安打ではない＝打率は下がる',
      umpire: true,
      kyozaiRef: 'ドリル7・詳説A-1',
      related: ['j-hit-or-error']
    },
    {
      id: 'j-fc', title: '野手選択（フィルダースチョイス）', symbol: 'FC',
      category: '出塁いろいろ', yomi: ['やしゅせんたく', 'ふぃるだーすちょいす', 'やせん'],
      glyph: 'fc-1',
      howto: [
        '右下に FC',
        '一塁への斜線を1本',
        'アウトにしにいかれた走者側のマスにも、その結果を書く'
      ],
      others: 'Fc',
      caution: '守備が他の走者を先にアウトにしにいった結果、打者が生きたとき。安打にはならない',
      umpire: true,
      kyozaiRef: 'ドリル7・詳説A-2'
    },
    {
      id: 'j-furinige', title: '振り逃げ', symbol: 'K+理由',
      category: '出塁いろいろ', yomi: ['ふりにげ'],
      glyph: 'furinige-k',
      howto: [
        'まず三振を書く（K／逆K）。打者に三振・投手に奪三振は記録される',
        '出塁の理由を添える（PB捕逸／WP暴投／E2捕手の失策）',
        '一塁でアウトになったら K＋送球の経路（例: 2-3）'
      ],
      others: 'K-PB のようにつなぐ流儀もある',
      caution: '「アウトにならなかったから三振ではない」は勘違い。三振と出塁は別々に記録する',
      umpire: true,
      kyozaiRef: 'ドリル7・詳説A-10',
      related: ['j-wp-pb']
    },
    {
      id: 'j-ci', title: '打撃妨害', symbol: '妨(打)',
      category: '出塁いろいろ', yomi: ['だげきぼうがい', 'いんたーふぇあ'],
      howto: [
        '打者は一塁へ。右下に妨害の記号を書く',
        '打数には数えない',
        '妨害した野手（ふつうは捕手）に失策を記録する'
      ],
      others: 'CI・#',
      umpire: true,
      kyozaiRef: '詳説A-11'
    },

    /* ================= 走者と進塁 ================= */
    {
      id: 'j-reason', title: '進塁の理由（打撃で進んだ）', symbol: '(3)',
      category: '走者と進塁', yomi: ['しんるい', 'りゆう', 'すすんだ'],
      glyph: 'bb-to2nd-lob',
      howto: [
        '走者が進んだ区画に斜線を1本',
        '理由が打者の打撃なら、その打者の打順番号を括弧で（例: (3)＝3番の打撃）',
        '打撃以外なら記号で（SB・WP・PB・BK・E＋番号・FC）'
      ],
      others: '大きな流儀差なし',
      caution: '理由のない進塁は、書いてないのと同じ（復元できない）',
      kyozaiRef: 'ドリル8',
      related: ['j-sb', 'j-wp-pb']
    },
    {
      id: 'j-sb', title: '盗塁', symbol: 'SB',
      category: '走者と進塁', yomi: ['とうるい', 'すちーる'],
      glyph: 'sb-2',
      howto: ['進んだ塁の区画に斜線', '同じ区画のそばに SB'],
      others: 'S・盗・O',
      caution: '暴投・捕逸・野選・失策・守備の無関心で進んだときは盗塁ではない',
      umpire: true,
      kyozaiRef: 'ドリル8・詳説A-8',
      related: ['j-cs', 'j-wp-pb']
    },
    {
      id: 'j-cs', title: '盗塁死（盗塁失敗）', symbol: 'CS 2-6',
      category: '走者と進塁', yomi: ['とうるいし', 'とうるいしっぱい'],
      howto: [
        'アウトになった区画に、送球の経路（例: 2-6＝捕手→遊撃手のタッチ）',
        '中央に何アウト目か',
        'CS と添える'
      ],
      others: '盗塁死は「盗」に×を重ねる流儀もある',
      kyozaiRef: 'ドリル8・記号早見表'
    },
    {
      id: 'j-po', title: '牽制死', symbol: 'PO 1-3',
      category: '走者と進塁', yomi: ['けんせいし', 'けんせい'],
      howto: [
        'アウトになった区画に経路（例: 1-3＝投手→一塁手）',
        '中央に何アウト目か',
        'PO と添える'
      ],
      others: '牽',
      kyozaiRef: 'ドリル8・記号早見表'
    },
    {
      id: 'j-wp-pb', title: '暴投と捕逸、どっち？', symbol: 'WP/PB',
      category: '走者と進塁', yomi: ['ぼうとう', 'ほいつ', 'わいるどぴっち', 'ぱすぼーる'],
      howto: [
        '軸:「捕手が普通の守備で止められた球か」',
        '止められない球で進んだ＝暴投 WP（投手の記録）',
        '止められた球を逸らした＝捕逸 PB（捕手の記録）',
        '進んだ区画に記号を書く'
      ],
      others: 'W／P',
      caution: 'どちらも失策（E）ではなく、独立した記録',
      umpire: true,
      kyozaiRef: '詳説A-9'
    },
    {
      id: 'j-balk', title: 'ボーク', symbol: 'BK',
      category: '走者と進塁', yomi: ['ぼーく'],
      howto: ['全走者が1つずつ進む', 'それぞれ進んだ区画に BK'],
      others: '大きな流儀差なし',
      kyozaiRef: 'ドリル8・記号早見表'
    },
    {
      id: 'j-rundown', title: '挟殺（ランダウン）', symbol: '6-4-6-3',
      category: '走者と進塁', yomi: ['きょうさつ', 'らんだうん', 'はさまれた'],
      howto: [
        'ボールに触った野手を、順に全部つなげる（例: 6-4-6-3）',
        '長くなっても省略しない。往復の長さが守備の乱れの証拠になる'
      ],
      others: '大きな流儀差なし',
      kyozaiRef: '詳説A-18'
    },
    {
      id: 'j-ob', title: '走塁妨害', symbol: '妨(走)',
      category: '走者と進塁', yomi: ['そうるいぼうがい', 'おぶすとらくしょん'],
      howto: [
        '走者に与えられた進塁を、区画に記号つきで書く',
        '妨害した野手を記録に残す'
      ],
      others: 'OB',
      umpire: true,
      kyozaiRef: '詳説A-12'
    },
    {
      id: 'j-iff', title: 'インフィールドフライ', symbol: 'IFF',
      category: '走者と進塁', yomi: ['いんふぃーるどふらい'],
      howto: [
        '打球の結果をふつうに書き、IFF と添える',
        '落球しても打者はアウト。本来捕るべき野手に刺殺を記録'
      ],
      others: 'IF',
      umpire: true,
      kyozaiRef: '詳説A-15'
    },
    {
      id: 'j-ph-pr', title: '代打・代走', symbol: 'PH/PR',
      category: '走者と進塁', yomi: ['だいだ', 'だいそう', 'こうたい'],
      howto: [
        '交代した打順の欄を区切り（波線が一般的）、下に新しい選手名',
        '代打は PH、代走は PR。交代したイニングも添える',
        '打順はそのまま引き継がれる'
      ],
      others: '大きな流儀差なし',
      caution: '一度退いた選手は再出場できない（原則）。10番目の打順を作らない',
      kyozaiRef: 'ドリル12'
    },
    {
      id: 'j-sh', title: '犠打（送りバント）', symbol: 'SH',
      category: '走者と進塁', yomi: ['ぎだ', 'おくりばんと', 'ばんと'],
      glyph: 'sh-bunt',
      howto: [
        '処理の経路を書き（例: 1-3）、SH と添える',
        '進んだ走者の区画には、斜線＋理由（打者の打順番号）'
      ],
      others: '犠・SAC',
      caution: '2アウトでは犠打にならない（ふつうの打数に数える）。無死・一死で走者が進み、自分はアウトのときだけ',
      umpire: true,
      kyozaiRef: '詳説A-5',
      related: ['j-sf']
    },
    {
      id: 'j-sf', title: '犠飛（犠牲フライ）', symbol: 'SF',
      category: '走者と進塁', yomi: ['ぎひ', 'ぎせいふらい', 'たっちあっぷ'],
      howto: [
        '外野フライの結果をふつうに書き、SF と添える',
        '還った走者のマスに、得点と打点（丸囲みの打順番号）'
      ],
      others: '犠飛',
      caution: '外野への飛球で走者が生還（得点）したときだけ。三塁止まりは犠飛ではない',
      umpire: true,
      kyozaiRef: '詳説A-6',
      related: ['j-sh', 'j-rbi']
    },

    /* ================= 結末と検算 ================= */
    {
      id: 'j-count', title: 'アウトカウント', symbol: 'Ⅰ Ⅱ Ⅲ',
      category: '結末と検算', yomi: ['あうと', 'あうとかうんと'],
      glyph: 'fly8-out1',
      howto: [
        'アウトの瞬間に、そのマスの中央へ',
        'この回の何アウト目かを書く（Ⅰ・Ⅱ・Ⅲ）'
      ],
      others: '①②③',
      caution: '中央の空白は、後から絶対に埋められない致命傷になる',
      kyozaiRef: 'ドリル9'
    },
    {
      id: 'j-run', title: '得点（生還）', symbol: '●',
      category: '結末と検算', yomi: ['とくてん', 'せいかん', 'ほーむいん'],
      glyph: 'hero',
      howto: [
        '斜線4本で◇が完成したら',
        '中央に得点の印（Diamondは●で塗る）',
        '誰の打点かも一息で書く（次の項目）'
      ],
      others: '塗りつぶし方はチーム様式で統一',
      kyozaiRef: 'ドリル9',
      related: ['j-rbi', 'j-hr']
    },
    {
      id: 'j-rbi', title: '打点', symbol: '③丸囲み',
      category: '結末と検算', yomi: ['だてん'],
      glyph: 'hero',
      howto: [
        '還った走者のマスの本塁区画に、還した打者の打順番号を丸で囲んで書く',
        '打点にならない得点は、丸で囲まない（ここで打点の有無を表す）'
      ],
      others: '大きな流儀差なし',
      caution: '併殺の間の生還・失策による得点は打点なし。押し出しの四死球は打点あり',
      umpire: true,
      kyozaiRef: 'ドリル9・詳説A-3・A-4',
      related: ['j-run']
    },
    {
      id: 'j-lob', title: '残塁', symbol: '○',
      category: '結末と検算', yomi: ['ざんるい', 'のこった'],
      glyph: 'bb-to2nd-lob',
      howto: [
        '3アウトの時点で塁上にいた走者の中央に、残塁の印（Diamondは○）',
        'イニングの下に、その回の残塁数を書く'
      ],
      others: 'L・R など',
      kyozaiRef: 'ドリル9'
    },
    {
      id: 'j-kensan', title: '検算①（イニングの検算）', symbol: '打=ア+得+残',
      category: '結末と検算', yomi: ['けんさん', 'たしかめ', 'あわない'],
      howto: [
        '打者数＝アウト＋得点＋残塁 を数える',
        '合わなければ、どこかのマスの中央が空白か、進塁の理由の書き落とし',
        '合わないイニングを特定して、1打席ずつたどる'
      ],
      others: '（検算は流儀でなく算数）',
      caution: '合わないのは悪くない。気づかないのが問題',
      kyozaiRef: 'ドリル13'
    },
    {
      id: 'j-inning-close', title: 'イニングの締め方', symbol: '区切り線',
      category: '結末と検算', yomi: ['いにんぐ', 'こうたいのとき', 'しめ'],
      howto: [
        '得点と残塁を書く',
        '3アウト目の下に区切りの線（太線が一般的）',
        'ここまでを3秒で。次の回の準備へ'
      ],
      others: '線の引き方はブックの凡例に従う',
      kyozaiRef: 'ドリル9'
    },

    /* ================= 投球経過 ================= */
    {
      id: 'j-pitchcount', title: '投球カウントの付け方', symbol: '●／×△□',
      category: '投球経過', yomi: ['かうんと', 'とうきゅう', 'ぼーる', 'すとらいく', 'ふぁうる'],
      howto: [
        '1球ごとにカウント欄へ1つずつ',
        'ボール●／見逃しストライク／／空振り×／ファウル△／打った□',
        'この様式はチームで1つに統一する（Diamondは教材の推奨）'
      ],
      others: '様式はさまざま（ブックの凡例が最優先）',
      kyozaiRef: 'ドリル11・記号早見表'
    },
    {
      id: 'j-pitchtype', title: '球種のメモ', symbol: 'S・C・SL',
      category: '投球経過', yomi: ['きゅうしゅ', 'へんかきゅう'],
      howto: [
        '取るなら、試合前に投手ごとの略号を決めておく',
        '例: S直球・Cカーブ・SLスライダー・Fフォーク・CHチェンジアップ'
      ],
      others: '取らないチームも多い（まずはカウントだけで十分）',
      kyozaiRef: 'ドリル10・記号早見表'
    },

    /* ================= 困ったとき ================= */
    {
      id: 'j-hit-or-error', title: '安打か、失策か', symbol: '軸で判定',
      category: '困ったとき', yomi: ['あんだかしっさくか', 'えらーかひっとか', 'まよう'],
      howto: [
        '軸:「普通の守備をしていればアウトにできたか」',
        'できた＝失策（E＋番号）。届かない打球＝安打',
        '判断が割れる微妙な打球は、打者に有利に解釈するのが一般的'
      ],
      others: '（名手なら捕れた、は理由にならない。基準は「普通の守備」）',
      umpire: true,
      kyozaiRef: '詳説A-1',
      related: ['j-error', 'j-infield']
    },
    {
      id: 'j-osidashi', title: '押し出しの四死球', symbol: '打点あり',
      category: '困ったとき', yomi: ['おしだし', 'まんるい'],
      howto: [
        '打者の出塁はふつうの四球・死球として書く',
        '得点が入り、打点も記録される（丸囲みを忘れない）'
      ],
      others: '大きな流儀差なし',
      umpire: true,
      kyozaiRef: '詳説A-4',
      related: ['j-rbi']
    },
    {
      id: 'j-catchup', title: '追いつけなくなったら', symbol: '止まるな',
      category: '困ったとき', yomi: ['おいつけない', 'まにあわない', 'ぱにっく'],
      howto: [
        'まず「今のアウトカウントと走者の位置」だけを余白にメモ（これで後から復元できる）',
        '新しいプレーを優先して取り、古い分は投手交代・タイム・攻守交代の間に埋める',
        'それでも分からない箇所は「？」＋日本語メモを残し、試合後に確認'
      ],
      others: '（合言葉は「遅れてもいい、止まるな」）',
      kyozaiRef: 'ドリル11',
      related: ['j-memo']
    },
    {
      id: 'j-memo', title: '分類に迷うプレーが起きたら', symbol: '？＋メモ',
      category: '困ったとき', yomi: ['わからない', 'まよったら', 'めも'],
      howto: [
        '起きた事実を日本語で余白にメモ（例:「6が弾いた→一塁生きた」）',
        '分類（安打か失策か等）は後から確定できる。事実は思い出せない',
        '空白にだけはしない'
      ],
      others: '（記録は審判の判定に反してはならない。決められるのは分類だけ）',
      umpire: true,
      kyozaiRef: '詳説A 判断の最終原則',
      related: ['j-hit-or-error', 'j-catchup']
    }
  ];

  root.DIAMOND_JITEN = {
    categories: CATEGORIES,
    entries: ENTRIES
  };
})(typeof window !== 'undefined' ? window : globalThis);
