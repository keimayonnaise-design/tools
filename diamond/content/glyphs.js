/* =========================================================
   Diamond⭐︎ — マスの描画データ（glyph）
   ---------------------------------------------------------
   ここに書くのは「何が描かれるか」だけ。どう描くか（座標・順番・
   アニメ）は index.html の描画エンジンが持つ。手書きのSVGは禁止
   （仕様書 §5 F0 / §6-1）。

   データの形:
     result  : 右下に書く打撃結果 { text, trace, oval, mirror }
                 trace = 'ground'(ゴロ=下線) | 'fly'(フライ=上の弧)
                       | 'liner'(ライナー=横の線) | なし
                 oval   = true で数字を楕円で囲む（内野安打）
                 mirror = true で左右反転（見逃し三振の逆K）
     slashes : 到達した塁の数 0〜4（1本＝1つ進塁。4本で◇完成）
     reasons : 進塁の理由 { 2:'SB', 3:'(3)', 4:{circle:'3'} }
                 文字列＝そのまま書く／{circle:'n'}＝丸囲み（＝打点）
                 ※ 1塁の理由は書かない（打撃結果がその理由そのもの）
     center  : 結末（どれか1つだけ） { out:1|2|3 } | { run:true } | { lob:true }
     guides  : true で塁の名前（一塁/二塁/三塁/本塁）を薄く表示（学習用）
     highlight: 1〜4 で区画に色を掛けて「ここ」と示す（出題用）
     captions: アニメの各手順につける一言 { 'slash:2': '…' }
                 キー = result / trace / oval / slash:1〜4 / reason:2〜4 / center

   ※ ひし形の薄い下敷き（点線）は、エンジンが全マスに標準で描く。
     市販の早稲田式スコアブックと同じ（2026-07-27 本人フィードバック
     「ダイヤモンドがないと分かりにくい」を受けて標準化）。

   Diamond の決め事（教材16「記号早見表」の推奨列に合わせた・§3.2）:
     得点 = ●（中央を塗る＝一周して還ってきた）
     残塁 = ○（塗らない＝一周できなかった）
     アウト = Ⅰ Ⅱ Ⅲ（そのイニングの何アウト目か）
   ========================================================= */
(function (root) {
  'use strict';

  var G = {};

  /* ---- 空のマス・地図 ---- */
  G['empty'] = { title: '空のマス' };
  G['empty-nodiamond'] = { title: '空のマス（下敷きなし）', noDiamond: true };
  G['empty-map'] = { title: '4つに割れたマス' };
  G['empty-guides'] = { title: 'マスの地図（塁の名前つき）', guides: true };
  G['empty-quad1'] = { title: '右下の区画（ここ）', highlight: 1 };
  G['empty-quad2'] = { title: '右上の区画（ここ）', highlight: 2 };
  G['empty-quad3'] = { title: '左上の区画（ここ）', highlight: 3 };
  G['empty-quad4'] = { title: '左下の区画（ここ）', highlight: 4 };

  /* ---- ホームの主役デモ（1人の走者の"旅"） ----
     中前安打 → 盗塁で二塁 → 3番の適時打で生還。
     教材ドリル3・6・8・9の全部が1マスに入っている。 */
  G['hero'] = {
    title: '1マスは「その人の旅の記録」',
    result: { text: '8', trace: 'ground' },
    slashes: 4,
    reasons: { 2: 'SB', 3: '(3)', 4: { circle: '3' } },
    center: { run: true },
    captions: {
      result: '中堅の前へ安打。書くのは打った方向でなく、処理した野手の番号（8）',
      trace: '数字の下の線＝ゴロ。印の形が打球の軌道そのもの',
      'slash:1': '一塁へ。斜線1本＝1つ進んだ',
      'slash:2': '盗塁で二塁へ。斜線をもう1本',
      'reason:2': 'SB＝盗塁。進塁には必ず「理由」を書く',
      'slash:3': '3番打者の安打で三塁へ',
      'reason:3': '(3)＝「3番の打撃で進んだ」という理由',
      'slash:4': '本塁へ生還。斜線が4本そろった',
      'reason:4': '丸囲みの③＝この1点は3番の打点',
      center: '中央に●。◇が完成＝1点が入った'
    }
  };

  /* ---- アウト・三振 ---- */

  G['fly8-out1'] = {
    title: '中堅フライ・1アウト目',
    result: { text: '8', trace: 'fly' },
    center: { out: 1 },
    captions: {
      result: '処理した野手の番号を書く（8＝中堅手）',
      trace: '数字の上の弧＝フライ（打球が上がった）',
      center: 'アウトの瞬間に中央へ。Ⅰ＝この回の1アウト目'
    }
  };

  G['ground63-out2'] = {
    title: '遊ゴロ 6-3・2アウト目',
    result: { text: '6-3', trace: 'ground' },
    center: { out: 2 },
    captions: {
      result: '遊撃手（6）が捕って、一塁手（3）が受けた。ハイフン＝送球',
      trace: '数字の下の線＝ゴロ',
      center: '中央にⅡ＝この回の2アウト目'
    }
  };

  G['liner-4'] = {
    title: 'セカンドライナー・1アウト目',
    result: { text: '4', trace: 'liner' },
    center: { out: 1 },
    captions: {
      result: '処理した野手の番号（4＝二塁手）',
      trace: '数字の横の線＝ライナー（直線の打球）',
      center: '中央にⅠ＝1アウト目'
    }
  };

  G['foulfly-f2'] = {
    title: '捕手のファウルフライ',
    result: { text: 'f2', trace: 'fly' },
    center: { out: 1 },
    captions: {
      result: '数字の前に小さく f＝ファウルフライ（f2＝捕手が捕った）',
      center: 'アウトカウントは通常どおり中央へ'
    }
  };

  G['dp-643'] = {
    title: '併殺 6-4-3',
    result: { text: '6-4-3', trace: 'ground' },
    center: { out: 2 },
    captions: {
      result: '触った順に全部つなぐ。遊撃（6）→二塁（4）→一塁（3）',
      trace: 'ゴロの印',
      center: '打者はこの回2つ目のアウト（一塁走者が1つ目）'
    }
  };

  G['k-swing'] = {
    title: '空振り三振・1アウト目',
    result: { text: 'K' },
    center: { out: 1 },
    captions: {
      result: 'K＝空振り三振',
      center: '中央に何アウト目かを忘れずに'
    }
  };

  G['strikeout-looking'] = {
    title: '見逃し三振・3アウト目',
    result: { text: 'K', mirror: true },
    center: { out: 3 },
    captions: {
      result: '逆向きのK＝見逃し三振（空振りはふつうのK）',
      center: 'Ⅲ＝3アウト目。ここで攻撃終了'
    }
  };

  /* ---- 安打 ---- */

  G['single-9'] = {
    title: '右前安打（単打）',
    result: { text: '9', trace: 'ground' },
    slashes: 1,
    captions: {
      result: '打球方向＝処理した野手（9＝右翼手）',
      trace: 'ゴロで転がった打球',
      'slash:1': '一塁への斜線1本＝単打'
    }
  };

  G['double-7'] = {
    title: '左翼へライナーの二塁打',
    result: { text: '7', trace: 'liner' },
    slashes: 2,
    captions: {
      result: '打球方向（7＝左翼手）',
      trace: '横の線＝ライナー',
      'slash:1': '一塁を回って',
      'slash:2': '二塁へ。斜線2本＝二塁打'
    }
  };

  G['triple-8'] = {
    title: '中堅への三塁打',
    result: { text: '8', trace: 'liner' },
    slashes: 3,
    captions: {
      'slash:3': '斜線3本＝三塁打'
    }
  };

  G['hr-7'] = {
    title: '本塁打',
    result: { text: '7', trace: 'fly' },
    slashes: 4,
    center: { run: true },
    captions: {
      result: '打球方向を右下に',
      'slash:4': '一気に一周。斜線4本で◇が完成',
      center: '中央に●＝得点。これが本塁打の形'
    }
  };

  G['infield-hit'] = {
    title: '内野安打（6を楕円で囲む）',
    result: { text: '6', trace: 'ground', oval: true },
    slashes: 1,
    captions: {
      result: '遊撃へのゴロだが…',
      oval: '数字を楕円で囲む＝足で勝ち取った内野安打',
      'slash:1': '一塁へ生きた'
    }
  };

  /* ---- 打たずに出る ---- */

  G['bb-1'] = {
    title: '四球で出塁',
    result: { text: 'BB' },
    slashes: 1,
    captions: {
      result: 'BB＝四球。打数には入らない',
      'slash:1': '一塁へ'
    }
  };

  G['db-1'] = {
    title: '死球で出塁',
    result: { text: 'DB' },
    slashes: 1
  };

  G['error-6'] = {
    title: '遊撃手の失策で出塁',
    result: { text: 'E6' },
    slashes: 1,
    captions: {
      result: 'E＋野手番号＝失策。打数に入るが安打ではない',
      'slash:1': '記録は安打でなくても、塁はもらえる'
    }
  };

  G['fc-1'] = {
    title: '野手選択で出塁',
    result: { text: 'FC' },
    slashes: 1,
    captions: {
      result: 'FC＝守備が他の走者を優先した結果、打者が生きた'
    }
  };

  G['furinige-k'] = {
    title: '振り逃げ（捕逸で出塁）',
    result: { text: 'K･PB' },
    slashes: 1,
    captions: {
      result: 'まず三振（K）。そこに出塁の理由（PB＝捕逸）を添える',
      'slash:1': '三振は記録されたまま、一塁へ生きる'
    }
  };

  G['sh-bunt'] = {
    title: '犠打（送りバント）',
    result: { text: 'SH' },
    center: { out: 1 },
    captions: {
      result: 'SH＝犠打。処理の経路（例: 1-3）も添える',
      center: '自分はアウトになって走者を進めた'
    }
  };

  /* ---- 走者の記録 ---- */

  G['sb-2'] = {
    title: '安打で出て、盗塁で二塁へ',
    result: { text: '9', trace: 'ground' },
    slashes: 2,
    reasons: { 2: 'SB' },
    captions: {
      'slash:2': '盗塁で二塁へ',
      'reason:2': 'SB＝盗塁。理由を必ず書く'
    }
  };

  G['bb-to2nd-lob'] = {
    title: '四球で出塁 → 3番の打撃で二塁 → 残塁',
    result: { text: 'BB' },
    slashes: 2,
    reasons: { 2: '(3)' },
    center: { lob: true },
    captions: {
      result: 'BB＝四球で出塁',
      'slash:1': '一塁へ。斜線1本＝1つ進んだ',
      'slash:2': '3番打者の打撃で二塁へ',
      'reason:2': '(3)＝理由。「3番の打撃で進んだ」',
      center: '○＝そのまま塁に残った（残塁）'
    }
  };

  /* ---- 1イニング再現（教材ドリル14の第1問）で使うマス ----
     打順ごとに、イニングが進むにつれて姿が変わる。
     -a -b -c は「その時点でのそのマス」を表す。 */

  G['in1-b1'] = {
    title: '1番: 遊ゴロ 6-3',
    result: { text: '6-3', trace: 'ground' },
    center: { out: 1 },
    captions: {
      result: '遊撃手（6）が捕って一塁手（3）が受けた',
      trace: 'ゴロなので数字の下に線',
      center: 'この回の1アウト目なので中央にⅠ'
    }
  };

  G['in1-b2-a'] = {
    title: '2番: 四球で一塁',
    result: { text: 'BB' },
    slashes: 1,
    captions: {
      result: 'BB＝四球',
      'slash:1': '打っていなくても、一塁に着いたら斜線1本'
    }
  };
  G['in1-b2-b'] = {
    title: '2番: 3番の安打で二塁へ',
    result: { text: 'BB' },
    slashes: 2,
    reasons: { 2: '(3)' },
    captions: {
      'slash:2': '二塁へ進んだので斜線をもう1本',
      'reason:2': '(3)＝3番の打撃で進んだ、という理由'
    }
  };
  G['in1-b2-c'] = {
    title: '2番: 4番の適時打で生還（4番に打点）',
    result: { text: 'BB' },
    slashes: 4,
    reasons: { 4: { circle: '4' } },
    center: { run: true },
    captions: {
      'slash:3': '三塁へ',
      'slash:4': '本塁へ生還。斜線4本で◇が完成',
      'reason:4': '丸囲みの④＝この1点は4番の打点',
      center: '中央に●＝得点'
    }
  };

  G['in1-b3-a'] = {
    title: '3番: 右前安打',
    result: { text: '9', trace: 'ground' },
    slashes: 1,
    captions: {
      result: '右翼手（9）の前に転がる安打',
      'slash:1': '一塁へ'
    }
  };
  G['in1-b3-b'] = {
    title: '3番: 4番の安打で二塁へ',
    result: { text: '9', trace: 'ground' },
    slashes: 2,
    reasons: { 2: '(4)' },
    captions: {
      'slash:2': '二塁へ',
      'reason:2': '(4)＝4番の打撃で進んだ'
    }
  };
  G['in1-b3-end'] = {
    title: '3番: 二塁に残って残塁',
    result: { text: '9', trace: 'ground' },
    slashes: 2,
    reasons: { 2: '(4)' },
    center: { lob: true },
    captions: { center: '3アウトの時点で塁上に残ったので○（残塁）' }
  };

  G['in1-b4'] = {
    title: '4番: 左前へ適時打',
    result: { text: '7', trace: 'ground' },
    slashes: 1,
    captions: {
      result: '左翼手（7）の前に転がる安打',
      'slash:1': '一塁へ'
    }
  };
  G['in1-b4-end'] = {
    title: '4番: 一塁に残って残塁',
    result: { text: '7', trace: 'ground' },
    slashes: 1,
    center: { lob: true },
    captions: { center: '一塁に残ったので○（残塁）' }
  };

  G['in1-b5'] = {
    title: '5番: 見逃し三振',
    result: { text: 'K', mirror: true },
    center: { out: 2 },
    captions: {
      result: '逆K＝見逃し三振',
      center: 'この回2つ目のアウトなのでⅡ'
    }
  };

  G['in1-b6'] = {
    title: '6番: 一塁側のファウルフライ',
    result: { text: 'f3', trace: 'fly' },
    center: { out: 3 },
    captions: {
      result: '数字の前に小さく f＝ファウルフライ。一塁手が捕ったので f3',
      trace: 'フライの弧',
      center: 'Ⅲ＝3アウト目。攻撃終了'
    }
  };

  root.DIAMOND_GLYPHS = G;
})(typeof window !== 'undefined' ? window : globalThis);
