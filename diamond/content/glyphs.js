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
     captions: アニメの各手順につける一言 { 'slash:2': '…' }
                 キー = result / trace / slash:1〜4 / reason:2〜4 / center

   Diamond の決め事（教材16「記号早見表」の推奨列に合わせた・§3.2）:
     得点 = ●（中央を塗る＝一周して還ってきた）
     残塁 = ○（塗らない＝一周できなかった）
     アウト = Ⅰ Ⅱ Ⅲ（そのイニングの何アウト目か）
   ========================================================= */
(function (root) {
  'use strict';

  var G = {};

  /* ---- 空のマス（地図の説明用） ----
     diamond: ひし形の下敷きを薄く出す（区画の位置を示すため）
     guides : そのうえに塁の名前も出す（答えそのものなので、出題側では使わない） */
  G['empty'] = { title: '空のマス' };
  G['empty-map'] = { title: '4つに割れたマス', diamond: true };
  G['empty-guides'] = { title: 'マスの地図（塁の名前つき）', diamond: true, guides: true };

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
      result: '中堅へゴロの安打。書くのは打った方向でなく、処理した野手の番号（8）',
      trace: '数字の下に線＝ゴロ。印の形が打球の軌道そのもの',
      'slash:1': '一塁へ。斜線1本＝1つ進んだ',
      'slash:2': '盗塁で二塁へ',
      'reason:2': 'SB＝盗塁。進塁には必ず「理由」を書く',
      'slash:3': '3番打者の安打で三塁へ',
      'reason:3': '(3)＝3番の打撃で進んだ、という意味',
      'slash:4': '本塁へ生還。斜線が4本そろった',
      'reason:4': '丸囲みの③＝この生還は3番の打点',
      center: '中央に●。◇が完成＝1点が入った'
    }
  };

  /* ---- 診断・解説で使う例 ---- */

  // 中堅フライでこの回1アウト目
  G['fly8-out1'] = {
    title: '中堅フライ・1アウト目',
    result: { text: '8', trace: 'fly' },
    center: { out: 1 }
  };

  // 遊ゴロ 6-3 で2アウト目
  G['ground63-out2'] = {
    title: '遊ゴロ 6-3・2アウト目',
    result: { text: '6-3', trace: 'ground' },
    center: { out: 2 }
  };

  // 四球で出て、3番の打撃で二塁へ（イニング終了時なので残塁）
  G['bb-to2nd-lob'] = {
    title: '四球で出塁 → 3番の打撃で二塁 → 残塁',
    result: { text: 'BB' },
    slashes: 2,
    reasons: { 2: '(3)' },
    center: { lob: true }
  };

  // 見逃し三振（逆K）・3アウト目
  G['strikeout-looking'] = {
    title: '見逃し三振・3アウト目',
    result: { text: 'K', mirror: true },
    center: { out: 3 }
  };

  // 二塁打（左翼へライナー）
  G['double-7'] = {
    title: '左翼へライナーの二塁打',
    result: { text: '7', trace: 'liner' },
    slashes: 2
  };

  // 内野安打（楕円で囲む）
  G['infield-hit'] = {
    title: '内野安打（6を楕円で囲む）',
    result: { text: '6', trace: 'ground', oval: true },
    slashes: 1
  };

  // 失策で出塁
  G['error-6'] = {
    title: '遊撃手の失策で出塁',
    result: { text: 'E6' },
    slashes: 1
  };

  root.DIAMOND_GLYPHS = G;
})(typeof window !== 'undefined' ? window : globalThis);
